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
                    await axios.post('/api/analytics/track', {
                        path: pathname,
                        sessionId
                    });
                    
                    console.log('Page view tracked:', pathname);
                }
            } catch (error) {
                // Silently fail - don't block the app if tracking fails
                console.error('Failed to track page view:', error);
            }
        };

        trackPageView();
    }, [pathname]);
};

export default usePageTracking;
