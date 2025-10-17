import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

console.log('Social routes file loaded');

router.get('/google', (req, res, next) => {
  console.log('Google OAuth route hit!');
  
  // Check if Google OAuth is configured AT RUNTIME (not at import time)
  const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  
  if (!isGoogleConfigured) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google OAuth Not Configured</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 600px;
            text-align: center;
          }
          h1 { color: #667eea; margin-bottom: 20px; }
          p { color: #4a5568; line-height: 1.6; margin-bottom: 15px; }
          .code { 
            background: #f7fafc; 
            padding: 15px; 
            border-radius: 6px; 
            font-family: monospace;
            text-align: left;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .button {
            display: inline-block;
            margin: 10px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
          }
          .button:hover { background: #5568d3; }
          .secondary { background: #718096; }
          .secondary:hover { background: #5a6c7d; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 Google Sign-In Not Configured</h1>
          <p><strong>Google OAuth is not set up yet.</strong></p>
          <p>To enable "Sign in with Google", you need to:</p>
          <ol style="text-align: left; color: #4a5568;">
            <li>Create a Google Cloud Console project</li>
            <li>Enable Google+ API</li>
            <li>Create OAuth credentials</li>
            <li>Add credentials to server/.env file</li>
          </ol>
          <div class="code">
            GOOGLE_CLIENT_ID=your-client-id<br>
            GOOGLE_CLIENT_SECRET=your-secret
          </div>
          <p>Check <strong>GOOGLE_OAUTH_SETUP.md</strong> in your project for detailed instructions.</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/SignIn" class="button">Back to Sign In</a>
          <a href="https://console.cloud.google.com/" class="button secondary" target="_blank">Google Cloud Console</a>
        </div>
      </body>
      </html>
    `);
  }
  
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/SignIn?error=google_auth_failed` }),
  (req, res) => {
    console.log('Google auth successful for user:', req.user.email);
    
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined, // Allow cookie to work across all onrender.com subdomains
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    
    // Redirect to home page - client will detect the token and update state
    res.redirect(`${process.env.CLIENT_URL}/Dashboard`);
  }
);

router.get('/facebook', (req, res, next) => {
  console.log('Facebook OAuth route hit!');
  
  // Check if Facebook OAuth is configured AT RUNTIME (not at import time)
  const isFacebookConfigured = process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET;
  
  if (!isFacebookConfigured) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facebook OAuth Not Configured</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 600px;
            text-align: center;
          }
          h1 { color: #1877f2; margin-bottom: 20px; }
          p { color: #4a5568; line-height: 1.6; margin-bottom: 15px; }
          .code { 
            background: #f7fafc; 
            padding: 15px; 
            border-radius: 6px; 
            font-family: monospace;
            text-align: left;
            margin: 20px 0;
            border-left: 4px solid #1877f2;
          }
          .button {
            display: inline-block;
            margin: 10px;
            padding: 12px 24px;
            background: #1877f2;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
          }
          .button:hover { background: #166fe5; }
          .secondary { background: #718096; }
          .secondary:hover { background: #5a6c7d; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 Facebook Sign-In Not Configured</h1>
          <p><strong>Facebook OAuth is not set up yet.</strong></p>
          <p>To enable "Sign in with Facebook", you need to:</p>
          <ol style="text-align: left; color: #4a5568;">
            <li>Go to Facebook Developers</li>
            <li>Create an app</li>
            <li>Set up Facebook Login</li>
            <li>Add credentials to server/.env file</li>
          </ol>
          <div class="code">
            FACEBOOK_CLIENT_ID=your-app-id<br>
            FACEBOOK_CLIENT_SECRET=your-secret
          </div>
          <p>Check <strong>GOOGLE_OAUTH_SETUP.md</strong> in your project for instructions.</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/SignIn" class="button">Back to Sign In</a>
          <a href="https://developers.facebook.com/" class="button secondary" target="_blank">Facebook Developers</a>
        </div>
      </body>
      </html>
    `);
  }
  
  next();
}, passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/SignIn?error=facebook_auth_failed` }),
  (req, res) => {
    console.log('Facebook auth successful for user:', req.user.email);
    
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined, // Allow cookie to work across all onrender.com subdomains
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    
    // Redirect to Dashboard - client will detect the token and update state
    res.redirect(`${process.env.CLIENT_URL}/Dashboard`);
  }
);

router.get('/failure', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/CreateAccount/?Failed_Logging_In`);
});

export default router;