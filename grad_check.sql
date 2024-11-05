-- Active: 1730687188808@@127.0.0.1@3306@cs_student_graduation_checker

-- Creates Database
DROP DATABASE IF EXISTS CS_Student_Graduation_Checker;
CREATE DATABASE CS_Student_Graduation_Checker;
USE CS_Student_Graduation_Checker;

-- Creates table for student information
CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Student's name
    email VARCHAR(100) UNIQUE NOT NULL, -- Student's email
    password VARCHAR(255), -- Student's password for user authentication
    enrollment_year INT, -- Student's year enrolled
    graduation_year INT -- Student's graduation year
);

-- Creates table for course information
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(10) UNIQUE NOT NULL,  -- Ex: "CS 480"
    course_name VARCHAR(100) NOT NULL,         -- Ex: "Database Systems"
    credits INT NOT NULL,                      -- Ex: 3
    category VARCHAR(50)                       -- Ex: "Technical Elective"
);

-- Creates table for the information with each student's courses
CREATE TABLE StudentCourses (
    student_course_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT REFERENCES Students(student_id),
    course_id INT REFERENCES Courses(course_id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned')),
    grade VARCHAR(2),  -- Optional, for completed courses
    semester VARCHAR(20)  -- Ex: "Fall 2024"
);

-- Creates table for classes required toward completing degree
CREATE TABLE DegreeRequirements (
    requirement_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES Courses(course_id),   -- Links to any course in the Courses table
    requirement_type VARCHAR(50) -- Ex: "Science Elective", "Free Elective", "Math Elective", etc
);

-- Creates table to keep track of student's progress with graduating
CREATE TABLE Progress (
    student_id INT PRIMARY KEY REFERENCES Students(student_id),
    total_credits_completed INT DEFAULT 0, -- credits completed
    total_percentage_completed DECIMAL(5, 2) DEFAULT 0.00, -- pecentage of credits completed
    
    core_credits_remaining INT DEFAULT 0, -- credits remaining for core classes
    science_credits_remaining INT DEFAULT 0, -- credits remaining for science classes
    math_credits_remaining INT DEFAULT 0, -- credits remaining for math classes
    general_ed_credits_remaining INT DEFAULT 0, -- credits remaining for gen ed classes
    free_elective_credits_remaining INT DEFAULT 0 -- credits remaining for free electives
);