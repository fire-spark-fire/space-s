'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Plus, CheckCircle, AlertCircle } from "lucide-react"
import Image from 'next/image'

interface FormData {
  memberName: string
  introduction: string
  tags: string[]
  image: string
}

interface AlertProps {
  type: 'success' | 'error'
  message: string
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    memberName: '',
    introduction: '',
    tags: [],
    image: ''
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<AlertProps | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form protection states
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  const [csrfToken, setCsrfToken] = useState<string>('')
  
  // Rate limiting constants
  const MAX_ATTEMPTS = 3 // Maximum attempts before blocking
  const BLOCK_DURATION = 300000 // 5 minutes in milliseconds
  const MIN_SUBMIT_INTERVAL = 5000 // 5 seconds between submissions

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateCSRFToken = () => {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      setCsrfToken(token)
      sessionStorage.setItem('csrf_token', token)
    }
    generateCSRFToken()
  }, [])

  // Handle block timer
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1000) {
            setIsBlocked(false)
            setSubmitAttempts(0)
            return 0
          }
          return prev - 1000
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  // Check if user should be blocked
  const checkRateLimit = (): boolean => {
    const now = Date.now()
    
    // Check if user is currently blocked
    if (isBlocked) {
      const remaining = Math.ceil(blockTimeRemaining / 1000)
      setAlert({ 
        type: 'error', 
        message: `提交过于频繁，请在 ${remaining} 秒后重试` 
      })
      return false
    }
    
    // Check minimum interval between submissions
    if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
      const waitTime = Math.ceil((MIN_SUBMIT_INTERVAL - (now - lastSubmitTime)) / 1000)
      setAlert({ 
        type: 'error', 
        message: `请等待 ${waitTime} 秒后再次提交` 
      })
      return false
    }
    
    // Update submit attempts and check if should be blocked
    const newAttempts = submitAttempts + 1
    setSubmitAttempts(newAttempts)
    setLastSubmitTime(now)
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setIsBlocked(true)
      setBlockTimeRemaining(BLOCK_DURATION)
      setAlert({ 
        type: 'error', 
        message: `提交次数过多，已被暂时限制。请在 ${Math.ceil(BLOCK_DURATION / 60000)} 分钟后重试` 
      })
      return false
    }
    
    return true
  }

  // Validate CSRF token
  const validateCSRF = (): boolean => {
    const storedToken = sessionStorage.getItem('csrf_token')
    if (!storedToken || storedToken !== csrfToken) {
      setAlert({ 
        type: 'error', 
        message: '安全验证失败，请刷新页面重试' 
      })
      return false
    }
    return true
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAlert({ type: 'error', message: '请上传有效的图片文件' })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: 'error', message: '图片大小不能超过 5MB' })
      return
    }

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formDataObj = new FormData()
      formDataObj.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataObj
      })

      if (!response.ok) {
        throw new Error('图片上传失败')
      }

      const { imagePath } = await response.json()
      setFormData(prev => ({ ...prev, image: imagePath }))
      setAlert({ type: 'success', message: '图片上传成功' })
    } catch (error) {
      console.error('Image upload error:', error)
      setAlert({ type: 'error', message: '图片上传失败，请重试' })
      setImagePreview(null)
    }
  }

  const validateForm = (): boolean => {
    if (!formData.memberName.trim()) {
      setAlert({ type: 'error', message: '请输入姓名' })
      return false
    }
    
    if (formData.memberName.length > 50) {
      setAlert({ type: 'error', message: '姓名长度不能超过50个字符' })
      return false
    }
    
    if (!formData.introduction.trim()) {
      setAlert({ type: 'error', message: '请输入个人介绍' })
      return false
    }
    
    if (formData.introduction.length > 500) {
      setAlert({ type: 'error', message: '个人介绍长度不能超过500个字符' })
      return false
    }
    
    if (formData.tags.length === 0) {
      setAlert({ type: 'error', message: '请添加至少一个标签' })
      return false
    }
    
    if (formData.tags.length > 5) {
      setAlert({ type: 'error', message: '标签数量不能超过5个' })
      return false
    }
    
    if (formData.tags.some(tag => tag.length > 20)) {
      setAlert({ type: 'error', message: '单个标签长度不能超过20个字符' })
      return false
    }
    
    if (!formData.image) {
      setAlert({ type: 'error', message: '请上传头像' })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form protection checks
    if (!checkRateLimit()) return
    if (!validateCSRF()) return
    if (!validateForm()) return

    setIsLoading(true)
    setAlert(null)

    try {
      const response = await fetch('/api/add-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      })

      if (!response.ok) {
        let errorMessage = '提交失败'
        try {
          const errorData = await response.json()
          // Handle different error response formats from the API
          errorMessage = errorData.error || errorData.message || `提交失败 (${response.status})`
          
          // For rate limiting errors, show the specific message
          if (response.status === 429) {
            errorMessage = errorData.message || '请求过于频繁，请稍后重试'
          }
        } catch (jsonError) {
          // If response is not JSON, show status-based message
          errorMessage = `提交失败 (HTTP ${response.status})`
        }
        throw new Error(errorMessage)
      }

      setAlert({ type: 'success', message: '恭喜！你已成功加入 Spark 大家庭！正在跳转...' })
      
      // Reset form and protection states on success
      setFormData({
        memberName: '',
        introduction: '',
        tags: [],
        image: ''
      })
      setImagePreview(null)
      setSubmitAttempts(0)
      setLastSubmitTime(0)
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = '/?success=true#members'
      }, 2000)

    } catch (error) {
      console.error('Submit error:', error)
      let errorMessage = '提交失败，请重试'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Log detailed error for debugging
      console.error('Detailed error:', {
        error,
        formData: {
          nameLength: formData.memberName.length,
          introLength: formData.introduction.length,
          tagsCount: formData.tags.length,
          hasImage: !!formData.image
        }
      })
      
      setAlert({ type: 'error', message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/80 border-red-600/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-400 text-center">
          填写你的信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {alert && (
          <div className={`flex items-center gap-2 p-4 rounded-lg border ${
            alert.type === 'success' 
              ? 'bg-green-900/20 border-green-500/20 text-green-400' 
              : 'bg-red-900/20 border-red-500/20 text-red-400'
          }`}>
            {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-300 mb-2">
              姓名 * <span className="text-xs text-gray-400">({formData.memberName.length}/50)</span>
            </label>
            <Input
              id="memberName"
              type="text"
              value={formData.memberName}
              onChange={(e) => handleInputChange('memberName', e.target.value)}
              placeholder="请输入你的姓名"
              className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 ${
                formData.memberName.length > 50 ? 'border-red-500' : ''
              }`}
              maxLength={50}
            />
            {formData.memberName.length > 45 && (
              <p className={`text-xs mt-1 ${formData.memberName.length > 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                {formData.memberName.length > 50 ? '姓名过长！' : '姓名快达到限制了'}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              头像 *
            </label>
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full flex items-center justify-center cursor-pointer hover:from-red-600/30 hover:to-orange-600/30 transition-all border-2 border-dashed border-gray-600 hover:border-orange-500"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={80} 
                    height={80} 
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Upload className="text-gray-400" size={24} />
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:text-white hover:cursor-pointer"
                >
                  选择图片
                </Button>
                <p className="text-xs text-gray-400 mt-1">
                  支持 JPG, PNG 格式，最大 5MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签 (最多5个) *
            </label>
            <p className="text-xs text-gray-400 my-1">
              每行添加一个标签
            </p>
            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入标签后按回车或点击添加"
                  className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 ${
                    currentTag.length > 20 ? 'border-red-500' : ''
                  }`}
                  maxLength={20}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  disabled={!currentTag.trim() || currentTag.length > 20 || formData.tags.length >= 5}
                  className="border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:text-white hover:cursor-pointer disabled:opacity-50"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {currentTag.length > 0 && (
                <p className={`text-xs ${currentTag.length > 20 ? 'text-red-400' : 'text-gray-400'}`}>
                  当前标签: {currentTag.length}/20 字符
                  {currentTag.length > 20 && ' - 标签过长！'}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-md flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label htmlFor="introduction" className="block text-sm font-medium text-gray-300 mb-2">
              个人介绍 * <span className="text-xs text-gray-400">({formData.introduction.length}/500)</span>
            </label>
            <Textarea
              id="introduction"
              value={formData.introduction}
              onChange={(e) => handleInputChange('introduction', e.target.value)}
              placeholder="介绍一下你自己吧..."
              rows={4}
              className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 resize-none ${
                formData.introduction.length > 500 ? 'border-red-500' : ''
              }`}
              maxLength={500}
            />
            {formData.introduction.length > 450 && (
              <p className={`text-xs mt-1 ${formData.introduction.length > 500 ? 'text-red-400' : 'text-yellow-400'}`}>
                {formData.introduction.length > 500 ? '介绍过长！' : '介绍快达到限制了'}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isBlocked}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading 
              ? '提交中...' 
              : isBlocked 
                ? `等待 ${Math.ceil(blockTimeRemaining / 1000)} 秒后重试`
                : '加入 Spark 大家庭'
            }
          </Button>
          
          {/* Rate limiting info */}
          {submitAttempts > 0 && !isBlocked && (
            <div className="text-center text-sm text-gray-400">
              剩余提交次数: {MAX_ATTEMPTS - submitAttempts}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
