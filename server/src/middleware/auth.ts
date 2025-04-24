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
        const tokenHeader = req.headers.authorization?.split(' ');
        if (!tokenHeader || tokenHeader[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const token = tokenHeader[1]
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            _id: user._id as Types.ObjectId,
            name: user.name
        };
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.message === "jwt expired") return res.status(401).json({ message: 'Token expired' });
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

