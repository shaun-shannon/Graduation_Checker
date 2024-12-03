const db = require('../config/db');

exports.searchCourses = async (req, res) => {
  const searchTerm = req.query.term ? req.query.term.toLowerCase() : '';

  const query = `
      SELECT course_code, course_name, credits, category 
      FROM Courses 
      ORDER BY course_code
  `;
  
  try {
      const [results] = await db.execute(query);
      
      // Only filter if searchTerm is not empty
      const filteredResults = searchTerm 
          ? results.filter(course => 
              course.course_code.toLowerCase().includes(searchTerm) ||
              course.course_name.toLowerCase().includes(searchTerm) ||
              course.category.toLowerCase().includes(searchTerm)
          )
          : results;
      
      res.json(filteredResults);
  } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
  }
};

// exports.saveSemesters = async (req, res) => {
//   const userId = req.user.id; 
//   const semestersData = req.body;
//   try {
//     for (const semester of semestersData) {
//       // Insert the semester into the Semesters table
//       const [semesterResult] = await db.execute(
//         'INSERT INTO Semesters (student_id, semester_name) VALUES (?, ?)',
//         [userId, semester.semester]
//       );
//       const semesterId = semesterResult.insertId;

//       for (const course of semester.courses) {
//         // Insert the course into the StudentCourses table
//         await db.execute(
//           'INSERT INTO StudentCourses (semester_id, course_code, course_name, credits, status) VALUES (?, ?, ?, ?, ?)',
//           [semesterId, course.courseCode, course.courseName, course.courseCredits, course.courseStatus]
//         );
//       }
//     }
//     res.status(201).json({ message: 'All semesters saved successfully' });
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// };


exports.saveSemesters = async (req, res) => {
  const userId = req.user.id;
  const semestersData = req.body;

  try {
    for (const semester of semestersData) {
      // Check if the semester already exists
      const [existingSemester] = await db.execute(
        'SELECT id FROM Semesters WHERE student_id = ? AND semester_name = ?',
        [userId, semester.semester]
      );

      let semesterId;
      if (existingSemester.length > 0) {
        // Semester already exists, use the existing semester ID
        semesterId = existingSemester[0].id;
      } else {
        // Insert the new semester into the Semesters table
        const [semesterResult] = await db.execute(
          'INSERT INTO Semesters (student_id, semester_name) VALUES (?, ?)',
          [userId, semester.semester]
        );
        semesterId = semesterResult.insertId;
      }

      for (const course of semester.courses) {
        // Check if the course already exists in the semester
        const [existingCourse] = await db.execute(
          'SELECT id FROM StudentCourses WHERE semester_id = ? AND course_code = ?',
          [semesterId, course.courseCode]
        );

        if (existingCourse.length === 0) {
          // Insert the course into the StudentCourses table
          await db.execute(
            'INSERT INTO StudentCourses (semester_id, course_code, course_name, credits, status) VALUES (?, ?, ?, ?, ?)',
            [semesterId, course.courseCode, course.courseName, course.courseCredits, course.courseStatus]
          );
        }
      }
    }
    res.status(201).json({ message: 'All semesters saved successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Add a new function to test the database connection
exports.testDbConnection = async (req, res) => {
    const query = `
      SELECT course_code, course_name, credits, category 
      FROM Courses 
      ORDER BY course_code
  `;
    // console.log('Executing test query:', query);
    db.query(query, [], (err, results) => { 
        console.log('Inside db.query callback');
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(200).json({ message: 'Database connection successful', results });
        });

    try {
      const [rows] = await db.execute(query);
      console.log('Database results:', rows);
      res.status(200).json({ message: 'Database connection successful', results: rows });
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection error' });
    }
  };


exports.getSemesters = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch the semesters for the user
    const [semesters] = await db.execute('SELECT * FROM Semesters WHERE student_id = ?', [userId]);

    // Fetch the courses for each semester and include them in the response
    const semestersData = await Promise.all(semesters.map(async (semester) => {
      const [courses] = await db.execute('SELECT * FROM StudentCourses WHERE semester_id = ?', [semester.id]);
      return {
        ...semester,
        courses
      };
    }));

    res.status(200).json(semestersData);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateCourseStatus = async (req, res) => {
  const { courseCode, newStatus } = req.body;
  const userId = req.user.id; // Assuming you are using authentication to get the user ID

  try {
      const [result] = await db.execute(
          'UPDATE StudentCourses SET status = ? WHERE course_code = ? AND semester_id IN (SELECT id FROM Semesters WHERE student_id = ?)',
          [newStatus, courseCode, userId]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Course not found or you do not have permission to update it.' });
      }

      res.status(200).json({ message: 'Course status updated successfully.' });
  } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to update course status.' });
  }
};

exports.deleteCourse = async (req, res) => {
  const { courseCode } = req.body;
  console.log('Deleting course:', courseCode);

  try {
      await db.execute('DELETE FROM StudentCourses WHERE course_code = ?', [courseCode]);
      res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to delete course' });
  }
};

exports.deleteSemester = async (req, res) => {
    const userId = req.user.id;
    const { semesterName } = req.body;

    try {
        // get the semester ID
        const [semester] = await db.execute(
            'SELECT id FROM Semesters WHERE student_id = ? AND semester_name = ?',
            [userId, semesterName]
        );

        if (semester.length === 0) {
            return res.status(404).json({ error: 'Semester not found' });
        }

        // Delete associated courses
        await db.execute(
            'DELETE FROM StudentCourses WHERE semester_id = ?',
            [semester[0].id]
        );

        // delete the semester
        await db.execute(
            'DELETE FROM Semesters WHERE id = ?',
            [semester[0].id]
        );

        res.status(200).json({ message: 'Semester deleted successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to delete semester' });
    }
};
