# Image Links Management Feature

## Overview
This feature allows you to manage clickable links for the 10 images on the home page, with support for different URLs per language (English, Arabic, German, UK English).

## What Was Implemented

### 1. Database Model
**File:** `server/models/ImageLink.js`
- Stores image links with language support
- Each image (1-10) can have different links for different languages
- Links can be set to `null` (no link) to make images non-clickable
- Compound index ensures one entry per image per language

### 2. Backend API Endpoints
**Base URL:** `/api/image-links`

#### Get Image Links
```
GET /api/image-links?language=en
```
- Public endpoint (no authentication required)
- Returns links for specified language
- Used by home page to fetch links dynamically

#### Update Image Link
```
PUT /api/image-links
Body: {
    imageId: 1,
    language: "en",
    link: "https://example.com"
}
```
- Protected endpoint (requires authentication)
- Creates or updates link for specific image and language
- Validates URL format (must start with http:// or https://)
- Use `null` or empty string to remove link

#### Delete Image Link
```
DELETE /api/image-links?imageId=1&language=en
```
- Protected endpoint (requires authentication)
- Removes link (sets to null) for specific image and language

### 3. Dashboard Management Page
**URL:** `/Dashboard/image-links`

**Features:**
- ✅ Visual interface showing all 10 images
- ✅ Language selector (switch between en, ar, de, gb)
- ✅ Text field for each image to enter/edit URL
- ✅ Save button for each image
- ✅ Delete button (appears when link exists)
- ✅ Visual indicator showing which images have links
- ✅ Real-time updates
- ✅ User-friendly error messages

**Access:**
- Go to Dashboard → Click "Image Links" in Quick Actions
- Direct URL: `http://localhost:3000/Dashboard/image-links`

### 4. Home Page Integration
**File:** `client/src/app/page.js`

**Features:**
- ✅ Automatically fetches image links based on current language
- ✅ Makes images clickable when link exists
- ✅ Opens links in new tab (`target="_blank"`)
- ✅ Shows hover effect only for clickable images
- ✅ Non-linked images remain non-clickable
- ✅ Updates when language changes

## How to Use

### Setting Up Image Links

1. **Navigate to Dashboard:**
   - Sign in to your account
   - Go to Dashboard
   - Click "Image Links" in Quick Actions

2. **Select Language:**
   - Use the language dropdown in the top-right
   - Choose the language you want to configure (en, ar, de, gb)

3. **Add/Edit Links:**
   - Enter a URL in the text field under any image
   - URL must start with `http://` or `https://`
   - Example: `https://www.example.com/damascus-gate`
   - Click "Save Link"

4. **Remove Links:**
   - Click the red delete icon button next to Save
   - OR clear the text field and click "Save Link"

5. **Repeat for Other Languages:**
   - Switch to another language using the dropdown
   - Set different links for the same images
   - Each language has independent link configuration

### Testing on Home Page

1. **Visit Home Page:**
   - Go to `http://localhost:3000`

2. **Test Clickable Images:**
   - Scroll to the "Featured Routes" section (10 images)
   - Images with configured links will be clickable
   - Hover over images to see enhanced hover effect (only on linked images)
   - Click to open link in new tab

3. **Test Language Switching:**
   - Change language using header language selector
   - Images will now use links configured for that language
   - Same image may link to different URLs in different languages

## Examples

### Example 1: Tourism Website
```
English (en):
- Image 1 (Damascus Gate) → https://tourism.example.com/damascus-gate
- Image 2 (Al-Aqsa) → https://tourism.example.com/al-aqsa

Arabic (ar):
- Image 1 (Damascus Gate) → https://tourism.example.com/ar/باب-العامود
- Image 2 (Al-Aqsa) → https://tourism.example.com/ar/المسجد-الأقصى
```

### Example 2: Mixed Configuration
```
English (en):
- Images 1-5: Have links (clickable)
- Images 6-10: No links (not clickable)

Arabic (ar):
- Images 1-10: All have links (all clickable)
```

## Technical Details

### Database Schema
```javascript
{
    imageId: Number (1-10),
    language: String ('en', 'ar', 'de', 'gb'),
    link: String (URL or null),
    isActive: Boolean,
    timestamps: true
}
```

### API Response Format
```json
{
    "success": true,
    "data": {
        "1": "https://example.com/link1",
        "2": null,
        "3": "https://example.com/link3",
        ...
    }
}
```

### Security
- **Public Access:** GET endpoints (used by home page)
- **Protected Access:** PUT and DELETE endpoints (require authentication)
- **Validation:** URLs must follow proper format
- **CORS:** Configured to work with your frontend domain

## File Structure

```
server/
├── models/
│   └── ImageLink.js              # Database model
├── controllers/
│   └── imageLinks/
│       ├── getAll.js            # Get links controller
│       ├── update.js            # Update link controller
│       └── delete.js            # Delete link controller
├── routes/
│   └── imageLinks/
│       └── index.js             # API routes
└── index.js                      # Route registration

client/
└── src/
    └── app/
        ├── page.js               # Home page (updated)
        └── Dashboard/
            ├── page.js           # Dashboard (new quick action)
            └── image-links/
                └── page.js       # Image links management
```

## Troubleshooting

### Links Not Showing on Home Page
1. Check browser console for errors
2. Verify API is running (`http://localhost:5000`)
3. Check network tab to see if API call succeeds
4. Verify language code matches (en, ar, de, gb)

### Can't Save Links in Dashboard
1. Ensure you're signed in
2. Check URL format (must start with http:// or https://)
3. Verify backend is running
4. Check browser console for error messages

### Different Languages Showing Same Links
- Each language must be configured separately
- Use the language dropdown to switch and configure each language
- Links are NOT shared between languages

## Future Enhancements (Optional)

- [ ] Add bulk import/export feature
- [ ] Add link preview/validation
- [ ] Add analytics for link clicks
- [ ] Support for custom open behavior (same tab vs new tab)
- [ ] Link scheduling (enable/disable links by date)
- [ ] A/B testing for different links

## Notes

- **No Link = Not Clickable:** If an image has no link configured, it won't be clickable (normal card behavior)
- **Link Persistence:** Links are stored in database and persist across sessions
- **Real-time Updates:** Home page fetches links on every page load and language change
- **New Tab:** All links open in a new tab for better UX
- **Validation:** Invalid URLs are rejected with clear error messages

