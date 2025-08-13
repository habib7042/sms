'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  BookOpen, 
  Award, 
  User,
  GraduationCap,
  Star,
  TrendingUp,
  FileText,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
}

interface SubjectData {
  id: string;
  name: string;
}

interface ResultData {
  id: string;
  marks: number;
  grade: string;
  gradePoint: number;
  examType: string;
  subject: SubjectData;
  maxMarks?: number; // Maximum marks for this subject
}

interface StudentData {
  id: string;
  roll: string;
  name: string;
  class: ClassData;
  results: ResultData[];
  overallGPA?: number; // Overall GPA calculated by API
}

export default function ViewResultsPage() {
  const [roll, setRoll] = useState('');
  const [classId, setClassId] = useState('');
  const [examType, setExamType] = useState('');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpa, setGpa] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Available exam types
  const examTypes = [
    'প্রথম সেমিস্টার',
    'দ্বিতীয় সেমিস্টার',
    'তৃতীয় সেমিস্টার',
    'চতুর্থ সেমিস্টার',
    'বার্ষিক পরীক্ষা',
    'মডেল টেস্ট',
    'টেস্ট'
  ];

  useEffect(() => {
    setMounted(true);
    // Fetch classes
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        }
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      }
    };
    fetchClasses();
  }, []);

  const handleSearch = async () => {
    if (!roll || !classId) {
      setError('রোল এবং শ্রেণী উভয়ই পূরণ করুন');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);
    setGpa(null);

    try {
      const response = await fetch(`/api/students/search?roll=${roll}&classId=${classId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Filter results by exam type if selected
          let filteredResults = data.results;
          if (examType && examType !== 'all') {
            filteredResults = data.results.filter((result: ResultData) => 
              result.examType === examType
            );
          }
          
          setStudent({
            ...data,
            results: filteredResults
          });
          
          // Use overall GPA from API if available, otherwise calculate manually
          if (data.overallGPA !== undefined) {
            setGpa(data.overallGPA);
          } else {
            // Fallback to manual calculation
            const totalGradePoints = filteredResults.reduce((sum: number, result: ResultData) => sum + result.gradePoint, 0);
            const totalSubjects = filteredResults.length;
            const calculatedGpa = totalSubjects > 0 ? totalGradePoints / totalSubjects : 0;
            setGpa(parseFloat(calculatedGpa.toFixed(2)));
          }
        } else {
          setError('কোন শিক্ষার্থী পাওয়া যায়নি');
        }
      } else {
        setError('শিক্ষার্থী খুঁজে পেতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Failed to search student:', err);
      setError('সার্ভার ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  const printResult = () => {
    if (!student) return;
    
    const printContent = document.getElementById('result-card');
    if (!printContent) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Create print-friendly HTML
    const printHTML = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>শিক্ষার্থীর ফলাফল - ${student.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Noto Sans Bengali', Arial, sans-serif;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          
          .school-name {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }
          
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .info-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            background: #f9f9f9;
          }
          
          .info-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
          }
          
          .info-value {
            color: #333;
          }
          
          .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .results-table th,
          .results-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          
          .results-table th {
            background: #333;
            color: white;
            font-weight: 600;
          }
          
          .results-table tr:nth-child(even) {
            background: #f9f9f9;
          }
          
          .grade-a-plus { background: #22c55e; color: white; }
          .grade-a { background: #3b82f6; color: white; }
          .grade-a-minus { background: #6366f1; color: white; }
          .grade-b { background: #8b5cf6; color: white; }
          .grade-c { background: #eab308; color: white; }
          .grade-d { background: #f97316; color: white; }
          .grade-f { background: #ef4444; color: white; }
          
          .gpa-section {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #333;
            border-radius: 8px;
            background: #f0f0f0;
          }
          
          .gpa-label {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }
          
          .gpa-value {
            font-size: 36px;
            font-weight: 700;
            color: #1a1a1a;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .print-container {
              margin: 0;
              padding: 15px;
            }
            
            .no-print {
              display: none !important;
            }
          }
          
          @media (max-width: 600px) {
            .student-info {
              grid-template-columns: 1fr;
            }
            
            .results-table {
              font-size: 12px;
            }
            
            .results-table th,
            .results-table td {
              padding: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="school-name">Noakhali Ideal Madrasah</div>
            <div class="title">পরীক্ষার ফলাফল</div>
            <div class="subtitle">Examination Result</div>
          </div>
          
          <div class="student-info">
            <div class="info-card">
              <div class="info-title">শিক্ষার্থীর তথ্য</div>
              <div class="info-item">
                <span class="info-label">নাম:</span>
                <span class="info-value">${student.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">রোল নম্বর:</span>
                <span class="info-value">${student.roll}</span>
              </div>
              <div class="info-item">
                <span class="info-label">শ্রেণী:</span>
                <span class="info-value">${student.class.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">লিঙ্গ:</span>
                <span class="info-value">${student.gender === 'Male' ? 'পুরুষ' : student.gender === 'Female' ? 'মহিলা' : student.gender}</span>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-title">পরীক্ষার তথ্য</div>
              <div class="info-item">
                <span class="info-label">পরীক্ষার ধরন:</span>
                <span class="info-value">${examType || 'সকল পরীক্ষা'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">তারিখ:</span>
                <span class="info-value">${new Date().toLocaleDateString('bn-BD')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">মোট বিষয়:</span>
                <span class="info-value">${student.results.length}</span>
              </div>
              <div class="info-item">
                <span class="info-label">মোট নম্বর:</span>
                <span class="info-value">${student.results.reduce((sum, result) => sum + result.marks, 0)}${student.results.some(r => r.maxMarks && r.maxMarks !== 100) ? ' (বিভিন্ন মান)' : ''}</span>
              </div>
            </div>
          </div>
          
          <table class="results-table">
            <thead>
              <tr>
                <th>বিষয়</th>
                <th>নম্বর${student.results.some(r => r.maxMarks && r.maxMarks !== 100) ? ' (সর্বোচ্চ)' : ''}</th>
                <th>গ্রেড</th>
                <th>গ্রেড পয়েন্ট</th>
              </tr>
            </thead>
            <tbody>
              ${student.results.map(result => `
                <tr>
                  <td>${result.subject.name}</td>
                  <td>${result.maxMarks && result.maxMarks !== 100 ? `${result.marks}/${result.maxMarks}` : result.marks}</td>
                  <td><span class="grade-${result.grade.toLowerCase().replace('+', '-plus')}">${result.grade}</span></td>
                  <td>${result.gradePoint}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="gpa-section">
            <div class="gpa-label">জিপিএ (GPA)</div>
            <div class="gpa-value">${gpa !== null ? gpa.toFixed(2) : 'N/A'}</div>
          </div>
          
          <div class="footer">
            <p>© 2024 Noakhali Ideal Madrasah. All rights reserved.</p>
            <p>Generated on: ${new Date().toLocaleString('bn-BD')}</p>
          </div>
        </div>
        
        <script>
          // Auto print when page loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'A': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'A-': return 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white';
      case 'B': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'C': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'D': return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      case 'F': return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'A+': return <Star className="w-4 h-4" />;
      case 'A': return <Star className="w-4 h-4" />;
      case 'A-': return <Star className="w-4 h-4" />;
      case 'B': return <CheckCircle className="w-4 h-4" />;
      case 'C': return <CheckCircle className="w-4 h-4" />;
      case 'D': return <AlertCircle className="w-4 h-4" />;
      case 'F': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (!mounted) return null;

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
            ফলাফল অনুসন্ধান পোর্টাল
          </motion.h2>
          <motion.p 
            className="text-lg text-blue-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Student Results Search Portal
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
                <Search className="mr-3 h-6 w-6 text-yellow-400" />
                শিক্ষার্থী ফলাফল অনুসন্ধান
              </CardTitle>
              <CardDescription className="text-blue-200">
                শিক্ষার্থীর রোল, শ্রেণী এবং পরীক্ষার ধরন দিয়ে ফলাফল খুঁজুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="roll" className="text-white">রোল নম্বর</Label>
                  <Input
                    id="roll"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="রোল নম্বর লিখুন"
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="class" className="text-white">শ্রেণী</Label>
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="examType" className="text-white">পরীক্ষার ধরন (ঐচ্ছিক)</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="পরীক্ষার ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">সকল পরীক্ষা</SelectItem>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 text-lg group"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    খোঁজা হচ্ছে...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    ফলাফল অনুসন্ধান করুন
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
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

        {student && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            id="result-card"
          >
            {/* Student Info Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                  <Award className="mr-3 h-8 w-8 text-yellow-400" />
                  পরীক্ষার ফলাফল
                  <Sparkles className="ml-3 h-6 w-6 text-yellow-400" />
                </CardTitle>
                <CardDescription className="text-center text-blue-100">
                  {student.class.name} | {new Date().toLocaleDateString('bn-BD')}
                  {examType && ` | ${examType}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <User className="mr-2 h-6 w-6 text-blue-400" />
                      <h2 className="text-2xl font-bold">{student.name}</h2>
                    </div>
                    <p className="text-blue-200 flex items-center justify-center md:justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      রোল: {student.roll}
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end mb-2">
                      <BookOpen className="mr-2 h-6 w-6 text-green-400" />
                      <p className="text-lg font-semibold">শ্রেণী: {student.class.name}</p>
                    </div>
                    <div className="flex items-center justify-center md:justify-end">
                      <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
                      <p className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        GPA: {gpa !== null ? gpa.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="results" className="text-white hover:bg-white/20">
                      <FileText className="mr-2 h-4 w-4" />
                      ফলাফল
                    </TabsTrigger>
                    <TabsTrigger value="details" className="text-white hover:bg-white/20">
                      <User className="mr-2 h-4 w-4" />
                      বিস্তারিত
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results" className="mt-4">
                    {student.results.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-white/10">
                              <th className="border border-white/20 px-4 py-3 text-left text-white">বিষয়</th>
                              <th className="border border-white/20 px-4 py-3 text-left text-white">পরীক্ষার ধরন</th>
                              <th className="border border-white/20 px-4 py-3 text-left text-white">নম্বর{student?.results.some(r => r.maxMarks && r.maxMarks !== 100) ? ' (সর্বোচ্চ)' : ''}</th>
                              <th className="border border-white/20 px-4 py-3 text-left text-white">গ্রেড</th>
                              <th className="border border-white/20 px-4 py-3 text-left text-white">গ্রেড পয়েন্ট</th>
                            </tr>
                          </thead>
                          <tbody>
                            {student.results.map((result, index) => (
                              <motion.tr 
                                key={result.id} 
                                className="hover:bg-white/10 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                <td className="border border-white/20 px-4 py-3 text-white">{result.subject.name}</td>
                                <td className="border border-white/20 px-4 py-3 text-white">
                                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/50">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {result.examType}
                                  </Badge>
                                </td>
                                <td className="border border-white/20 px-4 py-3 text-white font-semibold">
                                  {result.maxMarks && result.maxMarks !== 100 ? `${result.marks}/${result.maxMarks}` : result.marks}
                                </td>
                                <td className="border border-white/20 px-4 py-3 text-white">
                                  <Badge className={getGradeColor(result.grade)}>
                                    {getGradeIcon(result.grade)}
                                    <span className="ml-1">{result.grade}</span>
                                  </Badge>
                                </td>
                                <td className="border border-white/20 px-4 py-3 text-white font-semibold">{result.gradePoint.toFixed(2)}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <p className="text-xl text-white mb-2">কোন ফলাফল পাওয়া যায়নি</p>
                        <p className="text-blue-200">নির্বাচিত পরীক্ষার ধরনের জন্য কোন ফলাফল নেই</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
                      >
                        <h3 className="font-semibold mb-4 text-white flex items-center">
                          <User className="mr-2 h-5 w-5 text-blue-400" />
                          শিক্ষার্থী তথ্য
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-200">নাম:</span>
                            <span className="text-white font-semibold">{student.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">রোল:</span>
                            <span className="text-white font-semibold">{student.roll}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">শ্রেণী:</span>
                            <span className="text-white font-semibold">{student.class.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">মোট বিষয়:</span>
                            <span className="text-white font-semibold">{student.results.length}</span>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border-white/20"
                      >
                        <h3 className="font-semibold mb-4 text-white flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                          ফলাফলের সারাংশ
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-200">মোট বিষয়:</span>
                            <span className="text-white font-semibold">{student.results.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">GPA:</span>
                            <span className="text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                              {gpa !== null ? gpa.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">সর্বোচ্চ গ্রেড:</span>
                            <span className="text-white font-semibold">
                              {student.results.length > 0 ? 
                                student.results.reduce((max, result) => 
                                  result.gradePoint > max.gradePoint ? result : max, 
                                  student.results[0]
                                )?.grade || 'N/A' : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200">গড় নম্বর:</span>
                            <span className="text-white font-semibold">
                              {student.results.length > 0 ? 
                                (student.results.reduce((sum, result) => sum + result.marks, 0) / student.results.length).toFixed(2) 
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>

                {student.results.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={printResult} 
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 group"
                    >
                      <Printer className="mr-2 h-5 w-5" />
                      প্রিন্ট করুন
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
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
  );
}