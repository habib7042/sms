'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import html2canvas from 'html2canvas'

export default function ResultsPage() {
  const [classes, setClasses] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [error, setError] = useState('')

  const [searchData, setSearchData] = useState({
    roll: '',
    classId: ''
  })

  const resultCardRef = useRef(null)

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

  const searchResults = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSearchPerformed(true)

    try {
      const response = await fetch(`/api/results/search?roll=${searchData.roll}&classId=${searchData.classId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setError('No results found for this student')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const calculateOverallGPA = (results) => {
    if (results.length === 0) return 0
    const totalGPA = results.reduce((sum, result) => sum + result.gpa, 0)
    return (totalGPA / results.length).toFixed(2)
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'default'
      case 'A': return 'secondary'
      case 'A-': return 'outline'
      case 'B': return 'default'
      case 'C': return 'secondary'
      case 'D': return 'outline'
      case 'F': return 'destructive'
      default: return 'outline'
    }
  }

  const downloadResultAsPNG = async () => {
    if (!resultCardRef.current) {
      setError('Result card not found. Please search for results first.')
      return
    }

    try {
      console.log('Starting PNG generation...')
      
      // Add a small delay to ensure the DOM is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Create a temporary style element to override oklch colors
      const style = document.createElement('style')
      style.textContent = `
        .png-export {
          --background: #ffffff !important;
          --foreground: #000000 !important;
          --card: #ffffff !important;
          --card-foreground: #000000 !important;
          --popover: #ffffff !important;
          --popover-foreground: #000000 !important;
          --primary: #000000 !important;
          --primary-foreground: #ffffff !important;
          --secondary: #f1f5f9 !important;
          --secondary-foreground: #000000 !important;
          --muted: #f1f5f9 !important;
          --muted-foreground: #64748b !important;
          --accent: #f1f5f9 !important;
          --accent-foreground: #000000 !important;
          --destructive: #ef4444 !important;
          --destructive-foreground: #ffffff !important;
          --border: #e2e8f0 !important;
          --input: #e2e8f0 !important;
          --ring: #000000 !important;
          --chart-1: #ef4444 !important;
          --chart-2: #f97316 !important;
          --chart-3: #eab308 !important;
          --chart-4: #22c55e !important;
          --chart-5: #3b82f6 !important;
        }
        
        .png-export * {
          color: var(--foreground) !important;
          background-color: var(--background) !important;
          border-color: var(--border) !important;
        }
        
        .png-export .bg-green-100 {
          background-color: #dcfce7 !important;
          color: #166534 !important;
        }
        
        .png-export .bg-blue-100 {
          background-color: #dbeafe !important;
          color: #1e40af !important;
        }
        
        .png-export .bg-purple-100 {
          background-color: #f3e8ff !important;
          color: #6b21a8 !important;
        }
        
        .png-export .bg-yellow-100 {
          background-color: #fef9c3 !important;
          color: #854d0e !important;
        }
        
        .png-export .bg-orange-100 {
          background-color: #fed7aa !important;
          color: #9a3412 !important;
        }
        
        .png-export .bg-red-100 {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
        }
        
        .png-export .bg-gray-100 {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
        }
        
        .png-export .text-green-800 {
          color: #166534 !important;
        }
        
        .png-export .text-blue-800 {
          color: #1e40af !important;
        }
        
        .png-export .text-purple-800 {
          color: #6b21a8 !important;
        }
        
        .png-export .text-yellow-800 {
          color: #854d0e !important;
        }
        
        .png-export .text-orange-800 {
          color: #9a3412 !important;
        }
        
        .png-export .text-red-800 {
          color: #991b1b !important;
        }
        
        .png-export .text-gray-800 {
          color: #374151 !important;
        }
        
        .png-export .text-green-600 {
          color: #16a34a !important;
        }
        
        .png-export .text-blue-600 {
          color: #2563eb !important;
        }
        
        .png-export .text-purple-600 {
          color: #9333ea !important;
        }
        
        .png-export .text-yellow-600 {
          color: #ca8a04 !important;
        }
        
        .png-export .text-orange-600 {
          color: #ea580c !important;
        }
        
        .png-export .text-red-600 {
          color: #dc2626 !important;
        }
        
        .png-export .text-gray-600 {
          color: #4b5563 !important;
        }
        
        .png-export .text-blue-600 {
          color: #2563eb !important;
        }
        
        .png-export .border-green-500 {
          border-color: #22c55e !important;
        }
        
        .png-export .border-red-500 {
          border-color: #ef4444 !important;
        }
      `
      
      // Add the class to the result card for export
      resultCardRef.current.classList.add('png-export')
      document.head.appendChild(style)
      
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: resultCardRef.current.scrollWidth,
        height: resultCardRef.current.scrollHeight,
        removeContainer: true,
        foreignObjectRendering: false
      })
      
      console.log('Canvas generated successfully')
      
      if (!canvas) {
        throw new Error('Canvas generation failed')
      }
      
      // Clean up
      resultCardRef.current.classList.remove('png-export')
      document.head.removeChild(style)
      
      const link = document.createElement('a')
      const studentRoll = results[0]?.student?.roll || 'unknown'
      const className = results[0]?.class?.name || 'unknown'
      const currentDate = new Date().toISOString().split('T')[0]
      
      link.download = `result_${studentRoll}_${className}_${currentDate}.png`
      link.href = canvas.toDataURL('image/png')
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('PNG downloaded successfully')
    } catch (error) {
      console.error('Error generating PNG:', error)
      setError(`Failed to generate PNG: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ফলাফল দেখুন</h1>
            <p className="text-gray-600">View Student Results</p>
          </div>
          <Link href="/">
            <Button variant="outline">হোম পেজ</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>শিক্ষার্থীর ফলাফল অনুসন্ধান</CardTitle>
            <CardDescription>Search Student Results</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={searchResults} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {searchPerformed && results.length > 0 && (
          <div className="space-y-4">
            {/* Download Button */}
            <div className="flex justify-end">
              <Button onClick={downloadResultAsPNG} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                PNG ডাউনলোড করুন
              </Button>
            </div>

            {/* Results Container - This will be captured as PNG */}
            <div ref={resultCardRef} className="bg-white p-6 rounded-lg shadow-lg">
              {/* Student Info Card */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>শিক্ষার্থীর তথ্য</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">নাম</Label>
                      <p className="text-lg font-semibold">{results[0].student.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">রোল নম্বর</Label>
                      <p className="text-lg font-semibold">{results[0].student.roll}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">শ্রেণী</Label>
                      <p className="text-lg font-semibold">{results[0].class.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">সামগ্রিক GPA</Label>
                      <p className="text-lg font-semibold text-blue-600">{calculateOverallGPA(results)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Table */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>ফলাফলের বিবরণ</CardTitle>
                  <CardDescription>Detailed Results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>বিষয়</TableHead>
                        <TableHead>নম্বর</TableHead>
                        <TableHead>গ্রেড</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>পরীক্ষার ধরন</TableHead>
                        <TableHead>তারিখ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.subject.name}</TableCell>
                          <TableCell>{result.marks}</TableCell>
                          <TableCell>
                            <Badge variant={getGradeColor(result.grade)}>
                              {result.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.gpa}</TableCell>
                          <TableCell>{result.examType}</TableCell>
                          <TableCell>
                            {result.examDate ? new Date(result.examDate).toLocaleDateString('bn-BD') : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Grade Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>গ্রেড সারাংশ</CardTitle>
                  <CardDescription>Grade Summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">
                        {results.filter(r => r.grade === 'A+').length}
                      </div>
                      <div className="text-sm text-green-600">A+</div>
                    </div>
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-800">
                        {results.filter(r => r.grade === 'A').length}
                      </div>
                      <div className="text-sm text-blue-600">A</div>
                    </div>
                    <div className="text-center p-3 bg-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-800">
                        {results.filter(r => r.grade === 'A-').length}
                      </div>
                      <div className="text-sm text-purple-600">A-</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-800">
                        {results.filter(r => r.grade === 'B').length}
                      </div>
                      <div className="text-sm text-yellow-600">B</div>
                    </div>
                    <div className="text-center p-3 bg-orange-100 rounded-lg">
                      <div className="text-2xl font-bold text-orange-800">
                        {results.filter(r => r.grade === 'C').length}
                      </div>
                      <div className="text-sm text-orange-600">C</div>
                    </div>
                    <div className="text-center p-3 bg-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-800">
                        {results.filter(r => r.grade === 'D').length}
                      </div>
                      <div className="text-sm text-red-600">D</div>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">
                        {results.filter(r => r.grade === 'F').length}
                      </div>
                      <div className="text-sm text-gray-600">F</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {searchPerformed && results.length === 0 && !error && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">কোন ফলাফল পাওয়া যায়নি</p>
              <p className="text-sm text-gray-400">No results found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}