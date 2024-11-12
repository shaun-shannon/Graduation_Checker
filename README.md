Computer Science Student Graduation Checker
Project Overview
The Computer Science Student Graduation Checker is a web-based application designed to help computer science students track their academic progress toward graduation. This application provides a personalized degree audit, displaying completed courses, currently enrolled courses, and remaining requirements for the degree. The backend uses SQL for database management and Node.js for server-side logic.

Core Functionalities
User Registration & Authentication
Register: Students can register with their name, email, and enrollment information.
Login: Secure login functionality to access individual student accounts.
Profile Management
Personal Information: Students can enter and update their name, email, enrollment year, and expected graduation year.
Course Management
View Courses: Students can view available courses, including course name, code, credits, and prerequisites.
Add Courses: Allows students to add courses they are taking, have completed, or plan to take.
Update Course Status: Students can set course status as “completed,” “in-progress,” or “planned.”
Track Grades: Enter grades for completed courses to maintain accurate records.
Degree Requirements Tracking
Display Requirements: Show the list of required courses for the degree program.
Completion Status: Indicate which required courses have been completed and which are pending.
Progress Monitoring
Credit Tracking: Calculate completed credits and remaining credits.
Completion Percentage: Display degree completion percentage based on completed vs. required credits.
Dynamic Updates: Progress updates automatically as students add, complete, or update courses.
Data Requirements
Students
Fields: student_id, name, email, password, enrollment_year, graduation_year
Courses
Fields: course_id, course_code, course_name, credits, category
Student Courses
Fields: student_course_id, student_id, course_id, status, grade, semester
Degree Requirements
Fields: requirement_id, course_id, requirement_type
Progress
Fields: student_id, total_credits_completed, percentage_completed, core_credits_remaining, science_credits_remaining, math_credits_remaining, general_education_credits_remaining, free_elective_credits_remaining
