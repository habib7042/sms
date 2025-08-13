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
        class: true
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search student' }, { status: 500 })
  }
}