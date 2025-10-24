import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from '../utils/axios';

// Generate or get session ID
const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
};

export const usePageTracking = () => {
    const pathname = usePathname();

    useEffect(() => {
        const trackPageView = async () => {
            try {
                const sessionId = getSessionId();
                
                if (sessionId) {
                    console.log('📊 Tracking page view:', { path: pathname, sessionId });
                    
                    const response = await axios.post('/api/analytics/track', {
                        path: pathname,
                        sessionId
                    });
                    
                    console.log('✅ Page view tracked successfully:', pathname, response.data);
                } else {
                    console.warn('⚠️ No session ID available for tracking');
                }
            } catch (error) {
                // Log detailed error information for debugging
                console.error('❌ Failed to track page view:', {
                    path: pathname,
                    error: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                    baseURL: error.config?.baseURL
                });
            }
        };

        trackPageView();
    }, [pathname]);
};

export default usePageTracking;
