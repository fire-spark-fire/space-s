"use client"

import React from "react"
import { Flame, Menu, X } from "lucide-react"

interface NavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  scrollToSection: (sectionId: string) => void
}

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen, scrollToSection }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-red-500/20"></div>
      <div className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Flame className="w-8 h-8 text-red-500 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-red-500/20 rounded-full blur-md"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              SPARK
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["introduction", "members", "application"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative group text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wider text-sm font-medium"
              >
                {item}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300"></div>
                <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-red-500/20">
            <div className="px-6 py-4 space-y-4">
              {["introduction", "members", "application"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-white/80 hover:text-white transition-colors duration-300 uppercase tracking-wider text-sm font-medium py-2"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
