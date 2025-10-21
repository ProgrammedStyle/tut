# Static File Serving for _html5 Directory

This setup allows you to serve static files from the `_html5` directory through your Next.js application.

## How it works

1. **Next.js Rewrite Rule**: The `next.config.mjs` file contains a rewrite rule that redirects requests from `/_html5/*` to `/api/static/_html5/*`

2. **API Route**: The API route at `client/src/app/api/static/_html5/[...path]/route.js` handles serving the actual files from the `_html5` directory

3. **Security**: The API route includes security checks to ensure files can only be served from within the `_html5` directory

## Usage

Once deployed, you can access files from the `_html5` directory using URLs like:

- `https://tut-1-8b8v.onrender.com/_html5/Project13.html`
- `https://tut-1-8b8v.onrender.com/_html5/images/any-image.png`
- `https://tut-1-8b8v.onrender.com/_html5/javascript/gyro.js`
- `https://tut-1-8b8v.onrender.com/_html5/sounds/scene_0.mp3`

## Supported File Types

The API route automatically sets the correct Content-Type headers for:

- HTML files (`.html`)
- CSS files (`.css`)
- JavaScript files (`.js`)
- JSON files (`.json`)
- Images (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`)
- Audio files (`.mp3`, `.wav`, `.ogg`)

## Features

- **CORS Support**: Allows cross-origin requests
- **Caching**: Files are cached for 1 year for better performance
- **Security**: Prevents directory traversal attacks
- **Error Handling**: Proper 404 and 500 error responses

## Testing Locally

To test locally:

1. Start the development server: `npm run dev`
2. Visit: `http://localhost:3000/_html5/Project13.html`

The Project13.html file should load with all its dependencies (images, sounds, JavaScript files) working correctly.
