import mongoose from 'mongoose';
import User from './models/User.js';

const testPasswordExpiry = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/tut');
        console.log('Connected to MongoDB');
        
        const users = await User.find();
        console.log(`\nTotal users: ${users.length}\n`);
        
        for (const user of users) {
            console.log('--- User:', user.email, '---');
            console.log('Security settings:', JSON.stringify(user.securitySettings, null, 2));
            console.log('Password changed at:', user.passwordChangedAt);
            console.log('Created at:', user.createdAt);
            
            if (user.securitySettings?.passwordExpiry) {
                const passwordChangedAt = user.passwordChangedAt || user.createdAt;
                const minutesSinceChange = Math.floor((Date.now() - new Date(passwordChangedAt)) / (1000 * 60));
                const expiryMinutes = user.securitySettings?.passwordExpiryMinutes || 1;
                
                console.log(`Minutes since password change: ${minutesSinceChange}`);
                console.log(`Expiry minutes: ${expiryMinutes}`);
                console.log(`Password expired: ${minutesSinceChange >= expiryMinutes ? 'YES 🚨' : 'NO ✓'}`);
            }
            console.log('');
        }
        
        await mongoose.connection.close();
        console.log('Test complete');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testPasswordExpiry();

