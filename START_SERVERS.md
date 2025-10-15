# 🚀 How to Start the Servers (PowerShell)

## ⚠️ Important: PowerShell Syntax

PowerShell doesn't support `&&` - use `;` instead!

❌ **WRONG**: `cd client && npm run dev`
✅ **CORRECT**: `cd client; npm run dev`

## Option 1: Use the Start Scripts (Easiest)

I've created helper scripts for you:

### Start Backend:
```powershell
.\start-backend.ps1
```

### Start Frontend:
```powershell
.\start-frontend.ps1
```

### Start Both (in separate windows):
```powershell
.\start-both.ps1
```

## Option 2: Manual Start

Open **TWO** PowerShell windows:

### Window 1 - Backend:
```powershell
cd server
npm run dev
```

### Window 2 - Frontend:
```powershell
cd client
npm run dev
```

## What You Should See

**Backend (Window 1):**
```
Environment variables loaded:
- GOOGLE_CLIENT_ID: NOT SET ✗
- GOOGLE_CLIENT_SECRET: NOT SET ✗
✓ Passport configuration loaded
Server running successfuly, Port: 5000
```

**Frontend (Window 2):**
```
▲ Next.js 15.4.1
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
✓ Ready in 2.3s
```

## 🐛 If You See Errors

### "Database connection failed"
You need to set up MongoDB Atlas first! See `FIX_YOUR_WEBSITE_NOW.md`

### "Cannot find module"
```powershell
cd server
npm install
```

### "Port already in use"
Kill the process or change the port in `server/.env`

