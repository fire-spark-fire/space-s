import { NextResponse } from "next/server"
import { refreshAccessToken } from "@/lib/refreshAccessToken"

export const runtime = "nodejs"

export async function POST(request: Request) {
    const formData = await request.formData()

    const name = formData.get("name") as string | null
    const contactEmail = formData.get("contactEmail") as string | null
    const file = formData.get("cv") as File | null

    if (!name || !contactEmail || !file) {
        return NextResponse.json({ error: "缺少必要信息" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 3 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "文件大小必须小于 3MB" }, { status: 400 })
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
    const base64File = buffer.toString("base64")

    const accessToken = await refreshAccessToken(process.env.MS_REFRESH_TOKEN!)

    // Email payload: to HR
    const hrEmailPayload = {
        message: {
            subject: `New Application from ${name}`,
            body: {
                contentType: "Text",
                content: `Applicant Name: ${name}\nContact Email: ${contactEmail}`,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: process.env.SMTP_USER!,
                    },
                },
            ],
            attachments: [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: file.name,
                    contentBytes: base64File,
                },
            ],
        },
        saveToSentItems: "true",
    }


    // Email payload: confirmation to applicant
    const confirmationPayload = {
        message: {
            subject: "我们已收到你的申请 | Spark",
            body: {
                contentType: "Text",
                content: `${name}，你好！\n\n感谢你对 Spark 的关注，我们已成功收到你的简历，团队将尽快与您联系。\n\nSpark 团队敬上`,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: contactEmail,
                    },
                },
            ],
        },
        saveToSentItems: "true",
    }

    try {
        // 1. Send to HR
        const hrRes = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(hrEmailPayload),
        })

        if (!hrRes.ok) {
            const error = await hrRes.json()
            throw new Error("HR email failed: " + JSON.stringify(error))
        }

        // 2. Send confirmation to applicant
        const confirmRes = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(confirmationPayload),
        })

        if (!confirmRes.ok) {
            const error = await confirmRes.json()
            throw new Error("Applicant confirmation failed: " + JSON.stringify(error))
        }

        return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 })
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        console.error("Email sending error:", errorMessage)
        return NextResponse.json({ error: "邮件发送失败，请稍后再试" }, { status: 500 })
    }
}
