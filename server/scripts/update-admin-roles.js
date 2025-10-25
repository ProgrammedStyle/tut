// Script to update existing users to admin role
// Run this in your server directory: node scripts/update-admin-roles.js

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminRoles = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tut');
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find();
        console.log(`Found ${users.length} users`);

        // Update users without roles or with 'user' role to 'admin' if they should be admin
        const adminEmail = process.env.ADMIN_EMAIL;
        let updatedCount = 0;

        for (const user of users) {
            let shouldBeAdmin = false;

            // Check if this user should be admin
            if (adminEmail && user.email === adminEmail) {
                shouldBeAdmin = true;
            } else if (!user.role || user.role === 'user') {
                // If it's the first user or no role is set, make them admin
                const userIndex = users.indexOf(user);
                if (userIndex === 0) {
                    shouldBeAdmin = true;
                }
            }

            if (shouldBeAdmin && user.role !== 'admin') {
                await User.findByIdAndUpdate(user._id, { role: 'admin' });
                console.log(`Updated user ${user.email} to admin role`);
                updatedCount++;
            }
        }

        console.log(`Updated ${updatedCount} users to admin role`);
        console.log('Admin role update completed');

    } catch (error) {
        console.error('Error updating admin roles:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

updateAdminRoles();
