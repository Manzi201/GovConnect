const express = require('express');
const { connectDB } = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/users');
const complaintRoutes = require('./routes/complaints');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to PostgreSQL
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Real-time socket events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins their own private room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Client ${socket.id} joined user-${userId}`);
  });

  socket.on('join-complaint', (complaintId) => {
    socket.join(`complaint-${complaintId}`);
    console.log(`Client ${socket.id} joined complaint-${complaintId}`);
  });

  // Handle private messaging
  socket.on('send-message', (message) => {
    // Emit to the receiver's private room
    io.to(`user-${message.receiverId}`).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 GovConnect Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
