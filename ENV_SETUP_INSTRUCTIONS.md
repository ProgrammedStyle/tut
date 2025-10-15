# Environment Setup Instructions

## ⚠️ CRITICAL: Your website needs environment variables to work!

Your application is currently not working because it's missing the `.env` configuration files.

## Quick Fix

### 1. Create `server/.env` file

Create a new file at `server/.env` with the following content:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/jerusalem-guide

# JWT Secrets (Change these to secure random strings)
JWT_SECRET=your-jwt-secret-key-change-this-to-something-random
EMAIL_VERIFY_JWT_SECRET=your-email-verify-secret-change-this-too

# Email Configuration (SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Client URL
CLIENT_URL=http://localhost:3000

# Google OAuth (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook OAuth (Optional - leave empty if not using)
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 2. Configure MongoDB

You need MongoDB installed and running. Two options:

#### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use the MONGO_URI as shown above

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get your connection string
4. Replace `MONGO_URI` with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jerusalem-guide
   ```

### 3. Email Configuration (for user verification emails)

If you want email verification to work:

1. **Gmail**: Use an App Password
   - Go to Google Account Settings → Security → 2-Step Verification → App Passwords
   - Generate an app password
   - Use your Gmail as `SMTP_USER` and the app password as `SMTP_PASS`

2. **Other providers**: Configure with your SMTP credentials

**Note**: If you skip this, email features won't work but the site will still run.

### 4. JWT Secrets

Replace the JWT secret values with random strings. You can generate them using:

**In PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use any random string generator**

### 5. Restart Your Servers

After creating the `.env` file:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Optional: Social Login

If you want Google/Facebook login:

1. **Google OAuth**:
   - Go to https://console.cloud.google.com/
   - Create a project and enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

2. **Facebook OAuth**:
   - Go to https://developers.facebook.com/
   - Create an app
   - Add `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` to `.env`

## Verification

After setup, check:
1. Backend should show: `Server running successfuly, Port: 5000`
2. Frontend should open at: `http://localhost:3000`
3. No MongoDB connection errors

## Common Issues

- **"Database connection failed"**: MongoDB is not running or `MONGO_URI` is wrong
- **"Environment variables loaded: NOT SET"**: `.env` file is not in the right location
- **Port already in use**: Change `PORT` in `.env` or kill the process using that port

