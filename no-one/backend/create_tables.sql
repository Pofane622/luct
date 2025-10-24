-- Create tables for LUCT Reporting System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'principal_lecturer', 'program_leader')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lecturers table (must be created before courses since courses references it)
CREATE TABLE IF NOT EXISTS lecturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Available',
    courses_assigned INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0.0,
    workload VARCHAR(10) DEFAULT '0%',
    availability VARCHAR(20) DEFAULT 'Full-time',
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    level VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Planning',
    assigned_lecturer_id INTEGER REFERENCES lecturers(id),
    students_enrolled INTEGER DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0.0,
    color VARCHAR(100),
    modules TEXT[],
    prerequisites TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lecturer reports table
CREATE TABLE IF NOT EXISTS lecturer_reports (
    id SERIAL PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    week_of_reporting INTEGER NOT NULL,
    date_of_lecture DATE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    lecturer_name VARCHAR(100) NOT NULL,
    students_present INTEGER NOT NULL,
    total_registered_students INTEGER NOT NULL,
    venue VARCHAR(100) NOT NULL,
    scheduled_time TIME NOT NULL,
    topic_taught TEXT NOT NULL,
    learning_outcomes TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    submitted_by INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student ratings table
CREATE TABLE IF NOT EXISTS student_ratings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    lecturer_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo data
INSERT INTO users (username, email, password, fullName, role) VALUES
('demo.student', 'demo.student@luct.ac.ls', '$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G', 'Demo Student', 'student'),
('demo.lecturer', 'demo.lecturer@luct.ac.ls', '$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G', 'Demo Lecturer', 'lecturer'),
('demo.supervisor', 'demo.supervisor@luct.ac.ls', '$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G', 'Demo Supervisor', 'principal_lecturer'),
('demo.director', 'demo.director@luct.ac.ls', '$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G', 'Demo Director', 'program_leader');

INSERT INTO lecturers (name, email, specialization, status, courses_assigned, total_students, rating, workload, availability, join_date) VALUES
('Dr. Thabo Moloi', 't.moloi@university.ac.za', 'Software Architecture', 'Active', 3, 125, 4.7, '85%', 'Full-time', '2020-03-15'),
('Ms. Lerato Nkosi', 'l.nkosi@university.ac.za', 'Database Systems', 'Active', 2, 80, 4.5, '70%', 'Full-time', '2021-08-22'),
('Prof. David Chen', 'd.chen@university.ac.za', 'Software Engineering', 'Active', 1, 42, 4.8, '45%', 'Part-time', '2019-11-30'),
('Dr. Anna Petrova', 'a.petrova@university.ac.za', 'Discrete Mathematics', 'Active', 1, 50, 4.6, '50%', 'Full-time', '2022-02-10');

INSERT INTO courses (code, name, credits, level, semester, status, assigned_lecturer_id, students_enrolled, rating, color, modules, prerequisites) VALUES
('ICT3101', 'Web Development', 15, 'Year 3', 'Semester 1', 'Active', 1, 45, 4.7, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', ARRAY['HTML', 'CSS', 'JavaScript', 'React'], ARRAY['ICT2101', 'ICT2201']),
('ICT2202', 'Database Systems', 12, 'Year 2', 'Semester 2', 'Active', 2, 38, 4.5, 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', ARRAY['SQL', 'NoSQL', 'Database Design', 'Normalization'], ARRAY['ICT1201']),
('ICT3301', 'Software Engineering', 15, 'Year 3', 'Semester 1', 'Active', 3, 42, 4.8, 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', ARRAY['SDLC', 'Agile', 'Testing', 'Project Management'], ARRAY['ICT2301', 'ICT2401']),
('MATH2101', 'Discrete Mathematics', 12, 'Year 2', 'Semester 1', 'Active', 4, 50, 4.6, 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', ARRAY['Logic', 'Sets', 'Graphs', 'Combinatorics'], ARRAY['MATH1101']);
