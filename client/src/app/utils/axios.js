import axios from 'axios';

// Get the API URL from environment variable with sensible browser fallback
// - In production on Render, fall back to the known backend URL if env is missing
// - In local dev, default to localhost
let API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('🌐 Detected hostname:', hostname);
        
        // Check if we're on Render frontend
        const isRenderFrontend = hostname.includes('onrender.com');
        // Check if we're in production (not localhost)
        const isProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1');
        
        if (isRenderFrontend || isProduction) {
            API_URL = 'https://tut-be9h.onrender.com';
            console.log('🚀 Using Render backend URL for production');
        } else {
            API_URL = 'http://localhost:5000';
            console.log('🏠 Using localhost backend URL for development');
        }
    } else {
        API_URL = 'http://localhost:5000';
        console.log('🏠 Server-side: Using localhost backend URL');
    }
}

// Log the API URL being used (helps debug deployment issues)
console.log('🔗 Axios configured with baseURL:', API_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);

// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         (typeof window !== 'undefined' && 
                          (window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('localhost')));
    
    // If it's a custom uploaded image (like /gb_1_timestamp.jpg), always serve from backend
    if (imagePath.match(/^\/[a-z]{2}_[0-9]+_[0-9]+\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
        console.log(`🔗 [getImageUrl] Custom uploaded image from backend: ${API_URL}${imagePath}`);
        return `${API_URL}${imagePath}`;
    }
    
    // In development, serve default images from frontend to avoid CORS issues
    if (isDevelopment) {
        console.log(`🔗 [getImageUrl] Development mode - serving from frontend: ${imagePath}`);
        return imagePath;
    }
    
    // Production logic:
    // If it's a default image (like /1.jpg, /3.jpg, /4.jpg, etc.), serve from frontend
    if (imagePath.match(/^\/[0-9]+\.jpg$/)) {
        console.log(`🔗 [getImageUrl] Production - default image from frontend: ${imagePath}`);
        return imagePath;
    }
    
    // If it's a slider image (like /B/B1/... or /B/B2/...), serve from frontend
    if (imagePath.match(/^\/B\/B[12]\//)) {
        console.log(`🔗 [getImageUrl] Production - slider image from frontend: ${imagePath}`);
        return imagePath;
    }
    
    // For any other image paths, try to serve from frontend first
    console.log(`🔗 [getImageUrl] Fallback - serving from frontend: ${imagePath}`);
    return imagePath;
};

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token from localStorage if available
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    console.log('🔍 Parsed userData from localStorage:', parsed);
                    console.log('🔍 Token in userData:', parsed.token ? 'YES' : 'NO');
                    if (parsed && parsed.token) {
                        config.headers.Authorization = `Bearer ${parsed.token}`;
                        console.log('🔑 Added auth token to request');
                        console.log('🔍 Authorization header:', `Bearer ${parsed.token.substring(0, 20)}...`);
                    } else {
                        console.log('⚠️ No token found in userData');
                    }
                } catch (error) {
                    console.error('❌ Failed to parse userData:', error);
                }
            } else {
                console.log('⚠️ No userData found in localStorage');
            }
        }
        
        console.log('🚀 Axios request:', {
            url: config.url,
            baseURL: config.baseURL,
            fullURL: config.baseURL + config.url,
            withCredentials: config.withCredentials,
            method: config.method?.toUpperCase(),
            hasAuth: !!config.headers.Authorization
        });
        return config;
    },
    (error) => {
        console.error('❌ Axios request error:', error);
        return Promise.reject(error);
    }
);

// Track if we're already redirecting to avoid infinite loops
let isRedirecting = false;

// Add response interceptor to handle errors and account deletion
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if account was deleted OR any 401 error
        if (error.response?.status === 401 && !isRedirecting) {
            console.log('🚨 Authentication failed (401) - clearing session and redirecting to sign in');
            
            // Only redirect if we're not already on sign-in related pages
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                // Avoid bouncing users immediately after social OAuth to dashboard
                const onDashboard = currentPath.toLowerCase().startsWith('/dashboard');
                const isAuthPage = currentPath.includes('/SignIn') || 
                                   currentPath.includes('/SignOut') || 
                                   currentPath.includes('/CreateAccount') ||
                                   currentPath.includes('/ForgotPassword') ||
                                   currentPath.includes('/ResetPassword') ||
                                   currentPath.includes('/contact') ||
                                   currentPath.includes('/about') ||
                                   currentPath === '/' ||
                                   currentPath.match(/^\/[a-z]{2}$/) || // Matches any 2-letter language code like /en, /ar, /de, etc.
                                   currentPath.startsWith('/en/') ||
                                   currentPath.startsWith('/ar/');
                
                // If we're on dashboard and we already have userData locally, don't force redirect;
                // allow a retry flow to re-sync cookies without bouncing the UI.
                const hasLocalUser = !!localStorage.getItem('userData');

                if (!isAuthPage && !(onDashboard && hasLocalUser)) {
                    isRedirecting = true;
                    localStorage.removeItem('userData');
                    // Clear all cookies by setting them to expire
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    // Redirect to sign in
                    window.location.href = '/SignIn';
                    // Reset flag after redirect
                    setTimeout(() => { isRedirecting = false; }, 1000);
                } else {
                    // Just clear the data, don't redirect
                    localStorage.removeItem('userData');
                }
            }
        }
        
        // Don't throw the error - return a rejected promise that won't trigger React error boundary
        return Promise.reject(error);
    }
);

export default axiosInstance;

