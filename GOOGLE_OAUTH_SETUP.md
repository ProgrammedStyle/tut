# 🔐 How to Enable Google Sign-In (OAuth)

Currently, the "Sign in with Google" button is **hidden** because Google OAuth isn't configured.

If you want to enable it, follow these steps:

---

## ✅ Setup Steps (Takes ~10 minutes)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Name it (e.g., "Jerusalem Guide")
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click it and press **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in:
   - **App name**: Jerusalem Virtual Guide
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. Skip "Scopes" → Click **"Save and Continue"**
6. Skip "Test users" → Click **"Save and Continue"**

### Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in:
   - **Name**: Jerusalem Guide Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/user/google/callback`
5. Click **"Create"**
6. **Save the Client ID and Client Secret** that appear!

### Step 5: Add Credentials to .env

1. Open `server/.env`
2. Update these lines:
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```
3. Save the file

### Step 6: Enable the Buttons

1. Open `client/src/app/components/SocialSignInBox/index.js`
2. Find this line (around line 12):
   ```javascript
   const SOCIAL_LOGIN_ENABLED = false;
   ```
3. Change it to:
   ```javascript
   const SOCIAL_LOGIN_ENABLED = true;
   ```
4. Save the file

### Step 7: Restart Servers

Stop both servers (Ctrl+C) and restart them:

**Backend:**
```powershell
cd server
npm run dev
```

**Frontend:**
```powershell
cd client
npm run dev
```

### Step 8: Test It!

1. Go to http://localhost:3000
2. Click "Sign In"
3. You should now see the **"Sign in with Google"** button
4. Click it and test!

---

## 🔧 Troubleshooting

### "Access blocked: This app's request is invalid"

**Solution**: Make sure you added the correct redirect URI:
- `http://localhost:5000/api/user/google/callback`

### "Error 400: redirect_uri_mismatch"

**Solution**: The redirect URI in Google Cloud Console doesn't match. Make sure it's exactly:
- `http://localhost:5000/api/user/google/callback`

### Still seeing "Unknown authentication strategy"

**Solution**: 
1. Make sure you added the credentials to `server/.env`
2. Restart the backend server
3. Check backend console - you should see:
   ```
   ✓ Google OAuth configured
   ```

---

## 📱 Facebook OAuth (Optional)

Similar process:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app
3. Set up Facebook Login
4. Add redirect URI: `http://localhost:5000/api/user/facebook/callback`
5. Get App ID and App Secret
6. Add to `server/.env`:
   ```env
   FACEBOOK_CLIENT_ID=your-app-id
   FACEBOOK_CLIENT_SECRET=your-app-secret
   ```
7. Restart servers

---

## 🎯 Current Status

- ✅ Regular email/password sign-in works
- ❌ Google OAuth: Not configured (buttons hidden)
- ❌ Facebook OAuth: Not configured (buttons hidden)

You can use the website perfectly fine without social login! This is just an optional feature.

---

## 💡 Production Setup

When deploying to production:

1. Add your production URLs to OAuth:
   - **Authorized origins**: `https://yourdomain.com`
   - **Redirect URI**: `https://yourdomain.com/api/user/google/callback`
2. Update `CLIENT_URL` in `server/.env`
3. Move your app from "Testing" to "Production" in Google Cloud Console

---

**For now, your website works perfectly with regular sign-in/sign-up!** 🎉

