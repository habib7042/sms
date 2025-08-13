import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateGrade, calculateOverallGPA } from '@/lib/gpa-calculation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roll = searchParams.get('roll')
    const classId = searchParams.get('classId')

    if (!roll || !classId) {
      return NextResponse.json({ error: 'Roll and class ID are required' }, { status: 400 })
    }

    const student = await db.student.findFirst({
      where: {
        roll: roll,
        classId: classId
      },
      include: {
        class: true,
        results: {
          include: {
            subject: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Transform the data to match frontend expectations
    const transformedStudent = {
      ...student,
      id: student.id, // Keep the original string ID
      results: student.results.map(result => {
        // Recalculate grade and GPA based on subject's maxMarks
        const maxMarks = result.subject.maxMarks || 100
        const gradeInfo = calculateGrade(result.marks, maxMarks)
        
        return {
          ...result,
          id: result.id, // Keep the original string ID
          gradePoint: gradeInfo.gpa, // Use calculated GPA
          grade: gradeInfo.grade, // Use calculated grade
          marks: Math.round(result.marks), // Round marks to integer
          maxMarks: maxMarks // Include maxMarks for frontend
        }
      })
    }

    // Calculate overall GPA using the new calculation method
    const overallGPA = calculateOverallGPA(
      transformedStudent.results.map(result => ({
        marks: result.marks,
        maxMarks: result.maxMarks || 100
      }))
    )

    // Add overall GPA to the response
    const responseWithGPA = {
      ...transformedStudent,
      overallGPA: parseFloat(overallGPA.toFixed(2))
    }

    return NextResponse.json(responseWithGPA)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search student' }, { status: 500 })
  }
}