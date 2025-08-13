const { PrismaClient } = require('@prisma/client');

// Create Prisma client with explicit PostgreSQL configuration
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

    // Test basic connection with a simple query
    console.log('\n=== Testing database connection ===');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('Database time:', result[0].current_time);

    // Check if tables exist
    console.log('\n=== Checking database tables ===');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    console.log('Existing tables:', tables.map(t => t.table_name));

    // If tables don't exist, we need to create them
    if (tables.length === 0) {
      console.log('\n=== Creating database tables ===');
      
      // Create tables using raw SQL
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Admin" (
          "id" TEXT NOT NULL,
          "username" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Admin_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Admin_username_key" UNIQUE ("username")
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Class" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Class_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Class_name_key" UNIQUE ("name")
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Subject" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "description" TEXT,
          "maxMarks" INTEGER NOT NULL DEFAULT 100,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Subject_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Subject_code_key" UNIQUE ("code")
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Student" (
          "id" TEXT NOT NULL,
          "roll" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "fatherName" TEXT,
          "motherName" TEXT,
          "dateOfBirth" TIMESTAMP(3),
          "gender" TEXT,
          "address" TEXT,
          "phone" TEXT,
          "classId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Student_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Student_roll_classId_key" UNIQUE ("roll", "classId")
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "ClassSubject" (
          "id" TEXT NOT NULL,
          "classId" TEXT NOT NULL,
          "subjectId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ClassSubject_classId_subjectId_key" UNIQUE ("classId", "subjectId")
        );
      `;

      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Result" (
          "id" TEXT NOT NULL,
          "studentId" TEXT NOT NULL,
          "subjectId" TEXT NOT NULL,
          "classId" TEXT NOT NULL,
          "marks" DOUBLE PRECISION NOT NULL,
          "grade" TEXT NOT NULL,
          "gpa" DOUBLE PRECISION NOT NULL,
          "examType" TEXT NOT NULL,
          "examDate" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Result_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Result_studentId_subjectId_examType_key" UNIQUE ("studentId", "subjectId", "examType")
        );
      `;

      console.log('Database tables created successfully!');
    }

    // Now let's add sample data
    console.log('\n=== Adding sample data ===');

    // Add sample classes
    const classes = await prisma.class.findMany();
    if (classes.length === 0) {
      await prisma.class.createMany({
        data: [
          { name: 'Class 6', description: 'Sixth Grade' },
          { name: 'Class 7', description: 'Seventh Grade' },
          { name: 'Class 8', description: 'Eighth Grade' }
        ]
      });
      console.log('Created sample classes');
    }

    // Add sample subjects
    const subjects = await prisma.subject.findMany();
    if (subjects.length === 0) {
      await prisma.subject.createMany({
        data: [
          { name: 'Bangla', code: 'BAN001', maxMarks: 100 },
          { name: 'English', code: 'ENG001', maxMarks: 100 },
          { name: 'Mathematics', code: 'MAT001', maxMarks: 100 },
          { name: 'Science', code: 'SCI001', maxMarks: 50 },
          { name: 'Social Science', code: 'SOC001', maxMarks: 50 },
          { name: 'Religious Studies', code: 'REL001', maxMarks: 50 }
        ]
      });
      console.log('Created sample subjects');
    }

    // Get the created classes and subjects
    const allClasses = await prisma.class.findMany();
    const allSubjects = await prisma.subject.findMany();

    // Add sample students
    const students = await prisma.student.findMany();
    if (students.length === 0 && allClasses.length > 0) {
      await prisma.student.createMany({
        data: [
          { name: 'John Doe', roll: '001', classId: allClasses[0].id },
          { name: 'Jane Smith', roll: '002', classId: allClasses[0].id },
          { name: 'Mike Johnson', roll: '003', classId: allClasses[0].id }
        ]
      });
      console.log('Created sample students');
    }

    // Add sample results
    const results = await prisma.result.findMany();
    const allStudents = await prisma.student.findMany();
    if (results.length === 0 && allStudents.length > 0 && allSubjects.length > 0) {
      await prisma.result.createMany({
        data: [
          { studentId: allStudents[0].id, subjectId: allSubjects[0].id, classId: allStudents[0].classId, marks: 85, grade: 'A', gpa: 4.0, examType: 'Final' },
          { studentId: allStudents[0].id, subjectId: allSubjects[3].id, classId: allStudents[0].classId, marks: 45, grade: 'A+', gpa: 5.0, examType: 'Final' },
          { studentId: allStudents[1].id, subjectId: allSubjects[0].id, classId: allStudents[1].classId, marks: 78, grade: 'A-', gpa: 3.5, examType: 'Final' },
          { studentId: allStudents[1].id, subjectId: allSubjects[3].id, classId: allStudents[1].classId, marks: 38, grade: 'A', gpa: 4.0, examType: 'Final' }
        ]
      });
      console.log('Created sample results');
    }

    // Display final data
    console.log('\n=== Final Data Summary ===');
    console.log(`Classes: ${(await prisma.class.findMany()).length}`);
    console.log(`Subjects: ${(await prisma.subject.findMany()).length}`);
    console.log(`Students: ${(await prisma.student.findMany()).length}`);
    console.log(`Results: ${(await prisma.result.findMany()).length}`);

    // Show subjects with their maxMarks
    const finalSubjects = await prisma.subject.findMany();
    console.log('\nSubjects with maxMarks:');
    finalSubjects.forEach(subject => {
      console.log(`- ${subject.name} (${subject.code}): ${subject.maxMarks} marks`);
    });

    console.log('\n=== Data update completed successfully! ===');

  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateData();