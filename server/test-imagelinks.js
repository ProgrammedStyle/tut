import mongoose from 'mongoose';
import ImageLink from './models/ImageLink.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tut')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        return ImageLink.find({});
    })
    .then(links => {
        console.log('\n📊 All Image Links in Database:');
        console.log('================================');
        if (links.length === 0) {
            console.log('❌ NO LINKS FOUND IN DATABASE!');
        } else {
            links.forEach(link => {
                console.log(`\nImage ID: ${link.imageId}`);
                console.log(`Language: ${link.language}`);
                console.log(`Link: ${link.link || 'NULL'}`);
                console.log(`Active: ${link.isActive}`);
                console.log('---');
            });
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });

