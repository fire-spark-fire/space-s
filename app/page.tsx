"use client"

import type React from "react"
import { useState, useEffect } from "react"


import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Introduction from "@/components/Introduction"
import Members from "@/components/Members"
import Application from "@/components/Application"
import Footer from "@/components/Footer"
import Bg from "@/components/ui/bg"


export default function SparkWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true)
      // Remove success parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Bg />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500/50 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">🎉 欢迎加入 Spark 大家庭！你的信息已经添加到成员列表中。</span>
            <button onClick={() => setShowSuccessMessage(false)} className="ml-4 text-green-200 hover:text-white">✕</button>
          </div>
        </div>
      )}

      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrollToSection={scrollToSection} />

      <Hero scrollToSection={scrollToSection} />

      <Introduction />

      <Members />

      <Application />

      <Footer />
    </div>
  )
}
