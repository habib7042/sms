// GPA calculation functions for different marking systems

export interface GradeInfo {
  grade: string;
  gpa: number;
}

/**
 * Calculate grade and GPA for 100-mark subjects
 * Standard GPA system for 100 marks
 */
export function calculateGrade100(marks: number): GradeInfo {
  if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 70) return { grade: 'A', gpa: 4.0 };
  if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
  if (marks >= 50) return { grade: 'B', gpa: 3.0 };
  if (marks >= 40) return { grade: 'C', gpa: 2.0 };
  if (marks >= 33) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
}

/**
 * Calculate grade and GPA for 50-mark subjects
 * Special GPA system for 50 marks as requested:
 * 40-50: 5.00 (A+)
 * 35-39: 4.00 (A)
 * 30-34: 3.50 (A-)
 * 25-29: 3.00 (B)
 * 20-24: 2.00 (C)
 * 17-19: 1.00 (D)
 * 0-16: 0.00 (F)
 */
export function calculateGrade50(marks: number): GradeInfo {
  if (marks >= 40) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 35) return { grade: 'A', gpa: 4.0 };
  if (marks >= 30) return { grade: 'A-', gpa: 3.5 };
  if (marks >= 25) return { grade: 'B', gpa: 3.0 };
  if (marks >= 20) return { grade: 'C', gpa: 2.0 };
  if (marks >= 17) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
}

/**
 * Calculate grade and GPA based on maximum marks
 * Automatically selects the appropriate calculation method
 */
export function calculateGrade(marks: number, maxMarks: number = 100): GradeInfo {
  if (maxMarks === 50) {
    return calculateGrade50(marks);
  }
  // Default to 100-mark system
  return calculateGrade100(marks);
}

/**
 * Calculate overall GPA from multiple results
 * Takes into account different marking systems
 */
export function calculateOverallGPA(results: Array<{ marks: number; maxMarks: number }>): number {
  if (results.length === 0) return 0;
  
  const totalGPA = results.reduce((sum, result) => {
    const gradeInfo = calculateGrade(result.marks, result.maxMarks);
    return sum + gradeInfo.gpa;
  }, 0);
  
  return totalGPA / results.length;
}

/**
 * Get grade color for UI display
 */
export function getGradeColor(grade: string): string {
  switch (grade.toLowerCase()) {
    case 'a+': return 'bg-green-500 text-white';
    case 'a': return 'bg-blue-500 text-white';
    case 'a-': return 'bg-indigo-500 text-white';
    case 'b': return 'bg-purple-500 text-white';
    case 'c': return 'bg-yellow-500 text-white';
    case 'd': return 'bg-orange-500 text-white';
    case 'f': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

/**
 * Format marks display with max marks indication
 */
export function formatMarks(marks: number, maxMarks: number = 100): string {
  if (maxMarks === 100) {
    return marks.toString();
  }
  return `${marks}/${maxMarks}`;
}

/**
 * Check if marks are passing for the given marking system
 */
export function isPassing(marks: number, maxMarks: number = 100): boolean {
  if (maxMarks === 50) {
    return marks >= 17; // Passing marks for 50-mark system
  }
  return marks >= 33; // Passing marks for 100-mark system
}