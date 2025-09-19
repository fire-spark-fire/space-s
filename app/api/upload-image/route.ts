import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: '没有接收到文件' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '请上传有效的图片文件' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'avatars')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name) || '.jpg'
    const filename = `member_${timestamp}${extension}`
    const filepath = path.join(uploadsDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    const imagePath = `/avatars/${filename}`

    return NextResponse.json({ 
      success: true, 
      imagePath,
      message: '图片上传成功' 
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: '图片上传失败' }, 
      { status: 500 }
    )
  }
}
