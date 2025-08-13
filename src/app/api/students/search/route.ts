import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
      results: student.results.map(result => ({
        ...result,
        id: result.id, // Keep the original string ID
        gradePoint: result.gpa, // Map gpa to gradePoint for frontend
        marks: Math.round(result.marks) // Round marks to integer
      }))
    }

    return NextResponse.json(transformedStudent)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search student' }, { status: 500 })
  }
}