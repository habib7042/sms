import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash the admin password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Admin user created/updated:', {
    id: admin.id,
    username: admin.username,
    password: '***' // Don't log the actual password
  });

  // Create some sample classes
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { name: 'ষষ্ঠ শ্রেণী' },
      update: {},
      create: {
        name: 'ষষ্ঠ শ্রেণী',
        description: 'Class 6',
      },
    }),
    prisma.class.upsert({
      where: { name: 'সপ্তম শ্রেণী' },
      update: {},
      create: {
        name: 'সপ্তম শ্রেণী',
        description: 'Class 7',
      },
    }),
    prisma.class.upsert({
      where: { name: 'অষ্টম শ্রেণী' },
      update: {},
      create: {
        name: 'অষ্টম শ্রেণী',
        description: 'Class 8',
      },
    }),
    prisma.class.upsert({
      where: { name: 'নবম শ্রেণী' },
      update: {},
      create: {
        name: 'নবম শ্রেণী',
        description: 'Class 9',
      },
    }),
    prisma.class.upsert({
      where: { name: 'দশম শ্রেণী' },
      update: {},
      create: {
        name: 'দশম শ্রেণী',
        description: 'Class 10',
      },
    }),
  ]);

  console.log('Classes created/updated:', classes.map(c => c.name));

  // Create some sample subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { code: 'BAN' },
      update: {},
      create: {
        name: 'বাংলা',
        code: 'BAN',
        description: 'Bangla Language',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'ENG' },
      update: {},
      create: {
        name: 'ইংরেজি',
        code: 'ENG',
        description: 'English Language',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'MAT' },
      update: {},
      create: {
        name: 'গণিত',
        code: 'MAT',
        description: 'Mathematics',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'SCI' },
      update: {},
      create: {
        name: 'বিজ্ঞান',
        code: 'SCI',
        description: 'General Science',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'SOC' },
      update: {},
      create: {
        name: 'সামাজিক বিজ্ঞান',
        code: 'SOC',
        description: 'Social Science',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'REL' },
      update: {},
      create: {
        name: 'ধর্ম',
        code: 'REL',
        description: 'Religious Studies',
      },
    }),
  ]);

  console.log('Subjects created/updated:', subjects.map(s => s.name));

  // Assign subjects to classes (Class-Subject relationships)
  const classSubjects = await Promise.all([
    // Class 6 subjects
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[0].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[0].id,
      },
    }),
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[1].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[1].id,
      },
    }),
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[2].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[2].id,
      },
    }),
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[3].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[3].id,
      },
    }),
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[4].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[4].id,
      },
    }),
    prisma.classSubject.upsert({
      where: { 
        classId_subjectId: { 
          classId: classes[0].id, 
          subjectId: subjects[5].id 
        } 
      },
      update: {},
      create: {
        classId: classes[0].id,
        subjectId: subjects[5].id,
      },
    }),
  ]);

  console.log('Class-Subject relationships created:', classSubjects.length);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });