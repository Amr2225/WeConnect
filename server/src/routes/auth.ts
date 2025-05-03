import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../middleware/auth';
import { generateTokens } from '../utils/generateToken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req: UserRequest, res: Response) => {
    try {
        const { email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            email,
            name,
            password
        });

        await user.save();
        const tokens = generateTokens(user._id.toString(), user?.role ?? "user");

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            ...tokens
        });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: UserRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user._id.toString(), user?.role ?? "user");

        res.json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user?.role ?? "user",
            },
            ...tokens
        });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        );

        const tokens = generateTokens((decoded as any)._id, (decoded as any).role);
        res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

export default router; 