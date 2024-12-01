const express = require('express');
const courseController = require('../controllers/courseController'); 
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search-courses', courseController.searchCourses);
router.post('/save-semesters', authenticateToken, courseController.saveSemesters); 
router.get('/get-semesters', authenticateToken, courseController.getSemesters);
router.delete('/delete-course', authenticateToken, courseController.deleteCourse);
router.patch('/update-course-status', authenticateToken, courseController.updateCourseStatus);


// Add a test route to check the database connection
router.get('/test-db', courseController.testDbConnection);

module.exports = router;