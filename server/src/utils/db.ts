import mongoose from "mongoose";
import { config } from "dotenv";
config();

// MongoDB Connection
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not defined in the environment variables');
const MONGODB_URI = process.env.MONGODB_URI
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error)
    }
}