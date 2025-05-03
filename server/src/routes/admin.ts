import { Router } from 'express';
import { adminAuthorization, authenticateToken } from '../middleware/auth';
import UserModel, { IUser } from '../models/User';
import PostModel, { IPost } from '../models/Post';

const router = Router();

// Get all users with their post counts
router.get('/users', authenticateToken, adminAuthorization, async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        const userStats = await Promise.all(
            users.map(async (user: IUser) => {
                const postCount = await PostModel.countDocuments({ author: user._id });
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    postCount,
                };
            })
        );
        res.json(userStats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 