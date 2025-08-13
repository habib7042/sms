import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        class: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const student = await db.student.create({
      data: {
        roll: body.roll,
        name: body.name,
        fatherName: body.fatherName,
        motherName: body.motherName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        address: body.address,
        phone: body.phone,
        classId: body.classId
      },
      include: {
        class: true
      }
    })
    
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }
    
    const student = await db.student.update({
      where: { id },
      data: {
        roll: updateData.roll,
        name: updateData.name,
        fatherName: updateData.fatherName,
        motherName: updateData.motherName,
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : null,
        gender: updateData.gender,
        address: updateData.address,
        phone: updateData.phone,
        classId: updateData.classId
      },
      include: {
        class: true
      }
    })
    
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }
    
    await db.student.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}