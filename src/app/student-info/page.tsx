'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { 
  Search, 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Home,
  ArrowLeft,
  UserCheck,
  UserCircle,
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function StudentInfoPage() {
  const [classes, setClasses] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  const [searchData, setSearchData] = useState({
    roll: '',
    classId: ''
  })

  useEffect(() => {
    setMounted(true)
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      setError('Failed to fetch classes')
    }
  }

  const searchStudent = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSearchPerformed(true)

    try {
      const response = await fetch(`/api/students/search?roll=${searchData.roll}&classId=${searchData.classId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch student')
      }
      
      const data = await response.json()
      setStudent(data)
    } catch (error) {
      setError(error.message || 'Student not found')
      setStudent(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGenderInBangla = (gender) => {
    switch (gender) {
      case 'Male': return 'পুরুষ'
      case 'Female': return 'মহিলা'
      case 'Other': return 'অন্যান্য'
      default: return gender
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
            className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
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
            শিক্ষার্থী তথ্য পোর্টাল
          </motion.h2>
          <motion.p 
            className="text-lg text-blue-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Student Information Portal
          </motion.p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        {/* Search Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                <UserCircle className="mr-3 h-6 w-6 text-yellow-400" />
                শিক্ষার্থী তথ্য অনুসন্ধান
              </CardTitle>
              <CardDescription className="text-blue-200">
                শিক্ষার্থীর রোল এবং শ্রেণী দিয়ে তথ্য অনুসন্ধান করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={searchStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="roll" className="text-white">রোল নম্বর</Label>
                  <Input
                    id="roll"
                    value={searchData.roll}
                    onChange={(e) => setSearchData({...searchData, roll: e.target.value})}
                    placeholder="রোল নম্বর লিখুন"
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="classId" className="text-white">শ্রেণী</Label>
                  <Select onValueChange={(value) => setSearchData({...searchData, classId: value})}>
                    <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 text-lg group"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        অনুসন্ধান করা হচ্ছে...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="mr-2 h-5 w-5" />
                        অনুসন্ধান করুন
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="mb-6 bg-red-500/20 border-red-500/50">
              <AlertDescription className="text-white">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {searchPerformed && student && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                  <UserCheck className="mr-3 h-8 w-8 text-yellow-400" />
                  শিক্ষার্থীর বিস্তারিত তথ্য
                  <Sparkles className="ml-3 h-6 w-6 text-yellow-400" />
                </CardTitle>
                <CardDescription className="text-center text-blue-100">
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/50">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {student.class.name}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="mr-2 h-5 w-5 text-blue-400" />
                      মৌলিক তথ্য
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">রোল নম্বর:</span>
                        <span className="text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {student.roll}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">নাম:</span>
                        <span className="text-white font-semibold">{student.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">শ্রেণী:</span>
                        <span className="text-white font-semibold">{student.class.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">লিঙ্গ:</span>
                        <span className="text-white font-semibold">{getGenderInBangla(student.gender)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">জন্ম তারিখ:</span>
                        <span className="text-white font-semibold flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDate(student.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Parent Information */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-400" />
                      অভিভাবকের তথ্য
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">পিতার নাম:</span>
                        <span className="text-white font-semibold">{student.fatherName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">মাতার নাম:</span>
                        <span className="text-white font-semibold">{student.motherName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">ফোন নম্বর:</span>
                        <span className="text-white font-semibold flex items-center">
                          <Phone className="mr-1 h-4 w-4" />
                          {student.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Address Section */}
                {student.address && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-6 pt-6 border-t border-white/20"
                  >
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-red-400" />
                      ঠিকানা
                    </h3>
                    <p className="text-blue-100 bg-white/10 p-4 rounded-lg border border-white/20">
                      {student.address}
                    </p>
                  </motion.div>
                )}

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-6 pt-6 border-t border-white/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-blue-200">
                      <Clock className="mr-2 h-4 w-4 text-yellow-400" />
                      <span className="font-medium">তথ্য যোগ করা হয়েছে:</span>
                      <span className="ml-2 text-white">
                        {new Date(student.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-blue-200">
                      <Award className="mr-2 h-4 w-4 text-green-400" />
                      <span className="font-medium">সর্বশেষ আপডেট:</span>
                      <span className="ml-2 text-white">
                        {new Date(student.updatedAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {searchPerformed && !student && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-xl text-white mb-2">কোন শিক্ষার্থী পাওয়া যায়নি</p>
                <p className="text-blue-200">No student found</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            হোমপেজে ফিরে যান
          </Button>
        </motion.div>
      </main>

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