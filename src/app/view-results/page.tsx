'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, ArrowLeft } from 'lucide-react';

interface ClassData {
  id: number;
  name: string;
}

interface SubjectData {
  id: number;
  name: string;
}

interface ResultData {
  id: number;
  marks: number;
  grade: string;
  gradePoint: number;
  examType: string;
  subject: SubjectData;
}

interface StudentData {
  id: number;
  roll: string;
  name: string;
  class: ClassData;
  results: ResultData[];
}

export default function ViewResultsPage() {
  const [roll, setRoll] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpa, setGpa] = useState<number | null>(null);

  useEffect(() => {
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
          setStudent(data);
          
          // Calculate GPA
          const totalGradePoints = data.results.reduce((sum: number, result: ResultData) => sum + result.gradePoint, 0);
          const totalSubjects = data.results.length;
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
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'A-': return 'bg-indigo-100 text-indigo-800';
      case 'B': return 'bg-purple-100 text-purple-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            হোমপেজে ফিরে যান
          </Button>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">ফলাফল দেখুন</h1>
          <p className="text-center text-gray-600">শিক্ষার্থীর রোল এবং শ্রেণী দিয়ে ফলাফল খুঁজুন</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              শিক্ষার্থী খুঁজুন
            </CardTitle>
            <CardDescription>
              শিক্ষার্থীর রোল এবং শ্রেণী নির্বাচন করে ফলাফল দেখুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="roll">রোল নম্বর</Label>
                <Input
                  id="roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="রোল নম্বর লিখুন"
                />
              </div>
              <div>
                <Label htmlFor="class">শ্রেণী</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
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
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'খোঁজা হচ্ছে...' : 'ফলাফল দেখুন'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {student && (
          <div id="result-card">
            <Card className="mb-6">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="text-xl text-center">পরীক্ষার ফলাফল</CardTitle>
                <CardDescription className="text-center text-primary-foreground/80">
                  {student.class.name} | {new Date().toLocaleDateString('bn-BD')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <p className="text-gray-600">রোল: {student.roll}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">শ্রেণী: {student.class.name}</p>
                    <p className="text-lg font-semibold">GPA: {gpa !== null ? gpa.toFixed(2) : 'N/A'}</p>
                  </div>
                </div>

                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="results">ফলাফল</TabsTrigger>
                    <TabsTrigger value="details">বিস্তারিত</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-gray-300 px-4 py-2 text-left">বিষয়</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">পরীক্ষার ধরন</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">নম্বর</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">গ্রেড</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">গ্রেড পয়েন্ট</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.results.map((result) => (
                            <tr key={result.id} className="hover:bg-muted/50">
                              <td className="border border-gray-300 px-4 py-2">{result.subject.name}</td>
                              <td className="border border-gray-300 px-4 py-2">{result.examType}</td>
                              <td className="border border-gray-300 px-4 py-2">{result.marks}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <Badge className={getGradeColor(result.grade)}>
                                  {result.grade}
                                </Badge>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{result.gradePoint.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">শিক্ষার্থী তথ্য</h3>
                        <p><strong>নাম:</strong> {student.name}</p>
                        <p><strong>রোল:</strong> {student.roll}</p>
                        <p><strong>শ্রেণী:</strong> {student.class.name}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">ফলাফলের সারাংশ</h3>
                        <p><strong>মোট বিষয়:</strong> {student.results.length}</p>
                        <p><strong>GPA:</strong> {gpa !== null ? gpa.toFixed(2) : 'N/A'}</p>
                        <p><strong>সর্বোচ্চ গ্রেড:</strong> {
                          student.results.reduce((max, result) => 
                            result.gradePoint > max.gradePoint ? result : max, 
                            student.results[0]
                          )?.grade || 'N/A'
                        }</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-center">
                  <Button onClick={downloadResult} className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    PNG হিসেবে ডাউনলোড করুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}