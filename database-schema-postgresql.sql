-- PostgreSQL Database Schema for Student Management System
-- Generated from Prisma schema
-- Supports 100-mark and 50-mark subjects with GPA calculation

-- Enable UUID extension for CUID() equivalent
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Admin table
CREATE TABLE "Admin" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Class table
CREATE TABLE "Class" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Subject table
CREATE TABLE "Subject" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "maxMarks" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create ClassSubject junction table
CREATE TABLE "ClassSubject" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
    FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE,
    
    UNIQUE ("classId", "subjectId")
);

-- Create Student table
CREATE TABLE "Student" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "roll" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "dateOfBirth" TIMESTAMP WITH TIME ZONE,
    "gender" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "classId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
    
    UNIQUE ("roll", "classId")
);

-- Create Result table
CREATE TABLE "Result" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "examType" TEXT NOT NULL,
    "examDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE,
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
    
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

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON "Admin" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_updated_at BEFORE UPDATE ON "Class" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subject_updated_at BEFORE UPDATE ON "Subject" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON "Student" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_result_updated_at BEFORE UPDATE ON "Result" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate marks against maxMarks
CREATE OR REPLACE FUNCTION validate_marks()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.marks > (SELECT "maxMarks" FROM "Subject" WHERE "id" = NEW.subjectId) THEN
        RAISE EXCEPTION 'Marks cannot exceed maximum marks for the subject';
    END IF;
    IF NEW.marks < 0 THEN
        RAISE EXCEPTION 'Marks cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for marks validation
CREATE TRIGGER validate_result_marks BEFORE INSERT OR UPDATE ON "Result" FOR EACH ROW EXECUTE FUNCTION validate_marks();

-- Create function to calculate GPA (optional - can be used for data integrity)
CREATE OR REPLACE FUNCTION calculate_gpa(marks FLOAT, max_marks INTEGER)
RETURNS FLOAT AS $$
DECLARE
    gpa FLOAT;
BEGIN
    IF max_marks = 100 THEN
        -- 100-mark subjects GPA calculation
        IF marks >= 80 THEN
            gpa := 5.0;
        ELSIF marks >= 70 THEN
            gpa := 4.0;
        ELSIF marks >= 60 THEN
            gpa := 3.5;
        ELSIF marks >= 50 THEN
            gpa := 3.0;
        ELSIF marks >= 40 THEN
            gpa := 2.0;
        ELSIF marks >= 33 THEN
            gpa := 1.0;
        ELSE
            gpa := 0.0;
        END IF;
    ELSIF max_marks = 50 THEN
        -- 50-mark subjects GPA calculation
        IF marks >= 40 THEN
            gpa := 5.0;
        ELSIF marks >= 35 THEN
            gpa := 4.0;
        ELSIF marks >= 30 THEN
            gpa := 3.5;
        ELSIF marks >= 25 THEN
            gpa := 3.0;
        ELSIF marks >= 20 THEN
            gpa := 2.0;
        ELSIF marks >= 17 THEN
            gpa := 1.0;
        ELSE
            gpa := 0.0;
        END IF;
    ELSE
        gpa := 0.0;
    END IF;
    
    RETURN gpa;
END;
$$ language 'plpgsql';

-- Create function to calculate grade (optional - can be used for data integrity)
CREATE OR REPLACE FUNCTION calculate_grade(marks FLOAT, max_marks INTEGER)
RETURNS TEXT AS $$
DECLARE
    grade TEXT;
BEGIN
    IF max_marks = 100 THEN
        -- 100-mark subjects Grade calculation
        IF marks >= 80 THEN
            grade := 'A+';
        ELSIF marks >= 70 THEN
            grade := 'A';
        ELSIF marks >= 60 THEN
            grade := 'A-';
        ELSIF marks >= 50 THEN
            grade := 'B';
        ELSIF marks >= 40 THEN
            grade := 'C';
        ELSIF marks >= 33 THEN
            grade := 'D';
        ELSE
            grade := 'F';
        END IF;
    ELSIF max_marks = 50 THEN
        -- 50-mark subjects Grade calculation
        IF marks >= 40 THEN
            grade := 'A+';
        ELSIF marks >= 35 THEN
            grade := 'A';
        ELSIF marks >= 30 THEN
            grade := 'A-';
        ELSIF marks >= 25 THEN
            grade := 'B';
        ELSIF marks >= 20 THEN
            grade := 'C';
        ELSIF marks >= 17 THEN
            grade := 'D';
        ELSE
            grade := 'F';
        END IF;
    ELSE
        grade := 'F';
    END IF;
    
    RETURN grade;
END;
$$ language 'plpgsql';

-- Add comments for documentation
COMMENT ON TABLE "Admin" IS 'Administrator users for the system';
COMMENT ON TABLE "Class" IS 'Student classes/grades';
COMMENT ON TABLE "Subject" IS 'Subjects with support for 100-mark and 50-mark systems';
COMMENT ON TABLE "ClassSubject" IS 'Junction table linking classes and subjects';
COMMENT ON TABLE "Student" IS 'Student information and enrollment';
COMMENT ON TABLE "Result" IS 'Student exam results with GPA calculation';

COMMENT ON COLUMN "Subject"."maxMarks" IS 'Maximum marks for the subject (100 or 50)';
COMMENT ON COLUMN "Result"."examType" IS 'Type of exam (Final, Midterm, Test, etc.)';
COMMENT ON COLUMN "Result"."gpa" IS 'Grade Point Average based on subject type';
COMMENT ON COLUMN "Result"."grade" IS 'Letter grade based on marks and subject type';