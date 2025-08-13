const { PrismaClient } = require('@prisma/client');

// Create Prisma client with PostgreSQL configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0YAPoUMWLRV7@ep-muddy-star-a1fxuehu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    },
  },
});

async function updateData() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await prisma.$connect();
    console.log('Connected successfully!');

    // Check existing data
    console.log('\n=== Checking existing data ===');
    
    // Check subjects
    const subjects = await prisma.subject.findMany();
    console.log(`Found ${subjects.length} subjects:`);
    subjects.forEach(subject => {
      console.log(`- ${subject.name} (maxMarks: ${subject.maxMarks})`);
    });

    // Check students
    const students = await prisma.student.findMany();
    console.log(`\nFound ${students.length} students:`);
    students.forEach(student => {
      console.log(`- ${student.name} (ID: ${student.id})`);
    });

    // Check results
    const results = await prisma.result.findMany({
      include: {
        student: true,
        subject: true
      }
    });
    console.log(`\nFound ${results.length} results:`);
    results.forEach(result => {
      console.log(`- ${result.student.name} - ${result.subject.name}: ${result.marks}/${result.subject.maxMarks}`);
    });

    // Update subjects to include maxMarks if not already set
    console.log('\n=== Updating subjects ===');
    const updateSubjects = await prisma.subject.updateMany({
      where: {
        maxMarks: null
      },
      data: {
        maxMarks: 100
      }
    });
    console.log(`Updated ${updateSubjects.count} subjects with default maxMarks`);

    // Add sample 50-mark subjects if they don't exist
    console.log('\n=== Adding sample 50-mark subjects ===');
    const sampleSubjects = [
      { name: 'Science', code: 'SCI001', maxMarks: 50 },
      { name: 'Social Science', code: 'SOC001', maxMarks: 50 },
      { name: 'Religious Studies', code: 'REL001', maxMarks: 50 }
    ];

    for (const subjectData of sampleSubjects) {
      const existingSubject = await prisma.subject.findFirst({
        where: {
          name: subjectData.name
        }
      });

      if (!existingSubject) {
        await prisma.subject.create({
          data: subjectData
        });
        console.log(`Created subject: ${subjectData.name} (maxMarks: ${subjectData.maxMarks})`);
      } else {
        console.log(`Subject already exists: ${subjectData.name}`);
      }
    }

    // Add sample classes if they don't exist
    console.log('\n=== Adding sample classes ===');
    const sampleClasses = [
      { name: 'Class 6', description: 'Sixth Grade' },
      { name: 'Class 7', description: 'Seventh Grade' },
      { name: 'Class 8', description: 'Eighth Grade' }
    ];

    for (const classData of sampleClasses) {
      const existingClass = await prisma.class.findFirst({
        where: {
          name: classData.name
        }
      });

      if (!existingClass) {
        await prisma.class.create({
          data: classData
        });
        console.log(`Created class: ${classData.name}`);
      } else {
        console.log(`Class already exists: ${classData.name}`);
      }
    }

    // Add sample students if they don't exist
    console.log('\n=== Adding sample students ===');
    const classes = await prisma.class.findMany();
    if (classes.length > 0) {
      const sampleStudents = [
        { name: 'John Doe', roll: '001', classId: classes[0].id },
        { name: 'Jane Smith', roll: '002', classId: classes[0].id },
        { name: 'Mike Johnson', roll: '003', classId: classes[0].id }
      ];

      for (const studentData of sampleStudents) {
        const existingStudent = await prisma.student.findFirst({
          where: {
            roll: studentData.roll,
            classId: studentData.classId
          }
        });

        if (!existingStudent) {
          await prisma.student.create({
            data: studentData
          });
          console.log(`Created student: ${studentData.name} (Roll: ${studentData.roll})`);
        } else {
          console.log(`Student already exists: ${studentData.name}`);
        }
      }
    }

    // Add sample results if they don't exist
    console.log('\n=== Adding sample results ===');
    const allStudents = await prisma.student.findMany();
    const allSubjects = await prisma.subject.findMany();

    if (allStudents.length > 0 && allSubjects.length > 0) {
      const sampleResults = [
        { studentId: allStudents[0].id, subjectId: allSubjects[0].id, classId: allStudents[0].classId, marks: 85, grade: 'A', gpa: 4.0, examType: 'Final' },
        { studentId: allStudents[0].id, subjectId: allSubjects[1].id, classId: allStudents[0].classId, marks: 45, grade: 'A+', gpa: 5.0, examType: 'Final' },
        { studentId: allStudents[1].id, subjectId: allSubjects[0].id, classId: allStudents[1].classId, marks: 78, grade: 'A-', gpa: 3.5, examType: 'Final' },
        { studentId: allStudents[1].id, subjectId: allSubjects[1].id, classId: allStudents[1].classId, marks: 38, grade: 'A', gpa: 4.0, examType: 'Final' }
      ];

      for (const resultData of sampleResults) {
        const existingResult = await prisma.result.findFirst({
          where: {
            studentId: resultData.studentId,
            subjectId: resultData.subjectId,
            examType: resultData.examType
          }
        });

        if (!existingResult) {
          await prisma.result.create({
            data: resultData
          });
          console.log(`Created result for student ${resultData.studentId} in subject ${resultData.subjectId}`);
        } else {
          console.log(`Result already exists for student ${resultData.studentId} in subject ${resultData.subjectId}`);
        }
      }
    }

    // Verify final data
    console.log('\n=== Final data verification ===');
    const finalSubjects = await prisma.subject.findMany();
    console.log(`Total subjects: ${finalSubjects.length}`);
    finalSubjects.forEach(subject => {
      console.log(`- ${subject.name} (maxMarks: ${subject.maxMarks})`);
    });

    const finalClasses = await prisma.class.findMany();
    console.log(`\nTotal classes: ${finalClasses.length}`);
    finalClasses.forEach(cls => {
      console.log(`- ${cls.name}`);
    });

    const finalStudents = await prisma.student.findMany();
    console.log(`\nTotal students: ${finalStudents.length}`);
    finalStudents.forEach(student => {
      console.log(`- ${student.name} (Roll: ${student.roll})`);
    });

    const finalResults = await prisma.result.findMany({
      include: {
        student: true,
        subject: true
      }
    });
    console.log(`\nTotal results: ${finalResults.length}`);
    finalResults.forEach(result => {
      console.log(`- ${result.student.name} - ${result.subject.name}: ${result.marks}/${result.subject.maxMarks} (Grade: ${result.grade}, GPA: ${result.gpa})`);
    });

    console.log('\n=== Data update completed successfully! ===');

  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateData();