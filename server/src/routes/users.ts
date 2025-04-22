import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
    user: {
        _id: Types.ObjectId;
        username: string;
    };
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Update user profile
router.patch('/me', authenticateToken, upload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const updates: any = {};

        // Handle text fields
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email;

        // Handle file upload
        if (req.file) {
            updates.profilePicture = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            authReq.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(400).json({ error: 'Failed to update profile' });
    }
});

// Get user profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const user = await User.findById(authReq.user._id)
            .select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router; 