import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "http://localhost:5000/api/user/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleIDD: profile.emails?.[0]?.value });
    if (!user) {
      user = await User.create({
        googleIDD: profile.emails?.[0]?.value
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
  clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
  callbackURL: "http://localhost:5000/api/user/facebook/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookIDD: profile.emails?.[0]?.value });
    if (!user) {
      user = await User.create({
        facebook: profile.emails?.[0]?.value
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));