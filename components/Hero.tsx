import React from 'react'
import { Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  scrollToSection: (sectionId: string) => void
}

const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative">
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    <div className="relative z-10 text-center px-4">
      <div className="mb-8">
        <div className="relative inline-block">
          <Flame className="w-24 h-24 text-red-500 mx-auto mb-6 animate-bounce" />
          <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full blur-xl mx-auto"></div>
        </div>
      </div>
      <h1 className="text-6xl md:text-8xl font-bold mb-6 flex flex-col sm:flex-row items-center">
        <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent tracking-tight">
         SPARK
        </span>
        <span className="text-white text-3xl ml-6">认识更多<span className="text-orange-400 italic mr-2">不平凡</span>的个体</span>
      </h1>
      {/* <p className="text-2xl md:text-4xl font-light mb-8 text-orange-300 tracking-wide">is the power</p> */}
      <Button
        onClick={() => scrollToSection("introduction")}
        className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
      >
        开启旅程
      </Button>
    </div>
  </section>
  )
}

export default Hero