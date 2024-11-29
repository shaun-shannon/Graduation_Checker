const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// for CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Load environment variables
dotenv.config();

// Middleware to serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend/')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// For clean URLs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
