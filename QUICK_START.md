# 🚀 Quick Start Guide - Fix Your Website

## Problem
Your website isn't working because it's missing:
- ❌ Environment configuration file (`.env`)
- ❌ MongoDB database connection

## Solution (3 Simple Steps)

### Step 1: Create Environment File

**Option A - Automated (Recommended):**
Run this in PowerShell (from project root):
```powershell
.\setup-env.ps1
```

**Option B - Manual:**
1. Rename `server/env-template.txt` to `server/.env`
2. Continue to Step 2

### Step 2: Set Up Database

You have 2 options:

#### Option A: MongoDB Atlas (Cloud - Easiest) ⭐ RECOMMENDED

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a **FREE M0 Cluster** (takes ~3 minutes)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string (looks like: `mongodb+srv://username:password@...`)
6. Open `server/.env` and replace the `MONGO_URI` line with:
   ```
   MONGO_URI=<your-connection-string-here>
   ```
   Make sure to replace `<password>` with your actual database password!

#### Option B: Local MongoDB Installation

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. The default `MONGO_URI` in `.env` should work

### Step 3: Start Your Application

Open **TWO** terminal windows:

**Terminal 1 - Backend Server:**
```powershell
cd server
npm run dev
```
You should see: ✅ `Server running successfully, Port: 5000`

**Terminal 2 - Frontend Server:**
```powershell
cd client
npm run dev
```
You should see: ✅ Frontend running at `http://localhost:3000`

## 🎉 Test It

Open your browser and go to: **http://localhost:3000**

Your website should now be working!

## 🐛 Troubleshooting

### "Database connection failed"
- ❌ MongoDB is not running or connection string is wrong
- ✅ Check `MONGO_URI` in `server/.env`
- ✅ If using Atlas, make sure you:
  - Replaced `<password>` with your actual password
  - Whitelisted your IP address (in Atlas dashboard: Network Access → Add IP Address → Allow Access from Anywhere)

### "Port 5000 already in use"
- ❌ Another process is using port 5000
- ✅ Kill the process or change `PORT` in `server/.env` to 5001

### "Cannot find module"
- ❌ Dependencies not installed
- ✅ Run `npm install` in both `client` and `server` directories

### Environment variables showing "NOT SET"
- ❌ `.env` file is not in the correct location
- ✅ Make sure it's at `server/.env` (not `server/env-template.txt`)
- ✅ Make sure the file is named exactly `.env` (not `.env.txt`)

## 📧 Email Features (Optional)

The default configuration includes test email credentials. For production:

1. Use your own Gmail:
   - Enable 2-Step Verification
   - Generate an App Password
   - Update `SMTP_USER` and `SMTP_PASS` in `.env`

2. Or disable email verification temporarily (features will work but without email confirmation)

## 🔐 Security Note

The JWT secrets in the template are random but should be changed for production. Generate new ones:

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Run this twice to generate two different secrets for `JWT_SECRET` and `EMAIL_VERIFY_JWT_SECRET`.

---

## Still Having Issues?

1. Check that `server/.env` exists and is correctly formatted
2. Verify MongoDB connection (can you connect with MongoDB Compass?)
3. Check console for specific error messages
4. Ensure all npm packages are installed (`npm install`)

**Need more help?** Check `ENV_SETUP_INSTRUCTIONS.md` for detailed information.

