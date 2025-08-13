import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function calculateGradeAndGPA(marks) {
  const mark = parseFloat(marks)
  if (mark >= 79) return { grade: 'A+', gpa: 5 }
  if (mark >= 69) return { grade: 'A', gpa: 4 }
  if (mark >= 59) return { grade: 'A-', gpa: 3.5 }
  if (mark >= 49) return { grade: 'B', gpa: 3 }
  if (mark >= 39) return { grade: 'C', gpa: 2 }
  if (mark >= 33) return { grade: 'D', gpa: 1 }
  return { grade: 'F', gpa: 0 }
}

export async function GET() {
  try {
    const results = await db.result.findMany({
      include: {
        student: true,
        subject: true,
        class: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const marks = parseFloat(body.marks)
    
    // Calculate grade and GPA on server side
    const { grade, gpa } = calculateGradeAndGPA(marks)
    
    const result = await db.result.create({
      data: {
        studentId: body.studentId,
        subjectId: body.subjectId,
        classId: body.classId,
        marks: marks,
        grade: grade,
        gpa: gpa,
        examType: body.examType,
        examDate: body.examDate ? new Date(body.examDate) : null
      },
      include: {
        student: true,
        subject: true,
        class: true
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 })
  }
}