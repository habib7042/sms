import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const classSubjects = await db.classSubject.findMany({
      include: {
        class: true,
        subject: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(classSubjects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch class subjects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if the combination already exists
    const existing = await db.classSubject.findFirst({
      where: {
        classId: body.classId,
        subjectId: body.subjectId
      }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'This subject is already assigned to this class' }, { status: 400 })
    }
    
    const classSubject = await db.classSubject.create({
      data: {
        classId: body.classId,
        subjectId: body.subjectId
      },
      include: {
        class: true,
        subject: true
      }
    })
    
    return NextResponse.json(classSubject)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign subject to class' }, { status: 500 })
  }
}