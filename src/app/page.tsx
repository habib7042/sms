'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">স্কুল ম্যানেজমেন্ট সিস্টেম</h1>
          <p className="text-lg text-gray-600">School Management System</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Public Result View Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">ফলাফল দেখুন</CardTitle>
              <CardDescription className="text-center">
                View Student Results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-center">
                শিক্ষার্থীর রোল নম্বর এবং শ্রেণী দিয়ে ফলাফল দেখুন
              </p>
              <Link href="/view-results">
                <Button className="w-full" size="lg">
                  ফলাফল দেখুন
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Student Info Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">শিক্ষার্থীর তথ্য</CardTitle>
              <CardDescription className="text-center">
                Student Information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-center">
                শিক্ষার্থীর রোল নম্বর এবং শ্রেণী দিয়ে তথ্য দেখুন
              </p>
              <Link href="/student-info">
                <Button className="w-full" size="lg">
                  শিক্ষার্থীর তথ্য দেখুন
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Panel Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">এডমিন প্যানেল</CardTitle>
              <CardDescription className="text-center">
                Admin Panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-center">
                শিক্ষার্থী, শ্রেণী, বিষয় এবং ফলাফল ব্যবস্থাপনা
              </p>
              {!showAdminLogin ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowAdminLogin(true)}
                >
                  এডমিন লগইন
                </Button>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="password">পাসওয়ার্ড</Label>
                    <Input
                      id="password"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="mt-1"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      লগইন
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAdminLogin(false)}
                    >
                      বাতিল
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}