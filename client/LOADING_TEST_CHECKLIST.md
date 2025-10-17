# Loading Test Checklist - Test Every Link

## Instructions
Click each link/button below and verify that loading shows IMMEDIATELY when you click.

## Header Links
- [ ] Logo (top left) → Home
- [ ] Home icon → Home  
- [ ] Profile menu dropdown:
  - [ ] Dashboard (if logged in)
  - [ ] Sign Out (if logged in)
  - [ ] Create Account (if logged out)
  - [ ] Sign In (if logged out)
  - [ ] About Us
  - [ ] Contact Us
- [ ] Language selector (should NOT show loading - just changes language)

## Footer Links
- [ ] About Us
- [ ] Contact Us

## Home Page (`/`)
- [ ] "Start Exploring" button (scrolls, should NOT show loading)
- [ ] "View on Map" button (scrolls, should NOT show loading)

## Sign In Page (`/SignIn`)
- [ ] Submit button (navigates to Dashboard after success)
- [ ] "Forgot Password?" link
- [ ] "Create Account" link

## Create Account Flow
**CreateAccount page:**
- [ ] Submit button (navigates to VerifyEmail)
- [ ] "Sign In" link

**VerifyEmail page:**
- [ ] "Go Back" button → CreateAccount
- [ ] "Resend Email" button (API call, no navigation)

**VerifyEmail/Check page:**
- [ ] Auto-redirect to CreatePassword (after verification)
- [ ] "Try Again" button (on error) → CreateAccount

**CreatePassword page:**
- [ ] Auto-redirect to CreateAccount (if email not verified)
- [ ] Submit button → Dashboard

## Forgot/Reset Password
**ForgotPassword page:**
- [ ] Submit button (shows success, no navigation)
- [ ] "Back to Sign In/Dashboard" button (after success)
- [ ] "Sign In" link

**ResetPassword page:**
- [ ] Submit button (shows success, no navigation)
- [ ] "Go to Sign In/Dashboard" button (after success)
- [ ] "Request New Link" button (if invalid token) → ForgotPassword
- [ ] "Sign In" link

## Dashboard (`/Dashboard`)
- [ ] Analytics card → /Dashboard/analytics
- [ ] Users card → /Dashboard/users
- [ ] Content Management card → /Dashboard/content-management
- [ ] "Change Password" link → /ForgotPassword
- [ ] Save profile button (may navigate to email verification)

## Dashboard Sub-pages
**Analytics:**
- [ ] Back button

**Users:**
- [ ] Back button
- [ ] Delete/Update buttons (API calls, no navigation)

**Content Management:**
- [ ] No navigation buttons (saves in place)

**Email Verification Sent:**
- [ ] "Return to Dashboard" button

**Verify Email:**
- [ ] "Return to Dashboard" button (success)
- [ ] "Return to Dashboard" button (error)

**Password Expired:**
- [ ] Submit button
- [ ] Auto-redirect to Dashboard (after success)

## Sign Out
- [ ] Auto-redirect to Home (starts immediately)

## Auto-Redirects (Background)
- [ ] Protected route redirect (when not authenticated)
- [ ] Password expiry redirect (when expired)

## Expected Results
✅ **Should Show Loading:**
- All page navigations (different pages)
- All form submissions that navigate

❌ **Should NOT Show Loading (or brief 500ms):**
- Same-page clicks
- Scroll-to-section buttons
- Language changes
- API calls without navigation

## Test Each One
Please go through this checklist and let me know which specific link/button does NOT show loading when clicked.

