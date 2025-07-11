import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(request: Request) {
    const formData = await request.formData()

    const name = formData.get("name") as string | null
    const contact = formData.get("contact") as string | null
    const file = formData.get("cv") as File | null

    if (!name || !contact || !file) {
        return NextResponse.json({ error: "缺少必要信息" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "文件大小必须小于 10MB" }, { status: 400 })
    }

    // Validate file type (PDF or DOCX)
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "仅支持 PDF 或 DOCX 文件" }, { status: 400 })
    }

    // Convert file to Buffer for email attachment
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const designatedEmail = process.env.RECRUIT_EMAIL

    try {
        // Send CV to HR/designated mailbox
        await transporter.sendMail({
            from: `Spark Careers <${process.env.SMTP_USER}>`,
            to: designatedEmail,
            subject: `New Application from ${name}`,
            text: `Applicant: ${name}\nContact (email): ${contact}`,
            attachments: [
                {
                    filename: file.name,
                    content: buffer,
                },
            ],
        })

        // Confirmation email to applicant
        await transporter.sendMail({
            from: `Spark Careers <${process.env.SMTP_USER}>`,
            to: contact,
            subject: "我们已收到你的申请 | Spark",
            text: `${name}，你好！\n\n感谢你对 Spark 的关注，我们已成功收到你的简历，团队将尽快与您联系。\n\nSpark 团队敬上`,
        })

        return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Email sending error:", error)
        return NextResponse.json({ error: "服务器错误，邮件发送失败" }, { status: 500 })
    }
}
