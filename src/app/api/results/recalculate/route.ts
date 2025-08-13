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

export async function POST() {
  try {
    // Fetch all results
    const results = await db.result.findMany()
    
    let updatedCount = 0
    
    // Recalculate grade and GPA for each result
    for (const result of results) {
      const { grade, gpa } = calculateGradeAndGPA(result.marks)
      
      // Update if grade or GPA has changed
      if (result.grade !== grade || result.gpa !== gpa) {
        await db.result.update({
          where: { id: result.id },
          data: {
            grade: grade,
            gpa: gpa
          }
        })
        updatedCount++
      }
    }
    
    return NextResponse.json({ 
      message: `Recalculated ${updatedCount} results successfully`,
      totalResults: results.length,
      updatedResults: updatedCount
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to recalculate results' }, { status: 500 })
  }
}