"use client"

import React from "react"
import Link from "next/link"
import { Flame, ArrowLeft } from "lucide-react"

export default function SimpleNavigation() {
  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-red-500/20"></div>
      <div className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Flame className="w-8 h-8 text-red-500 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-red-500/20 rounded-full blur-md"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              SPARK
            </span>
          </Link>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="relative group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm font-medium flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </nav>
  )
}
