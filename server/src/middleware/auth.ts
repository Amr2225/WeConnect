import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Types } from 'mongoose';

export interface UserRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        name: string;
    };
}

export const authenticateToken = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        (req as UserRequest).user = {
            _id: user._id as Types.ObjectId,
            name: user.name
        };
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { _id: userId },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}; 