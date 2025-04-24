import express, { Request, Response } from 'express';
import { authenticateToken, UserRequest } from '../middleware/auth';
import Post from '../models/Post';

const router = express.Router();

// Add a new post
router.post('/', authenticateToken, async (req: UserRequest, res: Response) => {
    try {
        const { content } = req.body;
        // const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

        const post = new Post({
            content,
            author: req.user!._id,
            // images
        });

        await post.save();
        const populatedPost = await post.populate('author', 'name email');
        res.status(201).json(populatedPost);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

// Get all posts
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name email')
            .populate('likes', 'name')


        res.json(posts);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Like a post
router.post('/:postId/like', authenticateToken, async (req: UserRequest, res: Response) => {
    try {
        const user = req.user!
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const likeIndex = post.likes.findIndex(likeId => likeId.equals(user._id));
        if (likeIndex === -1) post.likes.push(user._id);
        else post.likes.splice(likeIndex, 1);

        await post.save();
        const populatedPost = await post.populate('author', 'name email');
        res.json(populatedPost);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router; 