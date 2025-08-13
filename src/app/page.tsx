'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { 
  Search, 
  User, 
  Settings, 
  BookOpen, 
  Award, 
  GraduationCap,
  Users,
  FileText,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        window.location.href = '/admin'
      } else {
        setLoginError(data.error || 'Invalid password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 text-center py-12 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-6xl text-yellow-400"
            >
              <GraduationCap className="w-16 h-16" />
            </motion.div>
          </div>
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Noakhali Ideal Madrasah
          </motion.h1>
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold text-blue-200 mb-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Students Information and Results Portal
          </motion.h2>
          <motion.p 
            className="text-lg text-blue-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            শিক্ষার্থীদের তথ্য ও ফলাফল ব্যবস্থাপনা পোর্টাল
          </motion.p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Public Result View Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  ফলাফল দেখুন
                </CardTitle>
                <CardDescription className="text-blue-200">
                  View Student Results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-6 text-center">
                  শিক্ষার্থীর রোল নম্বর এবং শ্রেণী দিয়ে ফলাফল দেখুন
                </p>
                <Link href="/view-results">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 text-lg group">
                    ফলাফল দেখুন
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  শিক্ষার্থীর তথ্য
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Student Information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-6 text-center">
                  শিক্ষার্থীর রোল নম্বর এবং শ্রেণী দিয়ে তথ্য দেখুন
                </p>
                <Link href="/student-info">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg group">
                    শিক্ষার্থীর তথ্য দেখুন
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Panel Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  এডমিন প্যানেল
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Admin Panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-6 text-center">
                  শিক্ষার্থী, শ্রেণী, বিষয় এবং ফলাফল ব্যবস্থাপনা
                </p>
                {!showAdminLogin ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg group"
                    onClick={() => setShowAdminLogin(true)}
                  >
                    এডমিন লগইন
                    <Settings className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="password" className="text-white">পাসওয়ার্ড</Label>
                        <Input
                          id="password"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter password"
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>
                      {loginError && (
                        <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                          <AlertDescription className="text-white">
                            {loginError}
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                          লগইন
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowAdminLogin(false)}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          বাতিল
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">আমাদের সেবাসমূহ</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
            >
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">শিক্ষার্থী ব্যবস্থাপনা</h4>
              <p className="text-blue-200 text-sm">শিক্ষার্থীদের তথ্য সহজেই ব্যবস্থাপনা করুন</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
            >
              <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">ফলাফল ব্যবস্থাপনা</h4>
              <p className="text-blue-200 text-sm">ফলাফল প্রকাশ ও ব্যবস্থাপনা করুন</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
            >
              <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">শ্রেণী ব্যবস্থাপনা</h4>
              <p className="text-blue-200 text-sm">শ্রেণী ও বিষয় ব্যবস্থাপনা করুন</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
            >
              <FileText className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">রিপোর্টিং</h4>
              <p className="text-blue-200 text-sm">বিভিন্ন ধরনের রিপোর্ট তৈরি করুন</p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-blue-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p>© 2024 Noakhali Ideal Madrasah. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by Modern School Management System - Vercel Build Fixed</p>
        </motion.div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}