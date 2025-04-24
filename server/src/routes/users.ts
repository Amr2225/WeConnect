import express, { Response } from 'express';
import { authenticateToken, UserRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Update user profile
router.patch('/me', authenticateToken, async (req: UserRequest, res: Response) => {
    try {
        const updates: any = {};

        // Handle text fields
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email;

        const user = await User.findByIdAndUpdate(
            req.user!._id,
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
router.get('/me', authenticateToken, async (req: UserRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!._id)
            .select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router; 