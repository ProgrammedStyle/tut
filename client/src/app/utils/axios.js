import axios from 'axios';

// Get the API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Log the API URL being used (helps debug deployment issues)
console.log('🔗 Axios configured with baseURL:', API_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to log outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🚀 Axios request:', {
            url: config.url,
            baseURL: config.baseURL,
            fullURL: config.baseURL + config.url,
            withCredentials: config.withCredentials,
            method: config.method?.toUpperCase()
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
                const isAuthPage = currentPath.includes('/SignIn') || 
                                   currentPath.includes('/SignOut') || 
                                   currentPath.includes('/CreateAccount') ||
                                   currentPath.includes('/ForgotPassword') ||
                                   currentPath.includes('/ResetPassword') ||
                                   currentPath === '/' ||
                                   currentPath.match(/^\/[a-z]{2}$/) || // Matches any 2-letter language code like /en, /ar, /de, etc.
                                   currentPath.startsWith('/en/') ||
                                   currentPath.startsWith('/ar/');
                
                if (!isAuthPage) {
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

