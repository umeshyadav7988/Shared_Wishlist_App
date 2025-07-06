import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};
