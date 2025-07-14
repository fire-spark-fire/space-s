"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useState } from "react"

export default function Application() {
    const [formData, setFormData] = useState({
        name: "",
        contactEmail: "",
        cv: null as File | null,
    })

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const maxSize = 10 * 1024 * 1024 // 10MB
    

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ]

            if (!allowedTypes.includes(file.type)) {
                setError("仅支持 PDF 或 DOCX 文件")
                setFormData({ ...formData, cv: null })
                return
            }

            if (file.size > maxSize) {
                setError("文件大小必须小于 10MB")
                setFormData({ ...formData, cv: null })
                return
            }

            setError(null)
            setFormData({ ...formData, cv: file })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.cv) {
            setError("请上传符合要求的简历文件")
            return
        }

        const data = new FormData()
        data.append("name", formData.name)
        data.append("contactEmail", formData.contactEmail)
        data.append("cv", formData.cv)

        try {
            const res = await fetch("/api/apply", {
                method: "POST",
                body: data,
            })
            const json = await res.json()
            if (!res.ok) {
                throw new Error(json.error || "提交失败")
            }
            setSuccess("提交成功！请检查邮箱确认邮件。")
            setError(null)
            setFormData({ name: "", contactEmail: "", cv: null })
        } catch (err: any) {
            setError(err.message || "提交失败")
            setSuccess(null)
        }
    }

    return (
        <section id="application" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                        加入 SPARK
                    </h2>
                    <p className="text-xl text-gray-300">
                        带你激发更多智慧的回响
                    </p>
                </div>

                <Card className="bg-gray-900/50 border-red-600/20 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-orange-400 text-center tracking-wide">开启探索之旅</CardTitle>
                        <CardDescription className="text-gray-300 text-center">
                            填写申请表单
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                                >
                                    姓名*
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white"
                                    placeholder="姓名或昵称"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contactEmail"
                                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                                >
                                    email*
                                </label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white"
                                    placeholder="email"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="cv"
                                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                                >
                                    上传简历*
                                </label>
                                <div className="relative">
                                    <Input
                                        id="cv"
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white file:bg-red-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {formData.cv && <p className="text-sm text-green-400 mt-2">文件已选择: {formData.cv.name}</p>}
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            {success && <p className="text-sm text-green-500">{success}</p>}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 uppercase tracking-wider"
                            >
                                提交申请
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>

    )
}