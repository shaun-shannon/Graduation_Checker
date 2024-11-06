const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const profileRoutes = require('./routes/profileRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/profile', profileRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
