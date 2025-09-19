import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

interface Member {
  memberName: string
  tags: string[]
  introduction: string
  image: string
}

interface RequestBody extends Member {
  timestamp?: number
  userAgent?: string
}

// In-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 300000 // 5 minutes
const RATE_LIMIT_MAX = 3 // Max 3 requests per window

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}:${userAgent}`
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      const remainingTime = Math.ceil((rateLimit.resetTime! - Date.now()) / 1000)
      return NextResponse.json(
        { 
          error: '请求过于频繁',
          message: `请在 ${Math.ceil(remainingTime / 60)} 分钟后重试`,
          retryAfter: remainingTime
        }, 
        { status: 429 }
      )
    }

    // CSRF Token validation
    const csrfToken = request.headers.get('x-csrf-token')
    if (!csrfToken) {
      return NextResponse.json({ error: '缺少安全验证令牌' }, { status: 403 })
    }

    const requestBody: RequestBody = await request.json()
    const { timestamp, ...newMember } = requestBody
    
    // Basic timestamp validation (request shouldn't be too old)
    if (timestamp && Date.now() - timestamp > 300000) { // 5 minutes
      return NextResponse.json({ error: '请求已过期，请刷新页面重试' }, { status: 400 })
    }
    
    // Validate required fields
    if (!newMember.memberName || !newMember.introduction || !newMember.tags?.length || !newMember.image) {
      return NextResponse.json({ error: '请填写所有必需字段' }, { status: 400 })
    }

    // Additional input validation
    if (newMember.memberName.length > 50) {
      return NextResponse.json({ error: '姓名长度不能超过50个字符' }, { status: 400 })
    }
    
    if (newMember.introduction.length > 500) {
      return NextResponse.json({ error: '个人介绍长度不能超过500个字符' }, { status: 400 })
    }
    
    if (newMember.tags.length > 5) {
      return NextResponse.json({ error: '标签数量不能超过5个' }, { status: 400 })
    }
    
    if (newMember.tags.some(tag => tag.length > 20)) {
      return NextResponse.json({ error: '单个标签长度不能超过20个字符' }, { status: 400 })
    }

    // Read current constants file
    const constantsPath = path.join(process.cwd(), 'constants', 'default.ts')
    const constantsContent = await readFile(constantsPath, 'utf-8')
    
    // Parse existing members
    const membersMatch = constantsContent.match(/export const MEMBERS = (\[[\s\S]*?\]);?$/m)
    if (!membersMatch) {
      return NextResponse.json({ error: '无法读取现有成员数据' }, { status: 500 })
    }

    // Convert the matched string to JSON by replacing single quotes and handling the structure
    const membersArrayStr = membersMatch[1]
    
    // Add the new member to the array string
    const newMemberStr = `  {
    memberName: "${newMember.memberName.replace(/"/g, '\\"')}",
    tags: [${newMember.tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}],
    introduction: "${newMember.introduction.replace(/"/g, '\\"')}",
    image: "${newMember.image}"
  }`

    // Insert new member at the end of the array (before the closing bracket)
    const insertPosition = membersArrayStr.lastIndexOf(']')
    const hasExistingMembers = membersArrayStr.trim().length > 2 // More than just "[]"
    
    const updatedMembersArrayStr = 
      membersArrayStr.substring(0, insertPosition) + 
      (hasExistingMembers ? ',\n' : '') +
      newMemberStr + 
      (hasExistingMembers ? '\n' : '') +
      membersArrayStr.substring(insertPosition)

    // Update the constants file
    const updatedConstantsContent = constantsContent.replace(
      /export const MEMBERS = \[[\s\S]*?\];?$/m,
      `export const MEMBERS = ${updatedMembersArrayStr}`
    )

    await writeFile(constantsPath, updatedConstantsContent, 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: '成员添加成功',
      member: newMember
    })

  } catch (error) {
    console.error('Add member error:', error)
    return NextResponse.json(
      { error: '添加成员失败，请重试' }, 
      { status: 500 }
    )
  }
}
