#!/bin/bash

# 阿里云服务器部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

# 配置变量 (请根据实际情况修改)
SERVER_HOST="${ALIYUN_HOST:-your-server-ip}"
SERVER_USER="${ALIYUN_USERNAME:-root}"
SERVER_PORT="${ALIYUN_PORT:-22}"
DEPLOY_DIR="/var/www/space-s"
PROJECT_NAME="space-s"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要的工具
check_requirements() {
    echo_info "检查部署环境..."
    
    if ! command -v npm &> /dev/null; then
        echo_error "npm 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        echo_error "ssh 未安装"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        echo_error "scp 未安装"
        exit 1
    fi
}

# 构建项目
build_project() {
    echo_info "构建项目..."
    npm ci
    npm run build
    
    if [ ! -d ".next" ]; then
        echo_error "构建失败，.next 目录不存在"
        exit 1
    fi
}

# 创建部署包
create_package() {
    echo_info "创建部署包..."
    
    # 清理之前的部署包
    rm -rf deploy deploy.tar.gz
    
    # 创建部署目录
    mkdir -p deploy
    
    # 复制必要文件
    cp -r .next deploy/
    cp -r public deploy/
    cp package.json deploy/
    cp package-lock.json deploy/
    cp next.config.ts deploy/
    
    # 创建压缩包
    tar -czf deploy.tar.gz -C deploy .
    
    echo_info "部署包创建完成: deploy.tar.gz"
}

# 备份服务器上的现有版本
backup_server() {
    echo_info "备份服务器现有版本..."
    
    BACKUP_NAME="backup-$(date +%Y%m%d_%H%M%S)"
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        if [ -d "$DEPLOY_DIR" ]; then
            sudo mkdir -p /var/www/backups
            sudo cp -r $DEPLOY_DIR /var/www/backups/$BACKUP_NAME
            echo "备份已保存到 /var/www/backups/$BACKUP_NAME"
        fi
EOF
}

# 停止服务
stop_service() {
    echo_info "停止远程服务..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        pm2 stop $PROJECT_NAME || echo "服务未运行或已停止"
EOF
}

# 上传文件
upload_files() {
    echo_info "上传部署包到服务器..."
    
    scp -P $SERVER_PORT deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/
}

# 部署应用
deploy_app() {
    echo_info "部署应用..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        # 创建部署目录
        sudo mkdir -p $DEPLOY_DIR
        cd $DEPLOY_DIR
        
        # 清理旧文件
        sudo rm -rf .next public package.json package-lock.json next.config.ts node_modules
        
        # 解压新文件
        sudo tar -xzf /tmp/deploy.tar.gz
        sudo chown -R \$(whoami):\$(whoami) .
        
        # 安装依赖
        npm ci --only=production
        
        # 启动或重启服务
        pm2 start npm --name "$PROJECT_NAME" -- start || pm2 restart $PROJECT_NAME
        
        # 清理临时文件
        rm -f /tmp/deploy.tar.gz
        
        echo "✅ 部署完成！"
EOF
}

# 验证部署
verify_deployment() {
    echo_info "验证部署结果..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        sleep 3
        if pm2 list | grep -q "$PROJECT_NAME.*online"; then
            echo "✅ 应用启动成功"
            pm2 show $PROJECT_NAME
        else
            echo "❌ 应用启动失败"
            pm2 logs $PROJECT_NAME --lines 10
            exit 1
        fi
EOF
}

# 清理本地文件
cleanup() {
    echo_info "清理本地临时文件..."
    rm -rf deploy deploy.tar.gz
}

# 主函数
main() {
    echo_info "开始部署 $PROJECT_NAME 到阿里云服务器..."
    echo_info "目标服务器: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
    
    # 检查配置
    if [ "$SERVER_HOST" = "your-server-ip" ]; then
        echo_error "请先配置服务器地址"
        echo_warn "设置环境变量: export ALIYUN_HOST=your-server-ip"
        exit 1
    fi
    
    # 执行部署步骤
    check_requirements
    build_project
    create_package
    backup_server
    stop_service
    upload_files
    deploy_app
    verify_deployment
    cleanup
    
    echo_info "🎉 部署完成！"
    echo_info "访问地址: http://$SERVER_HOST:3000"
}

# 捕获错误并清理
trap 'echo_error "部署失败，正在清理..."; cleanup; exit 1' ERR

# 运行主函数
main "$@" 