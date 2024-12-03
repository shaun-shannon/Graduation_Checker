## How to Run ##
1. run all queries in grad_check.sql
   
2. make sure .env file contains the correct information

   PORT=3000
   
   DB_HOST=localhost
   
   DB_USER="MySQL username"
   
   DB_PASS="MySQL password"
   
   DB_NAME=CS_Student_Graduation_Checker
   
   JWT_SECRET=12345
   
4. open new terminal, then input:
   
   - cd backend
   
   - npm install
   
   - npm start



## Computer Science Student Graduation Checker

Disclaimer: This is a collaborative project where I primarily worked on the SQL backend. This project may continue to evolve as we refine and add new features.

The Computer Science Student Graduation Checker is a web-based tool tailored for computer science students to monitor their academic journey toward graduation. It provides a personalized degree audit, helping students keep track of completed, in-progress, and pending course requirements to ensure they’re on the path to graduation.

## Features:

**User Registration & Authentication**
- Register with personal information, including name, email, and enrollment details.
- Secure login to access individual student accounts.
- Passwords are encrypted for security.

**User Information**
- Students can enter personal information, including their name, and email.
  
**Course Management**
- **View Courses:** See a list of available courses with details like name, code, credits, and prerequisites.
- **Add Courses:** Log courses as completed, in-progress, or planned.
- **Update Course Status:** Modify course status and enter grades for accurate academic tracking.
- **Delete Courses & Semester:** If a course or a semester is not to the students liking, they can delete specific courses or even delete entire semesters.

## Progress Monitoring
- **Credit Tracking:** Calculate total completed and remaining credits.
- **Completion Percentage:** View overall degree progress based on credits completed versus required.
- **Dynamic Updates:** Degree progress automatically updates as students manage course statuses.

## Search and Filtering
- Users can search for and add courses using the search functionality.
- Can also filter out courses depending on categories like: Core, Technical Electives etc.

## Saving Progress
- Users can ensure that the progress they made within the application is saved once they log out and log back in.
- Data entered and saved prior to logging out can be edited.
- Classes can be added to tables that have been saved in prior sessions.

## Data Requirements

**Students Table**

**Fields:** student_id, name, email, password, enrollment_year, graduation_year
Courses Table

**Fields:** course_id, course_code, course_name, credits, category
Student Courses Table

**Fields:** student_course_id, student_id, course_id, status, grade, semester
Degree Requirements Table

**Fields:** requirement_id, course_id, requirement_type
Progress Table

**Fields:** student_id, total_credits_completed, percentage_completed, core_credits_remaining, science_credits_remaining, math_credits_remaining, general_education_credits_remaining, free_elective_credits_remaining
