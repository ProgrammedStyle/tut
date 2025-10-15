# 🔄 How to Restart the Backend Server

## The Problem
Your backend server is running old code. You need to restart it to load the new changes.

## Solution

### Find Your Backend Terminal Window
Look for the terminal window that shows:
```
Server running successfuly, Port: 5000
```

### Step 1: Stop the Backend
In that terminal window:
1. Press `Ctrl + C` to stop the server
2. Wait for it to stop (you'll see the prompt return)

### Step 2: Start it Again
```powershell
cd server
npm run dev
```

### Step 3: Verify It Started
You should see:
```
Server running successfuly, Port: 5000
```

### Step 4: Test the Fix
Now go to your browser and click "Sign in with Google" again.

Instead of the ugly error, you'll see a beautiful, friendly page! 🎨

---

## ⚡ Quick Commands

**Stop backend**: `Ctrl + C`

**Start backend**:
```powershell
cd server
npm run dev
```

---

## 🐛 If You Closed the Terminal

If you closed your backend terminal by accident:

1. Open a NEW PowerShell window
2. Navigate to your project:
   ```powershell
   cd C:\Users\FUJITSU\Desktop\tut
   ```
3. Start the backend:
   ```powershell
   cd server
   npm run dev
   ```

---

**After restarting, the error will be replaced with a nice, helpful page!** ✅

