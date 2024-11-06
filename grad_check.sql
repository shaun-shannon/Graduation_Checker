-- Active: 1730687188808@@127.0.0.1@3306@cs_student_graduation_checker

-- Creates Database
DROP DATABASE IF EXISTS CS_Student_Graduation_Checker;
CREATE DATABASE CS_Student_Graduation_Checker;
USE CS_Student_Graduation_Checker;

-- Creates table for student information
CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    enrollment_year INT,
    graduation_year INT
);

-- Creates table for course information
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    category VARCHAR(50)
);

-- Creates table for information about each student's courses with separate foreign key constraints
CREATE TABLE StudentCourses (
    student_course_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned')),
    grade VARCHAR(2),
    semester VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Creates table for classes required toward completing degree
CREATE TABLE DegreeRequirements (
    requirement_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    requirement_type VARCHAR(50),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Creates table to keep track of student's progress toward graduation
CREATE TABLE Progress (
    student_id INT PRIMARY KEY,
    total_credits_completed INT DEFAULT 0,
    total_percentage_completed DECIMAL(5, 2) DEFAULT 0.00,
    core_credits_remaining INT DEFAULT 0,
    science_credits_remaining INT DEFAULT 0,
    math_credits_remaining INT DEFAULT 0,
    general_ed_credits_remaining INT DEFAULT 0,
    free_elective_credits_remaining INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

INSERT INTO Courses (course_code, course_name, credits, category) VALUES
-- Core Computer Science Courses
('CS 111', 'Program Design I', 3, 'Core'),
('CS 141', 'Program Design II', 3, 'Core'),
('CS 151', 'Mathematical Foundations of Computing', 3, 'Core'),
('CS 211', 'Programming Practicum', 3, 'Core'),
('CS 251', 'Data Structures', 4, 'Core'),
('CS 261', 'Machine Organization', 3, 'Core'),
('CS 301', 'Languages and Automata', 3, 'Core'),
('CS 341', 'Programming Language Design and Implementation', 3, 'Core'),
('CS 342', 'Software Design', 3, 'Core'),
('CS 361', 'Systems Programming', 3, 'Core'),
('CS 362', 'Computer Design', 3, 'Core'),
('CS 377', 'Ethical Issues in Computing', 3, 'Core'),
('CS 401', 'Computer Algorithms I', 3, 'Core'),
('CS 499', 'Professional Development Seminar', 0, 'Core'),
-- Required Mathematics Courses
('MATH 180', 'Calculus I', 4, 'Core Math'),
('MATH 181', 'Calculus II', 4, 'Core Math'),
('MATH 210', 'Calculus III', 3, 'Core Math');
