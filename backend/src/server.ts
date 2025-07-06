import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './utils/database';
import authRoutes from './routes/auth';
import wishlistRoutes from './routes/wishlists';
import { authenticateSocket } from './middleware/auth';

dotenv.config();

const app = express();
const server = createServer(app);
// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      process.env.CLIENT_URL
    ];
    
    // Allow any origin in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wishlists', wishlistRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check CORS
app.get('/api/debug', (req, res) => {
  res.status(200).json({ 
    message: 'Backend is running',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Socket.io connection handling
io.use(authenticateSocket);

io.on('connection', (socket: any) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join wishlist rooms
  socket.on('join-wishlist', (wishlistId: string) => {
    socket.join(`wishlist-${wishlistId}`);
    console.log(`User ${socket.userId} joined wishlist ${wishlistId}`);
  });
  
  // Leave wishlist rooms
  socket.on('leave-wishlist', (wishlistId: string) => {
    socket.leave(`wishlist-${wishlistId}`);
    console.log(`User ${socket.userId} left wishlist ${wishlistId}`);
  });
  
  // Handle product updates
  socket.on('product-added', (data: any) => {
    socket.to(`wishlist-${data.wishlistId}`).emit('product-added', data);
  });
  
  socket.on('product-updated', (data: any) => {
    socket.to(`wishlist-${data.wishlistId}`).emit('product-updated', data);
  });
  
  socket.on('product-removed', (data: any) => {
    socket.to(`wishlist-${data.wishlistId}`).emit('product-removed', data);
  });
  
  // Handle wishlist updates
  socket.on('wishlist-updated', (data: any) => {
    socket.to(`wishlist-${data.wishlistId}`).emit('wishlist-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
