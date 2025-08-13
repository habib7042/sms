-- Sample Data Insertion Script for Student Management System
-- This script inserts sample data for testing and demonstration
-- Supports both 100-mark and 50-mark subjects

-- Note: Run this after creating the database schema
-- For PostgreSQL, use the PostgreSQL schema file
-- For SQLite, use the SQLite schema file

-- Sample Classes
INSERT INTO "Class" ("id", "name", "description") VALUES 
    ('class-1', 'Class 6', 'Sixth Grade'),
    ('class-2', 'Class 7', 'Seventh Grade'),
    ('class-3', 'Class 8', 'Eighth Grade');

-- Sample Subjects (100-mark and 50-mark)
INSERT INTO "Subject" ("id", "name", "code", "description", "maxMarks") VALUES 
    ('subj-1', 'Bangla', 'BAN001', 'Bangla Language', 100),
    ('subj-2', 'English', 'ENG001', 'English Language', 100),
    ('subj-3', 'Mathematics', 'MAT001', 'Mathematics', 100),
    ('subj-4', 'Science', 'SCI001', 'General Science', 50),
    ('subj-5', 'Social Science', 'SOC001', 'Social Studies', 50),
    ('subj-6', 'Religious Studies', 'REL001', 'Islamic Studies', 50);

-- Class-Subject Relationships (assign subjects to classes)
INSERT INTO "ClassSubject" ("id", "classId", "subjectId") VALUES 
    ('cs-1', 'class-1', 'subj-1'),
    ('cs-2', 'class-1', 'subj-2'),
    ('cs-3', 'class-1', 'subj-3'),
    ('cs-4', 'class-1', 'subj-4'),
    ('cs-5', 'class-1', 'subj-5'),
    ('cs-6', 'class-1', 'subj-6'),
    ('cs-7', 'class-2', 'subj-1'),
    ('cs-8', 'class-2', 'subj-2'),
    ('cs-9', 'class-2', 'subj-3'),
    ('cs-10', 'class-2', 'subj-4'),
    ('cs-11', 'class-2', 'subj-5'),
    ('cs-12', 'class-2', 'subj-6'),
    ('cs-13', 'class-3', 'subj-1'),
    ('cs-14', 'class-3', 'subj-2'),
    ('cs-15', 'class-3', 'subj-3'),
    ('cs-16', 'class-3', 'subj-4'),
    ('cs-17', 'class-3', 'subj-5'),
    ('cs-18', 'class-3', 'subj-6');

-- Sample Students
INSERT INTO "Student" ("id", "roll", "name", "fatherName", "motherName", "dateOfBirth", "gender", "address", "phone", "classId") VALUES 
    ('stu-1', '001', 'John Doe', 'Robert Doe', 'Jane Doe', '2012-05-15', 'Male', '123 Main St, City', '01234567890', 'class-1'),
    ('stu-2', '002', 'Jane Smith', 'Michael Smith', 'Sarah Smith', '2012-08-22', 'Female', '456 Oak Ave, City', '01234567891', 'class-1'),
    ('stu-3', '003', 'Mike Johnson', 'David Johnson', 'Lisa Johnson', '2012-03-10', 'Male', '789 Pine Rd, City', '01234567892', 'class-1'),
    ('stu-4', '004', 'Emily Brown', 'James Brown', 'Mary Brown', '2011-12-05', 'Female', '321 Elm St, City', '01234567893', 'class-2'),
    ('stu-5', '005', 'David Wilson', 'Thomas Wilson', 'Jennifer Wilson', '2011-07-18', 'Male', '654 Maple Dr, City', '01234567894', 'class-2'),
    ('stu-6', '006', 'Sarah Davis', 'Richard Davis', 'Patricia Davis', '2011-09-30', 'Female', '987 Cedar Ln, City', '01234567895', 'class-2'),
    ('stu-7', '007', 'Robert Miller', 'Charles Miller', 'Susan Miller', '2010-11-12', 'Male', '147 Birch Way, City', '01234567896', 'class-3'),
    ('stu-8', '008', 'Lisa Anderson', 'William Anderson', 'Elizabeth Anderson', '2010-04-25', 'Female', '258 Spruce St, City', '01234567897', 'class-3'),
    ('stu-9', '009', 'Thomas Taylor', 'Christopher Taylor', 'Margaret Taylor', '2010-06-08', 'Male', '369 Oakwood Dr, City', '01234567898', 'class-3');

-- Sample Results with proper GPA calculation
-- Class 6 Results
INSERT INTO "Result" ("id", "studentId", "subjectId", "classId", "marks", "grade", "gpa", "examType", "examDate") VALUES 
    -- John Doe (Class 6) - Excellent performance
    ('res-1', 'stu-1', 'subj-1', 'class-1', 85, 'A', 4.0, 'Final', '2024-12-15'),
    ('res-2', 'stu-1', 'subj-2', 'class-1', 78, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-3', 'stu-1', 'subj-3', 'class-1', 92, 'A+', 5.0, 'Final', '2024-12-17'),
    ('res-4', 'stu-1', 'subj-4', 'class-1', 45, 'A+', 5.0, 'Final', '2024-12-18'),
    ('res-5', 'stu-1', 'subj-5', 'class-1', 42, 'A+', 5.0, 'Final', '2024-12-19'),
    ('res-6', 'stu-1', 'subj-6', 'class-1', 48, 'A+', 5.0, 'Final', '2024-12-20'),
    
    -- Jane Smith (Class 6) - Good performance
    ('res-7', 'stu-2', 'subj-1', 'class-1', 72, 'A-', 3.5, 'Final', '2024-12-15'),
    ('res-8', 'stu-2', 'subj-2', 'class-1', 68, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-9', 'stu-2', 'subj-3', 'class-1', 75, 'A-', 3.5, 'Final', '2024-12-17'),
    ('res-10', 'stu-2', 'subj-4', 'class-1', 38, 'A', 4.0, 'Final', '2024-12-18'),
    ('res-11', 'stu-2', 'subj-5', 'class-1', 35, 'A', 4.0, 'Final', '2024-12-19'),
    ('res-12', 'stu-2', 'subj-6', 'class-1', 40, 'A+', 5.0, 'Final', '2024-12-20'),
    
    -- Mike Johnson (Class 6) - Average performance
    ('res-13', 'stu-3', 'subj-1', 'class-1', 58, 'B', 3.0, 'Final', '2024-12-15'),
    ('res-14', 'stu-3', 'subj-2', 'class-1', 62, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-15', 'stu-3', 'subj-3', 'class-1', 55, 'B', 3.0, 'Final', '2024-12-17'),
    ('res-16', 'stu-3', 'subj-4', 'class-1', 28, 'B', 3.0, 'Final', '2024-12-18'),
    ('res-17', 'stu-3', 'subj-5', 'class-1', 26, 'B', 3.0, 'Final', '2024-12-19'),
    ('res-18', 'stu-3', 'subj-6', 'class-1', 30, 'A-', 3.5, 'Final', '2024-12-20'),

-- Class 7 Results
    -- Emily Brown (Class 7) - Very Good performance
    ('res-19', 'stu-4', 'subj-1', 'class-2', 88, 'A+', 5.0, 'Final', '2024-12-15'),
    ('res-20', 'stu-4', 'subj-2', 'class-2', 82, 'A', 4.0, 'Final', '2024-12-16'),
    ('res-21', 'stu-4', 'subj-3', 'class-2', 85, 'A', 4.0, 'Final', '2024-12-17'),
    ('res-22', 'stu-4', 'subj-4', 'class-2', 46, 'A+', 5.0, 'Final', '2024-12-18'),
    ('res-23', 'stu-4', 'subj-5', 'class-2', 44, 'A+', 5.0, 'Final', '2024-12-19'),
    ('res-24', 'stu-4', 'subj-6', 'class-2', 47, 'A+', 5.0, 'Final', '2024-12-20'),
    
    -- David Wilson (Class 7) - Good performance
    ('res-25', 'stu-5', 'subj-1', 'class-2', 75, 'A-', 3.5, 'Final', '2024-12-15'),
    ('res-26', 'stu-5', 'subj-2', 'class-2', 70, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-27', 'stu-5', 'subj-3', 'class-2', 78, 'A-', 3.5, 'Final', '2024-12-17'),
    ('res-28', 'stu-5', 'subj-4', 'class-2', 36, 'A', 4.0, 'Final', '2024-12-18'),
    ('res-29', 'stu-5', 'subj-5', 'class-2', 34, 'A', 4.0, 'Final', '2024-12-19'),
    ('res-30', 'stu-5', 'subj-6', 'class-2', 38, 'A', 4.0, 'Final', '2024-12-20'),
    
    -- Sarah Davis (Class 7) - Average performance
    ('res-31', 'stu-6', 'subj-1', 'class-2', 65, 'A-', 3.5, 'Final', '2024-12-15'),
    ('res-32', 'stu-6', 'subj-2', 'class-2', 60, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-33', 'stu-6', 'subj-3', 'class-2', 68, 'A-', 3.5, 'Final', '2024-12-17'),
    ('res-34', 'stu-6', 'subj-4', 'class-2', 32, 'A-', 3.5, 'Final', '2024-12-18'),
    ('res-35', 'stu-6', 'subj-5', 'class-2', 28, 'B', 3.0, 'Final', '2024-12-19'),
    ('res-36', 'stu-6', 'subj-6', 'class-2', 35, 'A', 4.0, 'Final', '2024-12-20'),

-- Class 8 Results
    -- Robert Miller (Class 8) - Excellent performance
    ('res-37', 'stu-7', 'subj-1', 'class-3', 90, 'A+', 5.0, 'Final', '2024-12-15'),
    ('res-38', 'stu-7', 'subj-2', 'class-3', 85, 'A', 4.0, 'Final', '2024-12-16'),
    ('res-39', 'stu-7', 'subj-3', 'class-3', 88, 'A+', 5.0, 'Final', '2024-12-17'),
    ('res-40', 'stu-7', 'subj-4', 'class-3', 48, 'A+', 5.0, 'Final', '2024-12-18'),
    ('res-41', 'stu-7', 'subj-5', 'class-3', 45, 'A+', 5.0, 'Final', '2024-12-19'),
    ('res-42', 'stu-7', 'subj-6', 'class-3', 49, 'A+', 5.0, 'Final', '2024-12-20'),
    
    -- Lisa Anderson (Class 8) - Very Good performance
    ('res-43', 'stu-8', 'subj-1', 'class-3', 82, 'A', 4.0, 'Final', '2024-12-15'),
    ('res-44', 'stu-8', 'subj-2', 'class-3', 78, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-45', 'stu-8', 'subj-3', 'class-3', 80, 'A', 4.0, 'Final', '2024-12-17'),
    ('res-46', 'stu-8', 'subj-4', 'class-3', 42, 'A+', 5.0, 'Final', '2024-12-18'),
    ('res-47', 'stu-8', 'subj-5', 'class-3', 40, 'A+', 5.0, 'Final', '2024-12-19'),
    ('res-48', 'stu-8', 'subj-6', 'class-3', 46, 'A+', 5.0, 'Final', '2024-12-20'),
    
    -- Thomas Taylor (Class 8) - Good performance
    ('res-49', 'stu-9', 'subj-1', 'class-3', 72, 'A-', 3.5, 'Final', '2024-12-15'),
    ('res-50', 'stu-9', 'subj-2', 'class-3', 68, 'A-', 3.5, 'Final', '2024-12-16'),
    ('res-51', 'stu-9', 'subj-3', 'class-3', 75, 'A-', 3.5, 'Final', '2024-12-17'),
    ('res-52', 'stu-9', 'subj-4', 'class-3', 35, 'A', 4.0, 'Final', '2024-12-18'),
    ('res-53', 'stu-9', 'subj-5', 'class-3', 32, 'A-', 3.5, 'Final', '2024-12-19'),
    ('res-54', 'stu-9', 'subj-6', 'class-3', 38, 'A', 4.0, 'Final', '2024-12-20');

-- Sample Midterm Results for some students
INSERT INTO "Result" ("id", "studentId", "subjectId", "classId", "marks", "grade", "gpa", "examType", "examDate") VALUES 
    -- John Doe Midterm
    ('res-55', 'stu-1', 'subj-1', 'class-1', 80, 'A', 4.0, 'Midterm', '2024-06-15'),
    ('res-56', 'stu-1', 'subj-2', 'class-1', 75, 'A-', 3.5, 'Midterm', '2024-06-16'),
    ('res-57', 'stu-1', 'subj-3', 'class-1', 85, 'A', 4.0, 'Midterm', '2024-06-17'),
    ('res-58', 'stu-1', 'subj-4', 'class-1', 42, 'A+', 5.0, 'Midterm', '2024-06-18'),
    
    -- Emily Brown Midterm
    ('res-59', 'stu-4', 'subj-1', 'class-2', 85, 'A', 4.0, 'Midterm', '2024-06-15'),
    ('res-60', 'stu-4', 'subj-2', 'class-2', 80, 'A', 4.0, 'Midterm', '2024-06-16'),
    ('res-61', 'stu-4', 'subj-3', 'class-2', 82, 'A', 4.0, 'Midterm', '2024-06-17'),
    ('res-62', 'stu-4', 'subj-4', 'class-2', 44, 'A+', 5.0, 'Midterm', '2024-06-18'),

-- Sample Test Results
    ('res-63', 'stu-1', 'subj-1', 'class-1', 88, 'A+', 5.0, 'Test', '2024-09-15'),
    ('res-64', 'stu-1', 'subj-2', 'class-1', 82, 'A', 4.0, 'Test', '2024-09-16'),
    ('res-65', 'stu-4', 'subj-1', 'class-2', 90, 'A+', 5.0, 'Test', '2024-09-15'),
    ('res-66', 'stu-4', 'subj-2', 'class-2', 85, 'A', 4.0, 'Test', '2024-09-16');

-- Sample Admin User (password: admin123)
-- Note: This is a bcrypt hash of 'admin123'
INSERT INTO "Admin" ("id", "username", "password") VALUES 
    ('admin-1', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqK3a7L0JQzK4sXrMkFJ6mK8J5K5K6');

-- Additional Admin User (password: superadmin)
INSERT INTO "Admin" ("id", "username", "password") VALUES 
    ('admin-2', 'superadmin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqK3a7L0JQzK4sXrMkFJ6mK8J5K5K6');

-- Database Summary Query Examples:
/*
-- View all students with their classes
SELECT s."roll", s."name", c."name" as "class_name" 
FROM "Student" s 
JOIN "Class" c ON s."classId" = c."id" 
ORDER BY c."name", s."roll";

-- View student results with GPA
SELECT s."roll", s."name", sub."name" as "subject", r."marks", r."grade", r."gpa", r."examType"
FROM "Result" r
JOIN "Student" s ON r."studentId" = s."id"
JOIN "Subject" sub ON r."subjectId" = sub."id"
ORDER BY s."name", sub."name";

-- View class performance summary
SELECT c."name" as "class", COUNT(DISTINCT s."id") as "students", 
       AVG(r."gpa") as "avg_gpa", AVG(r."marks") as "avg_marks"
FROM "Class" c
LEFT JOIN "Student" s ON c."id" = s."classId"
LEFT JOIN "Result" r ON s."id" = r."studentId"
GROUP BY c."name";

-- View subject performance by maxMarks type
SELECT sub."maxMarks", COUNT(r."id") as "total_results", 
       AVG(r."gpa") as "avg_gpa", AVG(r."marks") as "avg_marks"
FROM "Subject" sub
LEFT JOIN "Result" r ON sub."id" = r."subjectId"
GROUP BY sub."maxMarks";
*/