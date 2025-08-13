'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function StudentInfoPage() {
  const [classes, setClasses] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [error, setError] = useState('')

  const [searchData, setSearchData] = useState({
    roll: '',
    classId: ''
  })

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">শিক্ষার্থীর তথ্য</h1>
            <p className="text-gray-600">Student Information</p>
          </div>
          <Link href="/">
            <Button variant="outline">হোম পেজ</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>শিক্ষার্থীর তথ্য অনুসন্ধান</CardTitle>
            <CardDescription>Search Student Information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={searchStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="roll">রোল নম্বর</Label>
                <Input
                  id="roll"
                  value={searchData.roll}
                  onChange={(e) => setSearchData({...searchData, roll: e.target.value})}
                  placeholder="Enter roll number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="classId">শ্রেণী</Label>
                <Select onValueChange={(value) => setSearchData({...searchData, classId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'অনুসন্ধান করা হচ্ছে...' : 'অনুসন্ধান করুন'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchPerformed && student && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>শিক্ষার্থীর বিস্তারিত তথ্য</span>
                <Badge variant="outline">{student.class.name}</Badge>
              </CardTitle>
              <CardDescription>Detailed Student Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">মৌলিক তথ্য</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">রোল নম্বর:</span>
                      <span className="font-semibold">{student.roll}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">নাম:</span>
                      <span className="font-semibold">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">শ্রেণী:</span>
                      <span className="font-semibold">{student.class.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">লিঙ্গ:</span>
                      <span className="font-semibold">{getGenderInBangla(student.gender)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">জন্ম তারিখ:</span>
                      <span className="font-semibold">{formatDate(student.dateOfBirth)}</span>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">অভিভাবকের তথ্য</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">পিতার নাম:</span>
                      <span className="font-semibold">{student.fatherName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">মাতার নাম:</span>
                      <span className="font-semibold">{student.motherName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">ফোন নম্বর:</span>
                      <span className="font-semibold">{student.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {student.address && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ঠিকানা</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{student.address}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">তথ্য যোগ করা হয়েছে:</span>
                    <span className="ml-2">{new Date(student.createdAt).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div>
                    <span className="font-medium">সর্বশেষ আপডেট:</span>
                    <span className="ml-2">{new Date(student.updatedAt).toLocaleDateString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {searchPerformed && !student && !error && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">কোন শিক্ষার্থী পাওয়া যায়নি</p>
              <p className="text-sm text-gray-400">No student found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}