"use client"

import type React from "react"
import { useState } from "react"


import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Introduction from "@/components/Introduction"
import Members from "@/components/Members"
import Application from "@/components/Application"
import Footer from "@/components/Footer"
import Bg from "@/components/ui/bg"


export default function SparkWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Bg />

      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrollToSection={scrollToSection} />

      <Hero scrollToSection={scrollToSection} />

      <Introduction />

      <Members />

      <Application />

      <Footer />
    </div>
  )
}
