import mongoose from 'mongoose';
import { config } from 'dotenv';
import UserModel from '../models/User';
import { connectDB } from './db';

config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminData = {
            email: 'admin@weconnect.com',
            name: 'Admin User',
            password: 'admin123', // This will be hashed by the User model's pre-save hook
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new UserModel(adminData);
        await admin.save();

        console.log('Admin user created successfully');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('Role:', adminData.role);

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

// Run the script
createAdmin(); 