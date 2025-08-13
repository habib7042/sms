'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form states
  const [newStudent, setNewStudent] = useState({
    roll: '',
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    classId: ''
  })

  const [editingStudent, setEditingStudent] = useState(null)

  const [newClass, setNewClass] = useState({
    name: '',
    description: ''
  })

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    maxMarks: 100 // Default to 100 marks
  })

  const [newResult, setNewResult] = useState({
    studentId: '',
    subjectId: '',
    classId: '',
    marks: '',
    examType: 'প্রথম সেমিস্টার',
    examDate: new Date().toISOString().split('T')[0]
  })

  const [classSubject, setClassSubject] = useState({
    classId: '',
    subjectId: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes, subjectsRes, resultsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/classes'),
        fetch('/api/subjects'),
        fetch('/api/results')
      ])

      const [studentsData, classesData, subjectsData, resultsData] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
        subjectsRes.json(),
        resultsRes.json()
      ])

      setStudents(studentsData)
      setClasses(classesData)
      setSubjects(subjectsData)
      setResults(resultsData)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch data' })
    } finally {
      setLoading(false)
    }
  }

  const calculateGradeAndGPA = (marks) => {
    const mark = parseFloat(marks)
    if (mark >= 79) return { grade: 'A+', gpa: 5 }
    if (mark >= 69) return { grade: 'A', gpa: 4 }
    if (mark >= 59) return { grade: 'A-', gpa: 3.5 }
    if (mark >= 49) return { grade: 'B', gpa: 3 }
    if (mark >= 39) return { grade: 'C', gpa: 2 }
    if (mark >= 33) return { grade: 'D', gpa: 1 }
    return { grade: 'F', gpa: 0 }
  }

  const addStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Student added successfully' })
        setNewStudent({
          roll: '',
          name: '',
          fatherName: '',
          motherName: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          phone: '',
          classId: ''
        })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add student' })
    }
  }

  const addClass = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Class added successfully' })
        setNewClass({ name: '', description: '' })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add class' })
    }
  }

  const addSubject = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Subject added successfully' })
        setNewSubject({ name: '', code: '', description: '', maxMarks: 100 })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add subject' })
    }
  }

  const addResult = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResult)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Result added successfully' })
        setNewResult({
          studentId: '',
          subjectId: '',
          classId: '',
          marks: '',
          examType: 'প্রথম সেমিস্টার',
          examDate: new Date().toISOString().split('T')[0]
        })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add result' })
    }
  }

  const addSubjectToClass = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/class-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classSubject)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Subject added to class successfully' })
        setClassSubject({ classId: '', subjectId: '' })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add subject to class' })
    }
  }

  const startEditingStudent = (student) => {
    setEditingStudent(student)
    setNewStudent({
      roll: student.roll,
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      gender: student.gender,
      address: student.address,
      phone: student.phone,
      classId: student.classId
    })
  }

  const updateStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          ...newStudent
        })
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Student updated successfully' })
        setEditingStudent(null)
        setNewStudent({
          roll: '',
          name: '',
          fatherName: '',
          motherName: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          phone: '',
          classId: ''
        })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update student' })
    }
  }

  const deleteStudent = async (studentId) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?')) {
      return
    }

    try {
      const response = await fetch(`/api/students?id=${studentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Student deleted successfully' })
        fetchData()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete student' })
    }
  }

  const cancelEditing = () => {
    setEditingStudent(null)
    setNewStudent({
      roll: '',
      name: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      phone: '',
      classId: ''
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">এডমিন প্যানেল</h1>
          <Link href="/">
            <Button variant="outline">হোম পেজ</Button>
          </Link>
        </div>

        {message.text && (
          <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students">শিক্ষার্থী</TabsTrigger>
            <TabsTrigger value="classes">শ্রেণী</TabsTrigger>
            <TabsTrigger value="subjects">বিষয়</TabsTrigger>
            <TabsTrigger value="results">ফলাফল</TabsTrigger>
            <TabsTrigger value="class-subjects">শ্রেণী-বিষয়</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{editingStudent ? 'শিক্ষার্থীর তথ্য আপডেট করুন' : 'নতুন শিক্ষার্থী যোগ করুন'}</CardTitle>
                <CardDescription>{editingStudent ? 'Update Student Information' : 'Add New Student'}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingStudent ? updateStudent : addStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roll">রোল নম্বর</Label>
                    <Input
                      id="roll"
                      value={newStudent.roll}
                      onChange={(e) => setNewStudent({...newStudent, roll: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">নাম</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherName">পিতার নাম</Label>
                    <Input
                      id="fatherName"
                      value={newStudent.fatherName}
                      onChange={(e) => setNewStudent({...newStudent, fatherName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherName">মাতার নাম</Label>
                    <Input
                      id="motherName"
                      value={newStudent.motherName}
                      onChange={(e) => setNewStudent({...newStudent, motherName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">জন্ম তারিখ</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newStudent.dateOfBirth}
                      onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">লিঙ্গ</Label>
                    <Select onValueChange={(value) => setNewStudent({...newStudent, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">পুরুষ</SelectItem>
                        <SelectItem value="Female">মহিলা</SelectItem>
                        <SelectItem value="Other">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">ফোন নম্বর</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="classId">শ্রেণী</Label>
                    <Select onValueChange={(value) => setNewStudent({...newStudent, classId: value})}>
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
                  <div className="md:col-span-2">
                    <Label htmlFor="address">ঠিকানা</Label>
                    <Input
                      id="address"
                      value={newStudent.address}
                      onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingStudent ? 'শিক্ষার্থী আপডেট করুন' : 'শিক্ষার্থী যোগ করুন'}
                    </Button>
                    {editingStudent && (
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        বাতিল করুন
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>শ্রেণী অনুযায়ী শিক্ষার্থীর তালিকা</CardTitle>
                <CardDescription>Students Organized by Class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {classes.map((cls) => {
                    const classStudents = students.filter(student => student.classId === cls.id)
                    return (
                      <div key={cls.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-semibold">{cls.name}</h4>
                          <Badge variant="secondary">
                            {classStudents.length} শিক্ষার্থী
                          </Badge>
                        </div>
                        
                        {classStudents.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>রোল</TableHead>
                                  <TableHead>নাম</TableHead>
                                  <TableHead>পিতা</TableHead>
                                  <TableHead>মাতা</TableHead>
                                  <TableHead>ফোন</TableHead>
                                  <TableHead>পরিচালনা</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {classStudents.map((student) => (
                                  <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.roll}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.fatherName || 'N/A'}</TableCell>
                                    <TableCell>{student.motherName || 'N/A'}</TableCell>
                                    <TableCell>{student.phone || 'N/A'}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => startEditingStudent(student)}
                                        >
                                          সম্পাদনা
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => deleteStudent(student.id)}
                                        >
                                          মুছুন
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">এই শ্রেণীতে কোন শিক্ষার্থী নেই</p>
                        )}
                      </div>
                    )
                  })}
                  
                  {classes.length === 0 && (
                    <p className="text-gray-500 text-center">কোন শ্রেণী পাওয়া যায়নি</p>
                  )}
                  
                  {students.length === 0 && classes.length > 0 && (
                    <p className="text-gray-500 text-center">কোন শিক্ষার্থী পাওয়া যায়নি</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>নতুন শ্রেণী যোগ করুন</CardTitle>
                <CardDescription>Add New Class</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addClass} className="space-y-4">
                  <div>
                    <Label htmlFor="className">শ্রেণীর নাম</Label>
                    <Input
                      id="className"
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="classDescription">বর্ণনা</Label>
                    <Input
                      id="classDescription"
                      value={newClass.description}
                      onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                    />
                  </div>
                  <Button type="submit">শ্রেণী যোগ করুন</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>শ্রেণীর তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>শ্রেণী</TableHead>
                      <TableHead>বর্ণনা</TableHead>
                      <TableHead>শিক্ষার্থী সংখ্যা</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>{cls.description}</TableCell>
                        <TableCell>{cls.students?.length || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Class-Subject Relationships */}
            <Card>
              <CardHeader>
                <CardTitle>শ্রেণীতে যুক্ত বিষয়সমূহ</CardTitle>
                <CardDescription>Subjects Assigned to Classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{cls.name}</h4>
                      {cls.subjects && cls.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {cls.subjects.map((classSubject) => (
                            <Badge key={classSubject.id} variant="secondary">
                              {classSubject.subject.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">কোন বিষয় যুক্ত করা হয়নি</p>
                      )}
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <p className="text-gray-500 text-center">কোন শ্রেণী পাওয়া যায়নি</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>নতুন বিষয় যোগ করুন</CardTitle>
                <CardDescription>Add New Subject</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addSubject} className="space-y-4">
                  <div>
                    <Label htmlFor="subjectName">বিষয়ের নাম</Label>
                    <Input
                      id="subjectName"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subjectCode">বিষয় কোড</Label>
                    <Input
                      id="subjectCode"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subjectDescription">বর্ণনা</Label>
                    <Input
                      id="subjectDescription"
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMarks">সর্বোচ্চ নম্বর</Label>
                    <Select onValueChange={(value) => setNewSubject({...newSubject, maxMarks: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select max marks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">১০০</SelectItem>
                        <SelectItem value="50">৫০</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">বিষয় যোগ করুন</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>বিষয়ের তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>বিষয়</TableHead>
                      <TableHead>কোড</TableHead>
                      <TableHead>বর্ণনা</TableHead>
                      <TableHead>সর্বোচ্চ নম্বর</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>{subject.description}</TableCell>
                        <TableCell>
                          <Badge variant={subject.maxMarks === 50 ? 'secondary' : 'default'}>
                            {subject.maxMarks}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>নতুন ফলাফল যোগ করুন</CardTitle>
                <CardDescription>Add New Result</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addResult} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">শিক্ষার্থী</Label>
                    <Select onValueChange={(value) => setNewResult({...newResult, studentId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.roll})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subjectId">বিষয়</Label>
                    <Select onValueChange={(value) => setNewResult({...newResult, subjectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.maxMarks})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="classId">শ্রেণী</Label>
                    <Select onValueChange={(value) => setNewResult({...newResult, classId: value})}>
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
                  <div>
                    <Label htmlFor="marks">নম্বর</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="0"
                      max={newResult.subjectId ? subjects.find(s => s.id === newResult.subjectId)?.maxMarks || 100 : 100}
                      value={newResult.marks}
                      onChange={(e) => setNewResult({...newResult, marks: e.target.value})}
                      required
                    />
                    {newResult.subjectId && (
                      <p className="text-sm text-gray-500 mt-1">
                        সর্বোচ্চ নম্বর: {subjects.find(s => s.id === newResult.subjectId)?.maxMarks || 100}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="examType">পরীক্ষার ধরন</Label>
                    <Select onValueChange={(value) => setNewResult({...newResult, examType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="প্রথম সেমিস্টার">প্রথম সেমিস্টার</SelectItem>
                        <SelectItem value="দ্বিতীয় সেমিস্টার">দ্বিতীয় সেমিস্টার</SelectItem>
                        <SelectItem value="তৃতীয় সেমিস্টার">তৃতীয় সেমিস্টার</SelectItem>
                        <SelectItem value="নির্বাচনী পরীক্ষা">নির্বাচনী পরীক্ষা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="examDate">পরীক্ষার তারিখ</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={newResult.examDate}
                      onChange={(e) => setNewResult({...newResult, examDate: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit">ফলাফল যোগ করুন</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>ফলাফলের তালিকা</span>
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/results/recalculate', {
                          method: 'POST'
                        })
                        const data = await response.json()
                        if (response.ok) {
                          setMessage({ type: 'success', text: data.message })
                          fetchData()
                        } else {
                          setMessage({ type: 'error', text: data.error })
                        }
                      } catch (error) {
                        setMessage({ type: 'error', text: 'Failed to recalculate results' })
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    গ্রেড পুনঃগণনা করুন
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>শিক্ষার্থী</TableHead>
                      <TableHead>শ্রেণী</TableHead>
                      <TableHead>বিষয়</TableHead>
                      <TableHead>নম্বর</TableHead>
                      <TableHead>গ্রেড</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>পরীক্ষা</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.student?.name}</TableCell>
                        <TableCell>{result.class?.name}</TableCell>
                        <TableCell>{result.subject?.name}</TableCell>
                        <TableCell>
                          {result.marks}{result.subject?.maxMarks && result.subject.maxMarks !== 100 ? `/${result.subject.maxMarks}` : ''}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            result.grade === 'A+' ? 'default' :
                            result.grade === 'A' ? 'secondary' :
                            result.grade === 'A-' ? 'outline' :
                            result.grade === 'B' ? 'default' :
                            result.grade === 'C' ? 'secondary' :
                            result.grade === 'D' ? 'outline' : 'destructive'
                          }>
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.gpa}</TableCell>
                        <TableCell>{result.examType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="class-subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>শ্রেণীতে বিষয় যোগ করুন</CardTitle>
                <CardDescription>Add Subject to Class</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addSubjectToClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="classSelect">শ্রেণী</Label>
                    <Select onValueChange={(value) => setClassSubject({...classSubject, classId: value})}>
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
                  <div>
                    <Label htmlFor="subjectSelect">বিষয়</Label>
                    <Select onValueChange={(value) => setClassSubject({...classSubject, subjectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit">বিষয় যোগ করুন</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}