import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        classes: {
          include: {
            class: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const subject = await db.subject.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description,
        maxMarks: body.maxMarks || 100 // Default to 100 if not provided
      }
    })
    
    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
}