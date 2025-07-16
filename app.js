const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const friendRoutes = require('./routes/friends');
const connectDB = require('./config/connectDB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
require('dotenv').config({ path: './config/.env' });
app.use('/uploads', express.static('uploads'));




app.use(cors({
  origin: true,        // ✅ Allow all origins
  credentials: true    // ✅ Allow sending cookies (for auth)
}));


app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/auth/', authRoutes);
app.use('/user/posts', postRoutes);
app.use('/user/friends', friendRoutes);
app.use('/user', userRoutes);

// ✅ Serve static files from frontend (Vite/React build)


app.use(express.static(path.join(process.cwd(), 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client', 'dist', 'index.html'));
});



// ❌ 404 Handler (put AFTER static frontend serving)
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
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

});
