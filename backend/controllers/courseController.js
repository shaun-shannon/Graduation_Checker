const db = require('../config/db');

exports.searchCourses = async (req, res) => {
  const searchTerm = req.query.term.toLowerCase();

  // query to get ALL courses first
  const query = `
      SELECT course_code, course_name, credits, category 
      FROM Courses 
      ORDER BY course_code
  `;
  
  console.log('Executing query:', query);
  
  try {
    const [results] = await db.execute(query);
    console.log('Inside db.execute callback');
    
    console.log('Database results:', results);
    // Filter results in JavaScript for debugging
    const filteredResults = results.filter(course => 
        course.course_code.toLowerCase().includes(searchTerm) ||
        course.course_name.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
    );
    
    // console output to check what is
    console.log('Search term:', searchTerm);
    console.log('Total courses:', results.length);
    console.log('Filtered courses:', filteredResults.length);
    
    res.json(filteredResults);
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