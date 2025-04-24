import mongoose from 'mongoose';
import crypto from 'crypto-js';
import { config } from 'dotenv';
config();

if (!process.env.POST_ENCRYPTION_KEY) throw new Error('POST_ENCRYPTION_KEY is not defined in the environment variables');
const ENCRYPTION_KEY = process.env.POST_ENCRYPTION_KEY

export interface IPost extends mongoose.Document {
    content: string;
    author: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    encryptContent(): void;
}

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
});

// Encrypt content before saving
postSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        this.content = crypto.AES.encrypt(this.content, ENCRYPTION_KEY).toString();
    }
    next();
});

// Method to encrypt content
postSchema.methods.encryptContent = function () {
    this.content = crypto.AES.encrypt(this.content, ENCRYPTION_KEY).toString();
};

// Method to decrypt content
// postSchema.methods.decryptContent = function () {
//     try {
//         const bytes = crypto.AES.decrypt(this.content, ENCRYPTION_KEY);
//         this.content = bytes.toString(crypto.enc.Utf8);
//     } catch (error) {
//         console.error('Failed to decrypt post content:', error);
//     }
// };

// Transform the document before sending to frontend
// postSchema.set('toJSON', {
//     transform: function (doc, ret) {
//         try {
//             const bytes = crypto.AES.decrypt(ret.content, ENCRYPTION_KEY);
//             ret.content = bytes.toString(crypto.enc.Utf8);
//         } catch (error) {
//             console.error('Failed to decrypt post content:', error);
//             ret.content = '[Encrypted Content]';
//         }
//         return ret;
//     }
// });

export default mongoose.model<IPost>('Post', postSchema); 