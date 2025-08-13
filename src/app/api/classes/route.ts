import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const classes = await db.class.findMany({
      include: {
        students: true,
        subjects: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newClass = await db.class.create({
      data: {
        name: body.name,
        description: body.description
      }
    })
    
    return NextResponse.json(newClass)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}