const express = require('express');
const courseController = require('../controllers/courseController'); 
const router = express.Router();

router.get('/search-courses', courseController.searchCourses);

// Add a test route to check the database connection
router.get('/test-db', courseController.testDbConnection);

module.exports = router;