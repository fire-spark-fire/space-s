# 阿里云部署配置指南

## 🚀 GitHub Actions 自动部署设置

### 1. 配置 GitHub Secrets

在您的 GitHub 仓库中，前往 `Settings > Secrets and variables > Actions`，添加以下 Secrets：

| Secret 名称 | 描述 | 示例值 |
|-------------|------|--------|
| `ALIYUN_HOST` | 阿里云服务器 IP 地址 | `123.456.789.0` |
| `ALIYUN_USERNAME` | SSH 用户名 | `root` 或 `ubuntu` |
| `ALIYUN_SSH_KEY` | SSH 私钥内容 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `ALIYUN_PORT` | SSH 端口（可选，默认 22） | `22` |

### 2. 生成 SSH 密钥对

如果您还没有 SSH 密钥，请在本地生成：

```bash
# 生成新的 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/aliyun_deploy

# 查看公钥内容（需要添加到服务器）
cat ~/.ssh/aliyun_deploy.pub

# 查看私钥内容（需要添加到 GitHub Secrets）
cat ~/.ssh/aliyun_deploy
```

### 3. 配置阿里云服务器

#### 3.1 添加 SSH 公钥到服务器

```bash
# 在服务器上执行
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

#### 3.2 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (推荐使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 (进程管理器)
sudo npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))

# 创建部署目录
sudo mkdir -p /var/www/space-s
sudo chown -R $(whoami):$(whoami) /var/www/space-s
```

#### 3.3 配置 Nginx（可选，用于反向代理）

```bash
# 安装 Nginx
sudo apt install nginx -y

# 创建 Nginx 配置
sudo tee /etc/nginx/sites-available/space-s << EOF
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或服务器IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/space-s /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 使用方式

#### 4.1 手动触发部署

1. 前往 GitHub 仓库的 `Actions` 标签页
2. 选择 `Deploy to Aliyun Server` workflow
3. 点击 `Run workflow` 按钮
4. 选择部署环境（production/staging）
5. 点击 `Run workflow` 开始部署

#### 4.2 自动触发部署

- 当代码推送到 `main` 分支时自动触发
- 当 Pull Request 合并到 `main` 分支时自动触发

### 5. 部署流程说明

1. **代码检出**: 获取最新代码
2. **环境设置**: 安装 Node.js 和依赖
3. **项目构建**: 执行 `npm run build`
4. **创建部署包**: 打包必要文件
5. **服务器备份**: 备份当前版本
6. **停止服务**: 停止正在运行的应用
7. **文件上传**: 上传新版本到服务器
8. **解压安装**: 解压并安装依赖
9. **启动服务**: 使用 PM2 启动应用

### 6. 监控和管理

#### 查看应用状态
```bash
pm2 status
pm2 logs space-s
pm2 monit
```

#### 手动重启应用
```bash
pm2 restart space-s
```

#### 查看部署日志
在 GitHub Actions 页面查看详细的部署日志。

### 7. 故障排除

#### 常见问题

1. **SSH 连接失败**
   - 检查服务器 IP 和端口
   - 确认 SSH 密钥格式正确
   - 检查服务器防火墙设置

2. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认所有依赖正确安装

3. **PM2 启动失败**
   - 检查端口 3000 是否被占用
   - 确认 PM2 正确安装

#### 回滚到之前版本

```bash
# 查看备份
ls /var/www/backups/

# 回滚到指定备份
sudo cp -r /var/www/backups/space-s-YYYYMMDD_HHMMSS/* /var/www/space-s/
pm2 restart space-s
```

## 🔐 安全建议

1. 定期更新服务器系统和软件包
2. 使用防火墙限制不必要的端口访问
3. 定期轮换 SSH 密钥
4. 监控部署日志，及时发现异常

## 📞 支持

如果遇到问题，请检查：
1. GitHub Actions 运行日志
2. 服务器上的应用日志：`pm2 logs space-s`
3. Nginx 日志（如果使用）：`sudo tail -f /var/log/nginx/error.log` 