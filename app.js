const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const friendRoutes = require('./routes/friends');
const connectDB = require('./config/connectDB');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config({ path: './config/.env' });
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth/', authRoutes);
app.use('/user/posts', postRoutes);
app.use('/user/friends', friendRoutes);
app.use('/user', userRoutes);
app.get('/', (req, res) => res.send('API is running...'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
// Global error handler (place after all routes)
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


// Start server
connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
