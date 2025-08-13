# Database Schema Documentation

## Overview

This document describes the database schema for the Student Management System, which supports both 100-mark and 50-mark subjects with automatic GPA calculation.

## Database Schema Files

### 1. `database-schema-postgresql.sql`
- **Purpose**: PostgreSQL database schema
- **Features**: Full PostgreSQL implementation with triggers, functions, and advanced constraints
- **Use**: For production deployment with PostgreSQL

### 2. `database-schema-sqlite.sql`
- **Purpose**: SQLite database schema
- **Features**: SQLite-compatible schema with views and triggers
- **Use**: For development and local testing

### 3. `sample-data-insertion.sql`
- **Purpose**: Sample data for testing and demonstration
- **Features**: Complete sample dataset with students, subjects, classes, and results
- **Use**: For populating the database with test data

## Schema Overview

### Tables

#### 1. Admin
- **Purpose**: Administrator user management
- **Key Features**: User authentication with bcrypt password hashing
- **Fields**: id, username, password, createdAt, updatedAt

#### 2. Class
- **Purpose**: Student class/grade management
- **Key Features**: Unique class names, descriptions
- **Fields**: id, name, description, createdAt, updatedAt

#### 3. Subject
- **Purpose**: Subject management with dual scoring system
- **Key Features**: Supports both 100-mark and 50-mark subjects
- **Fields**: id, name, code, description, maxMarks, createdAt, updatedAt

#### 4. ClassSubject
- **Purpose**: Many-to-many relationship between classes and subjects
- **Key Features**: Assigns subjects to classes
- **Fields**: id, classId, subjectId, createdAt

#### 5. Student
- **Purpose**: Student information management
- **Key Features**: Student enrollment, personal information
- **Fields**: id, roll, name, fatherName, motherName, dateOfBirth, gender, address, phone, classId, createdAt, updatedAt

#### 6. Result
- **Purpose**: Student exam results with GPA calculation
- **Key Features**: Automatic GPA calculation based on subject type, multiple exam types
- **Fields**: id, studentId, subjectId, classId, marks, grade, gpa, examType, examDate, createdAt, updatedAt

## Key Features

### 1. Dual Scoring System
- **100-mark subjects**: Traditional scoring (Bangla, English, Mathematics)
- **50-mark subjects**: Reduced scoring (Science, Social Science, Religious Studies)
- **Automatic GPA calculation**: Different GPA scales for each subject type

### 2. GPA Calculation Standards

#### 100-mark Subjects
| Marks Range | Grade | GPA |
|-------------|-------|-----|
| 80-100      | A+    | 5.0 |
| 70-79       | A     | 4.0 |
| 60-69       | A-    | 3.5 |
| 50-59       | B     | 3.0 |
| 40-49       | C     | 2.0 |
| 33-39       | D     | 1.0 |
| 0-32        | F     | 0.0 |

#### 50-mark Subjects
| Marks Range | Grade | GPA |
|-------------|-------|-----|
| 40-50       | A+    | 5.0 |
| 35-39       | A     | 4.0 |
| 30-34       | A-    | 3.5 |
| 25-29       | B     | 3.0 |
| 20-24       | C     | 2.0 |
| 17-19       | D     | 1.0 |
| 0-16        | F     | 0.0 |

### 3. Database Constraints
- **Foreign Key Relationships**: All relationships properly constrained
- **Unique Constraints**: Prevent duplicate data
- **Data Validation**: Marks cannot exceed maxMarks or be negative
- **Cascade Deletes**: Automatic cleanup of related records

### 4. Advanced Features (PostgreSQL)
- **Triggers**: Automatic timestamp updates
- **Functions**: GPA and grade calculation functions
- **Indexes**: Optimized for performance
- **Views**: Pre-defined queries for common reporting

## Sample Data

The sample data includes:

### Classes
- Class 6 (Sixth Grade)
- Class 7 (Seventh Grade)
- Class 8 (Eighth Grade)

### Subjects
- **100-mark**: Bangla, English, Mathematics
- **50-mark**: Science, Social Science, Religious Studies

### Students
- 9 sample students across 3 classes
- Complete personal information
- Realistic roll numbers and details

### Results
- Final exam results for all students
- Midterm results for some students
- Test results for demonstration
- Proper GPA calculation for both subject types

### Admin Users
- Username: `admin`, Password: `admin123`
- Username: `superadmin`, Password: `superadmin`

## Installation Instructions

### For PostgreSQL

1. **Create Database**
```sql
CREATE DATABASE sms_db;
```

2. **Run Schema**
```bash
psql -d sms_db -f database-schema-postgresql.sql
```

3. **Insert Sample Data (Optional)**
```bash
psql -d sms_db -f sample-data-insertion.sql
```

### For SQLite

1. **Create Database**
```bash
sqlite3 sms.db
```

2. **Run Schema**
```sql
.read database-schema-sqlite.sql
```

3. **Insert Sample Data (Optional)**
```sql
.read sample-data-insertion.sql
```

## Common Queries

### View All Students with Classes
```sql
SELECT s."roll", s."name", c."name" as "class_name" 
FROM "Student" s 
JOIN "Class" c ON s."classId" = c."id" 
ORDER BY c."name", s."roll";
```

### View Student Results
```sql
SELECT s."roll", s."name", sub."name" as "subject", r."marks", r."grade", r."gpa", r."examType"
FROM "Result" r
JOIN "Student" s ON r."studentId" = s."id"
JOIN "Subject" sub ON r."subjectId" = sub."id"
ORDER BY s."name", sub."name";
```

### Class Performance Summary
```sql
SELECT c."name" as "class", COUNT(DISTINCT s."id") as "students", 
       AVG(r."gpa") as "avg_gpa", AVG(r."marks") as "avg_marks"
FROM "Class" c
LEFT JOIN "Student" s ON c."id" = s."classId"
LEFT JOIN "Result" r ON s."id" = r."studentId"
GROUP BY c."name";
```

### Subject Performance by Type
```sql
SELECT sub."maxMarks", COUNT(r."id") as "total_results", 
       AVG(r."gpa") as "avg_gpa", AVG(r."marks") as "avg_marks"
FROM "Subject" sub
LEFT JOIN "Result" r ON sub."id" = r."subjectId"
GROUP BY sub."maxMarks";
```

## Database Design Considerations

### 1. Normalization
- Third normal form achieved
- Proper separation of concerns
- Minimal data redundancy

### 2. Performance
- Indexed columns for common queries
- Optimized joins and relationships
- Efficient data types

### 3. Scalability
- Supports multiple classes and subjects
- Handles various exam types
- Extensible for additional features

### 4. Data Integrity
- Foreign key constraints
- Unique constraints
- Validation triggers

## Migration Notes

### From SQLite to PostgreSQL
1. Data types need adjustment (TEXT vs VARCHAR, etc.)
2. Auto-increment behavior differs
3. Function syntax varies
4. Trigger implementation differs

### Schema Changes
1. Always backup before migration
2. Test in development environment
3. Update application code accordingly
4. Verify data integrity

## Troubleshooting

### Common Issues

1. **Foreign Key Errors**
   - Ensure parent records exist before creating child records
   - Check correct ID references

2. **Constraint Violations**
   - Verify unique constraints
   - Check data validation rules

3. **GPA Calculation Issues**
   - Ensure maxMarks is correctly set
   - Verify marks are within valid range

### Performance Optimization

1. **Index Usage**
   - Create indexes on frequently queried columns
   - Monitor query performance

2. **Query Optimization**
   - Use EXPLAIN ANALYZE for complex queries
   - Optimize join operations

3. **Database Maintenance**
   - Regular vacuum and analyze (PostgreSQL)
   - Index rebuilding when necessary

## Security Considerations

1. **Password Storage**
   - Always use bcrypt for password hashing
   - Never store plain text passwords

2. **Access Control**
   - Implement proper user roles
   - Use database-level permissions

3. **Data Protection**
   - Encrypt sensitive data
   - Use SSL for database connections

## Support

For questions or issues related to the database schema:
1. Check the application documentation
2. Review the sample data
3. Test with provided queries
4. Contact development team if needed