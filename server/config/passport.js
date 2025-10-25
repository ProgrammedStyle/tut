import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

// Debug: Check if environment variables are loaded
console.log('=== PASSPORT CONFIG LOADING ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set (length: ' + process.env.GOOGLE_CLIENT_ID.length + ')' : 'NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'NOT SET');
console.log('FACEBOOK_CLIENT_ID:', process.env.FACEBOOK_CLIENT_ID ? 'Set' : 'NOT SET');
console.log('FACEBOOK_CLIENT_SECRET:', process.env.FACEBOOK_CLIENT_SECRET ? 'Set' : 'NOT SET');

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✓ Configuring Google OAuth');
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/user/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('Google OAuth callback triggered');
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }
      
      // First, try to find user by Google ID
      let user = await User.findOne({ googleIDD: profile.id });
      
      if (!user) {
        // If not found by Google ID, check if user exists with this email
        user = await User.findOne({ email: email });
        
        if (user) {
          // User exists with this email - link Google account
          console.log('Linking Google account to existing user:', email);
          user.googleIDD = profile.id;
          user.isSocialLogin = true;
          
          // If user doesn't have a role set, and this is the first user or admin email, make them admin
          if (!user.role) {
            const userCount = await User.countDocuments();
            const isAdminEmail = email === process.env.ADMIN_EMAIL || userCount === 1;
            user.role = 'admin';
            console.log(`Existing user role set to: ${user.role}`);
          }
          
          await user.save();
        } else {
          // Create new user
          console.log('Creating new user with Google account:', email);
          
          // Check if this email should be admin (you can customize this logic)
          // For now, let's check if it's the first user or a specific admin email
          const userCount = await User.countDocuments();
          const isAdminEmail = email === process.env.ADMIN_EMAIL || userCount === 0;
          
          user = await User.create({
            email: email,
            googleIDD: profile.id,
            isSocialLogin: true,
            role: 'admin' // Set admin role for first user or specific admin email
          });
          
          console.log(`User created with role: ${isAdminEmail ? 'admin' : 'user'}`);
        }
      }
      
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }));
} else {
  console.log('⚠ Google OAuth not configured - missing credentials in .env file');
  console.log('  Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your server/.env file');
}

// Only configure Facebook OAuth if credentials are provided
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  console.log('✓ Configuring Facebook OAuth');
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/user/facebook/callback`,
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('Facebook OAuth callback triggered');
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Facebook profile'), null);
      }
      
      // First, try to find user by Facebook ID
      let user = await User.findOne({ facebookIDD: profile.id });
      
      if (!user) {
        // If not found by Facebook ID, check if user exists with this email
        user = await User.findOne({ email: email });
        
        if (user) {
          // User exists with this email - link Facebook account
          console.log('Linking Facebook account to existing user:', email);
          user.facebookIDD = profile.id;
          user.isSocialLogin = true;
          
          // If user doesn't have a role set, and this is the first user or admin email, make them admin
          if (!user.role) {
            const userCount = await User.countDocuments();
            const isAdminEmail = email === process.env.ADMIN_EMAIL || userCount === 1;
            user.role = 'admin';
            console.log(`Existing user role set to: ${user.role}`);
          }
          
          await user.save();
        } else {
          // Create new user
          console.log('Creating new user with Facebook account:', email);
          
          // Check if this email should be admin (you can customize this logic)
          // For now, let's check if it's the first user or a specific admin email
          const userCount = await User.countDocuments();
          const isAdminEmail = email === process.env.ADMIN_EMAIL || userCount === 0;
          
          user = await User.create({
            email: email,
            facebookIDD: profile.id,
            isSocialLogin: true,
            role: 'admin' // Set admin role for first user or specific admin email
          });
          
          console.log(`User created with role: ${isAdminEmail ? 'admin' : 'user'}`);
        }
      }
      
      return done(null, user);
    } catch (err) {
      console.error('Facebook OAuth error:', err);
      return done(err, null);
    }
  }));
} else {
  console.log('⚠ Facebook OAuth not configured - missing credentials in .env file');
  console.log('  Please add FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET to your server/.env file');
}