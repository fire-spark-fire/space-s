"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useState } from "react"

export default function Application() {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        cv: null as File | null,
    })
    

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, cv: e.target.files[0] })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        // Handle form submission here
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
                                    姓名
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
                                    htmlFor="contact"
                                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                                >
                                    联系方式
                                </label>
                                <Input
                                    id="contact"
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white"
                                    placeholder="联系方式"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="cv"
                                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                                >
                                    上传简历
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