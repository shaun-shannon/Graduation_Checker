## Computer Science Student Graduation Checker

Disclaimer: This project may continue to evolve as we refine and add new features.

The Computer Science Student Graduation Checker is a web-based tool tailored for computer science students to monitor their academic journey toward graduation. It provides a personalized degree audit, helping students keep track of completed, in-progress, and pending course requirements to ensure they’re on the path to graduation.

## Features:

**User Registration & Authentication**
- Register with personal information, including name, email, and enrollment details.
- Secure login to access individual student accounts.

**Profile Management**
- Update personal details such as name, email, enrollment year, and expected graduation year.
  
**Course Management**
- **View Courses:** See a list of available courses with details like name, code, credits, and prerequisites.
- **Add Courses:** Log courses as completed, in-progress, or planned.
- Update Course Status: Modify course status and enter grades for accurate academic tracking.
  
## Degree Requirements Tracking

- **Requirements Display:** View all courses required for the computer science degree.

- **Completion Status:** Track which required courses are completed or still pending.

## Progress Monitoring

- **Credit Tracking:** Calculate total completed and remaining credits.
- **Completion Percentage:** View overall degree progress based on credits completed versus required.
- **Dynamic Updates:** Degree progress automatically updates as students manage course statuses.

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
