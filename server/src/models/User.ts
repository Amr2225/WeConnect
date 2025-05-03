import mongoose from 'mongoose';
import crypto from 'crypto-js';
import { Types } from 'mongoose';

export interface IUser extends mongoose.Document {
    _id: Types.ObjectId;
    email: string;
    name: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): boolean;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = crypto.SHA256(this.password).toString();
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword: string): boolean {
    return crypto.SHA256(candidatePassword).toString() === this.password;
};

export default mongoose.model<IUser>('User', userSchema); 