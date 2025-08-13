-- SQLite Database Schema for Student Management System
-- Generated from Prisma schema
-- Supports 100-mark and 50-mark subjects with GPA calculation

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Create Admin table
CREATE TABLE "Admin" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Class table
CREATE TABLE "Class" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Subject table
CREATE TABLE "Subject" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "maxMarks" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ClassSubject junction table
CREATE TABLE "ClassSubject" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
    FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE,
    
    UNIQUE ("classId", "subjectId")
);

-- Create Student table
CREATE TABLE "Student" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "roll" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "classId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
    
    UNIQUE ("roll", "classId")
);

-- Create Result table
CREATE TABLE "Result" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "marks" REAL NOT NULL,
    "grade" TEXT NOT NULL,
    "gpa" REAL NOT NULL,
    "examType" TEXT NOT NULL,
    "examDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE,
    FOREIGN KEY ("classId" ) REFERENCES "Class"("id") ON DELETE CASCADE,
    
    UNIQUE ("studentId", "subjectId", "examType")
);

-- Create indexes for better performance
CREATE INDEX "idx_admin_username" ON "Admin"("username");
CREATE INDEX "idx_class_name" ON "Class"("name");
CREATE INDEX "idx_subject_code" ON "Subject"("code");
CREATE INDEX "idx_subject_name" ON "Subject"("name");
CREATE INDEX "idx_student_roll" ON "Student"("roll");
CREATE INDEX "idx_student_name" ON "Student"("name");
CREATE INDEX "idx_student_class" ON "Student"("classId");
CREATE INDEX "idx_result_student" ON "Result"("studentId");
CREATE INDEX "idx_result_subject" ON "Result"("subjectId");
CREATE INDEX "idx_result_class" ON "Result"("classId");
CREATE INDEX "idx_result_exam_type" ON "Result"("examType");
CREATE INDEX "idx_result_marks" ON "Result"("marks");
CREATE INDEX "idx_result_gpa" ON "Result"("gpa");

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_updated_at 
    AFTER UPDATE ON "Admin"
    FOR EACH ROW
BEGIN
        UPDATE "Admin" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

CREATE TRIGGER update_class_updated_at 
    AFTER UPDATE ON "Class"
    FOR EACH ROW
BEGIN
        UPDATE "Class" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

CREATE TRIGGER update_subject_updated_at 
    AFTER UPDATE ON "Subject"
    FOR EACH ROW
BEGIN
        UPDATE "Subject" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

CREATE TRIGGER update_student_updated_at 
    AFTER UPDATE ON "Student"
    FOR EACH ROW
BEGIN
        UPDATE "Student" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

CREATE TRIGGER update_result_updated_at 
    AFTER UPDATE ON "Result"
    FOR EACH ROW
BEGIN
        UPDATE "Result" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

-- Create trigger for marks validation
CREATE TRIGGER validate_result_marks
    BEFORE INSERT ON "Result"
    FOR EACH ROW
BEGIN
        SELECT CASE 
            WHEN NEW.marks > (SELECT "maxMarks" FROM "Subject" WHERE "id" = NEW.subjectId) THEN
                RAISE(ABORT, 'Marks cannot exceed maximum marks for the subject')
            WHEN NEW.marks < 0 THEN
                RAISE(ABORT, 'Marks cannot be negative')
        END;
    END;

CREATE TRIGGER validate_result_marks_update
    BEFORE UPDATE ON "Result"
    FOR EACH ROW
BEGIN
        SELECT CASE 
            WHEN NEW.marks > (SELECT "maxMarks" FROM "Subject" WHERE "id" = NEW.subjectId) THEN
                RAISE(ABORT, 'Marks cannot exceed maximum marks for the subject')
            WHEN NEW.marks < 0 THEN
                RAISE(ABORT, 'Marks cannot be negative')
        END;
    END;

-- Create views for common queries

-- View for student results with subject information
CREATE VIEW "StudentResultsView" AS
SELECT 
    s."id" as "studentId",
    s."roll",
    s."name" as "studentName",
    c."name" as "className",
    sub."id" as "subjectId",
    sub."name" as "subjectName",
    sub."code" as "subjectCode",
    sub."maxMarks",
    r."marks",
    r."grade",
    r."gpa",
    r."examType",
    r."examDate",
    r."createdAt" as "resultDate"
FROM "Result" r
JOIN "Student" s ON r."studentId" = s."id"
JOIN "Class" c ON r."classId" = c."id"
JOIN "Subject" sub ON r."subjectId" = sub."id";

-- View for class performance summary
CREATE VIEW "ClassPerformanceView" AS
SELECT 
    c."id" as "classId",
    c."name" as "className",
    COUNT(DISTINCT s."id") as "totalStudents",
    COUNT(r."id") as "totalResults",
    AVG(r."gpa") as "averageGPA",
    AVG(r."marks") as "averageMarks"
FROM "Class" c
LEFT JOIN "Student" s ON c."id" = s."classId"
LEFT JOIN "Result" r ON s."id" = r."studentId"
GROUP BY c."id", c."name";

-- View for subject performance summary
CREATE VIEW "SubjectPerformanceView" AS
SELECT 
    sub."id" as "subjectId",
    sub."name" as "subjectName",
    sub."code" as "subjectCode",
    sub."maxMarks",
    COUNT(r."id") as "totalResults",
    AVG(r."gpa") as "averageGPA",
    AVG(r."marks") as "averageMarks",
    MAX(r."marks") as "highestMarks",
    MIN(r."marks") as "lowestMarks"
FROM "Subject" sub
LEFT JOIN "Result" r ON sub."id" = r."subjectId"
GROUP BY sub."id", sub."name", sub."code", sub."maxMarks";

-- Add sample data insertion script (optional - can be run separately)
/*
-- Sample Classes
INSERT INTO "Class" ("id", "name", "description") VALUES 
    ('class-1', 'Class 6', 'Sixth Grade'),
    ('class-2', 'Class 7', 'Seventh Grade'),
    ('class-3', 'Class 8', 'Eighth Grade');

-- Sample Subjects (100-mark and 50-mark)
INSERT INTO "Subject" ("id", "name", "code", "maxMarks") VALUES 
    ('subj-1', 'Bangla', 'BAN001', 100),
    ('subj-2', 'English', 'ENG001', 100),
    ('subj-3', 'Mathematics', 'MAT001', 100),
    ('subj-4', 'Science', 'SCI001', 50),
    ('subj-5', 'Social Science', 'SOC001', 50),
    ('subj-6', 'Religious Studies', 'REL001', 50);

-- Sample Admin (password: admin123 - hashed)
INSERT INTO "Admin" ("id", "username", "password") VALUES 
    ('admin-1', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqK3a7L0JQzK4sXrMkFJ6mK8J5K5K6');
*/