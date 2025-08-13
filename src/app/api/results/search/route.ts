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

    const results = await db.result.findMany({
      where: {
        student: {
          roll: roll
        },
        classId: classId
      },
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
    return NextResponse.json({ error: 'Failed to search results' }, { status: 500 })
  }
}