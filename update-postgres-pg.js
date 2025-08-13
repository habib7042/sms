const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_0YAPoUMWLRV7@ep-muddy-star-a1fxuehu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function updateData() {
  let client;
  try {
    console.log('Connecting to PostgreSQL database...');
    client = await pool.connect();
    console.log('Connected successfully!');

    // Test basic connection
    console.log('\n=== Testing database connection ===');
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('Database time:', timeResult.rows[0].current_time);

    // Check if tables exist
    console.log('\n=== Checking database tables ===');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    console.log('Existing tables:', tablesResult.rows.map(t => t.table_name));

    // If tables don't exist, create them
    if (tablesResult.rows.length === 0) {
      console.log('\n=== Creating database tables ===');
      
      // Create Admin table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Admin" (
          "id" TEXT PRIMARY KEY,
          "username" TEXT UNIQUE NOT NULL,
          "password" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        );
      `);

      // Create Class table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Class" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT UNIQUE NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        );
      `);

      // Create Subject table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Subject" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "code" TEXT UNIQUE NOT NULL,
          "description" TEXT,
          "maxMarks" INTEGER NOT NULL DEFAULT 100,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        );
      `);

      // Create Student table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Student" (
          "id" TEXT PRIMARY KEY,
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
          UNIQUE ("roll", "classId")
        );
      `);

      // Create ClassSubject table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "ClassSubject" (
          "id" TEXT PRIMARY KEY,
          "classId" TEXT NOT NULL,
          "subjectId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE ("classId", "subjectId")
        );
      `);

      // Create Result table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Result" (
          "id" TEXT PRIMARY KEY,
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
          UNIQUE ("studentId", "subjectId", "examType")
        );
      `);

      console.log('Database tables created successfully!');
    }

    // Add foreign key constraints
    console.log('\n=== Adding foreign key constraints ===');
    try {
      await client.query(`
        ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" 
        FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for Student.classId already exists or failed:', e.message);
    }

    try {
      await client.query(`
        ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_classId_fkey" 
        FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for ClassSubject.classId already exists or failed:', e.message);
    }

    try {
      await client.query(`
        ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_subjectId_fkey" 
        FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for ClassSubject.subjectId already exists or failed:', e.message);
    }

    try {
      await client.query(`
        ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" 
        FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for Result.studentId already exists or failed:', e.message);
    }

    try {
      await client.query(`
        ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" 
        FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for Result.subjectId already exists or failed:', e.message);
    }

    try {
      await client.query(`
        ALTER TABLE "Result" ADD CONSTRAINT "Result_classId_fkey" 
        FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key constraint for Result.classId already exists or failed:', e.message);
    }

    // Now let's add sample data
    console.log('\n=== Adding sample data ===');

    // Helper function to generate UUID
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // Add sample classes
    const classesResult = await client.query('SELECT * FROM "Class"');
    if (classesResult.rows.length === 0) {
      const classes = [
        { id: generateUUID(), name: 'Class 6', description: 'Sixth Grade' },
        { id: generateUUID(), name: 'Class 7', description: 'Seventh Grade' },
        { id: generateUUID(), name: 'Class 8', description: 'Eighth Grade' }
      ];
      
      for (const cls of classes) {
        await client.query(`
          INSERT INTO "Class" (id, name, description, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, NOW(), NOW())
        `, [cls.id, cls.name, cls.description]);
      }
      console.log('Created sample classes');
    }

    // Add sample subjects
    const subjectsResult = await client.query('SELECT * FROM "Subject"');
    if (subjectsResult.rows.length === 0) {
      const subjects = [
        { id: generateUUID(), name: 'Bangla', code: 'BAN001', maxMarks: 100 },
        { id: generateUUID(), name: 'English', code: 'ENG001', maxMarks: 100 },
        { id: generateUUID(), name: 'Mathematics', code: 'MAT001', maxMarks: 100 },
        { id: generateUUID(), name: 'Science', code: 'SCI001', maxMarks: 50 },
        { id: generateUUID(), name: 'Social Science', code: 'SOC001', maxMarks: 50 },
        { id: generateUUID(), name: 'Religious Studies', code: 'REL001', maxMarks: 50 }
      ];
      
      for (const subject of subjects) {
        await client.query(`
          INSERT INTO "Subject" (id, name, code, "maxMarks", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `, [subject.id, subject.name, subject.code, subject.maxMarks]);
      }
      console.log('Created sample subjects');
    }

    // Get the created classes
    const allClassesResult = await client.query('SELECT * FROM "Class"');
    const allClasses = allClassesResult.rows;

    // Add sample students
    const studentsResult = await client.query('SELECT * FROM "Student"');
    if (studentsResult.rows.length === 0 && allClasses.length > 0) {
      const students = [
        { id: generateUUID(), name: 'John Doe', roll: '001', classId: allClasses[0].id },
        { id: generateUUID(), name: 'Jane Smith', roll: '002', classId: allClasses[0].id },
        { id: generateUUID(), name: 'Mike Johnson', roll: '003', classId: allClasses[0].id }
      ];
      
      for (const student of students) {
        await client.query(`
          INSERT INTO "Student" (id, roll, name, "classId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `, [student.id, student.roll, student.name, student.classId]);
      }
      console.log('Created sample students');
    }

    // Get the created subjects and students
    const allSubjectsResult = await client.query('SELECT * FROM "Subject"');
    const allSubjects = allSubjectsResult.rows;
    const allStudentsResult = await client.query('SELECT * FROM "Student"');
    const allStudents = allStudentsResult.rows;

    // Add sample results
    const resultsResult = await client.query('SELECT * FROM "Result"');
    if (resultsResult.rows.length === 0 && allStudents.length > 0 && allSubjects.length > 0) {
      const results = [
        { id: generateUUID(), studentId: allStudents[0].id, subjectId: allSubjects[0].id, classId: allStudents[0].classId, marks: 85, grade: 'A', gpa: 4.0, examType: 'Final' },
        { id: generateUUID(), studentId: allStudents[0].id, subjectId: allSubjects[3].id, classId: allStudents[0].classId, marks: 45, grade: 'A+', gpa: 5.0, examType: 'Final' },
        { id: generateUUID(), studentId: allStudents[1].id, subjectId: allSubjects[0].id, classId: allStudents[1].classId, marks: 78, grade: 'A-', gpa: 3.5, examType: 'Final' },
        { id: generateUUID(), studentId: allStudents[1].id, subjectId: allSubjects[3].id, classId: allStudents[1].classId, marks: 38, grade: 'A', gpa: 4.0, examType: 'Final' }
      ];
      
      for (const result of results) {
        await client.query(`
          INSERT INTO "Result" (id, "studentId", "subjectId", "classId", marks, grade, gpa, "examType", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        `, [result.id, result.studentId, result.subjectId, result.classId, result.marks, result.grade, result.gpa, result.examType]);
      }
      console.log('Created sample results');
    }

    // Display final data
    console.log('\n=== Final Data Summary ===');
    const finalClasses = await client.query('SELECT * FROM "Class"');
    const finalSubjects = await client.query('SELECT * FROM "Subject"');
    const finalStudents = await client.query('SELECT * FROM "Student"');
    const finalResults = await client.query('SELECT * FROM "Result"');

    console.log(`Classes: ${finalClasses.rows.length}`);
    console.log(`Subjects: ${finalSubjects.rows.length}`);
    console.log(`Students: ${finalStudents.rows.length}`);
    console.log(`Results: ${finalResults.rows.length}`);

    // Show subjects with their maxMarks
    console.log('\nSubjects with maxMarks:');
    finalSubjects.rows.forEach(subject => {
      console.log(`- ${subject.name} (${subject.code}): ${subject.maxMarks} marks`);
    });

    // Show sample results
    console.log('\nSample Results:');
    const sampleResults = await client.query(`
      SELECT r.*, s.name as student_name, sub.name as subject_name, sub."maxMarks"
      FROM "Result" r
      JOIN "Student" s ON r."studentId" = s.id
      JOIN "Subject" sub ON r."subjectId" = sub.id
      LIMIT 5
    `);
    
    sampleResults.rows.forEach(result => {
      console.log(`- ${result.student_name} - ${result.subject_name}: ${result.marks}/${result.maxMarks} (Grade: ${result.grade}, GPA: ${result.gpa})`);
    });

    console.log('\n=== Data update completed successfully! ===');

  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

updateData();