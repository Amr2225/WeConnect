import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in the environment variables');
}

export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '1m' }
    );

    const refreshToken = jwt.sign(
        { _id: userId },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '2m' }
    );

    return { accessToken, refreshToken };
}; 