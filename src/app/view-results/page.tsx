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
  Download, 
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
  ArrowRight
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
}

interface StudentData {
  id: string;
  roll: string;
  name: string;
  class: ClassData;
  results: ResultData[];
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
          
          // Calculate GPA
          const totalGradePoints = filteredResults.reduce((sum: number, result: ResultData) => sum + result.gradePoint, 0);
          const totalSubjects = filteredResults.length;
          const calculatedGpa = totalSubjects > 0 ? totalGradePoints / totalSubjects : 0;
          setGpa(parseFloat(calculatedGpa.toFixed(2)));
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

  const downloadResult = () => {
    if (!student) return;
    
    const element = document.getElementById('result-card');
    if (!element) return;
    
    // Create a temporary container with proper styling
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.padding = '20px';
    
    // Clone the result card
    const clonedCard = element.cloneNode(true) as HTMLElement;
    tempContainer.appendChild(clonedCard);
    
    // Add temporary styles to fix oklch color issue
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .bg-primary { background-color: #3b82f6 !important; }
      .text-primary-foreground { color: #ffffff !important; }
      .bg-secondary { background-color: #f1f5f9 !important; }
      .text-secondary-foreground { color: #0f172a !important; }
      .bg-muted { background-color: #f1f5f9 !important; }
      .text-muted-foreground { color: #64748b !important; }
      .border { border-color: #e2e8f0 !important; }
    `;
    tempContainer.appendChild(styleElement);
    
    document.body.appendChild(tempContainer);
    
    // Dynamically import html2canvas
    import('html2canvas').then((html2canvas) => {
      return html2canvas.default(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
    }).then(canvas => {
      // Convert canvas to data URL
      const image = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = image;
      link.download = `${student.name}_result.png`;
      link.click();
      
      // Clean up
      document.body.removeChild(tempContainer);
    }).catch(err => {
      console.error('Error generating image:', err);
      setError('ছবি ডাউনলোড করতে সমস্যা হয়েছে');
      document.body.removeChild(tempContainer);
    });
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
                              <th className="border border-white/20 px-4 py-3 text-left text-white">নম্বর</th>
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
                                <td className="border border-white/20 px-4 py-3 text-white font-semibold">{result.marks}</td>
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
                      onClick={downloadResult} 
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 group"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      PNG হিসেবে ডাউনলোড করুন
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