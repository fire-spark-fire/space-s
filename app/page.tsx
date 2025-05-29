"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Users, FileText, Mail, Upload, Star, Globe, MapPin, Heart, Menu, X } from "lucide-react"
import Link from "next/link"

export default function SparkWebsite() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    cv: null as File | null,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const members = [
    {
      nickname: "FireStarter",
      introduction: "Passionate about igniting innovation and leading transformative projects.",
      contact: "mailto:firestarter@spark.com",
    },
    {
      nickname: "CodeBlaze",
      introduction: "Full-stack developer who turns ideas into blazing fast applications.",
      contact: "mailto:codeblaze@spark.com",
    },
    {
      nickname: "DesignFlame",
      introduction: "Creative designer crafting visual experiences that spark emotions.",
      contact: "mailto:designflame@spark.com",
    },
    {
      nickname: "DataSpark",
      introduction: "Analytics expert who finds insights that light up business strategies.",
      contact: "mailto:dataspark@spark.com",
    },
  ]

  const introductionParts = [
    {
      title: "Start",
      description:
        "Begin your journey with Spark and discover your potential to create meaningful impact in the world.",
      icon: <Star className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Programs",
      description:
        "Comprehensive training programs designed to fuel your growth and expertise in cutting-edge technologies.",
      icon: <FileText className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Online Events",
      description:
        "Virtual gatherings that connect minds and spark collaborative innovation across global communities.",
      icon: <Globe className="w-5 h-5" />,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "In-Site Events",
      description:
        "Physical meetups and workshops that bring the community together for hands-on learning experiences.",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-orange-600 to-red-700",
    },
    {
      title: "Influence",
      description:
        "Building emotional connections and meaningful relationships within our passionate community of innovators.",
      icon: <Heart className="w-5 h-5" />,
      color: "from-red-700 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Granular Background Effect */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-orange-900/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
              radial-gradient(circle at 20px 20px, rgba(239,68,68,0.1) 1px, transparent 0),
              radial-gradient(circle at 40px 40px, rgba(249,115,22,0.1) 1px, transparent 0)
            `,
            backgroundSize: "50px 50px, 100px 100px, 150px 150px",
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-900/5 to-transparent"></div>
      </div>

      {/* Navigation */}
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

      {/* Hero Section */}
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
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              SPARK
            </span>
          </h1>
          <p className="text-2xl md:text-4xl font-light mb-8 text-orange-300 tracking-wide">is the power</p>
          <Button
            onClick={() => scrollToSection("introduction")}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
          >
            Discover the Power
          </Button>
        </div>
      </section>

      {/* Introduction Section - Stacked Design */}
      <section id="introduction" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              INTRODUCTION
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the five pillars that make Spark a transformative force in innovation and community building.
            </p>
          </div>

          <div className="relative">
            {/* Stacked Layout */}
            <div className="space-y-6">
              {introductionParts.map((part, index) => (
                <div
                  key={index}
                  className={`relative group transition-all duration-500 hover:scale-[1.02] ${
                    index % 2 === 0 ? "ml-0 md:ml-12" : "ml-0 md:ml-24"
                  }`}
                  style={{
                    transform: `translateY(${index * -10}px)`,
                    zIndex: introductionParts.length - index,
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-red-500/20 hover:border-orange-500/40 transition-all duration-300">
                    <div
                      className="absolute inset-0 bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${part.color.split(" ")[1]}, ${part.color.split(" ")[3]})`,
                      }}
                    ></div>

                    <div className="relative p-8 md:p-12">
                      <div className="flex items-start space-x-6">
                        <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${part.color} shadow-lg`}>
                          <div className="text-white">{part.icon}</div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
                            {part.title.toUpperCase()}
                          </h3>
                          <p className="text-gray-300 text-lg leading-relaxed">{part.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting Lines */}
            <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-red-500/50 via-orange-500/50 to-red-500/50 hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section id="members" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              OUR MEMBERS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the passionate individuals who fuel the Spark community with their expertise and dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-red-600/20 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-orange-400 tracking-wide">{member.nickname}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-300 mb-4 leading-relaxed">
                    {member.introduction}
                  </CardDescription>
                  <Link
                    href={member.contact}
                    className="inline-flex items-center space-x-2 text-red-500 hover:text-orange-500 transition-colors duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section id="application" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              JOIN SPARK
            </h2>
            <p className="text-xl text-gray-300">
              Ready to ignite your potential? Submit your application and become part of our dynamic community.
            </p>
          </div>

          <Card className="bg-gray-900/50 border-red-600/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-400 text-center tracking-wide">APPLICATION FORM</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Fill out the form below to start your journey with Spark
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                  >
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                  >
                    Contact Information
                  </label>
                  <Input
                    id="contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="bg-black/50 border-red-600/30 focus:border-orange-500 text-white"
                    placeholder="Email or phone number"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cv"
                    className="block text-sm font-medium text-orange-400 mb-2 uppercase tracking-wider"
                  >
                    Upload CV
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
                  {formData.cv && <p className="text-sm text-green-400 mt-2">File selected: {formData.cv.name}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 uppercase tracking-wider"
                >
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-red-600/20 py-8 px-4 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="w-6 h-6 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-wider">
              SPARK
            </span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} Spark. Igniting innovation and powering communities.
          </p>
        </div>
      </footer>
    </div>
  )
}
