import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading } from '../slices/loadingSlice';

export const useProtectedRoute = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { userData } = useSelector((state) => state.user);
    
    // ALWAYS start with true during SSR to prevent hydration mismatch
    // The useEffect will handle the actual auth check on the client
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check if this is an OAuth redirect
        const oauthSuccess = searchParams.get('oauth_success');
        const isOAuthRedirect = oauthSuccess === 'true';
        
        // Check authentication immediately if userData is already available
        // Use longer delay for OAuth redirects to allow state to sync
        const delay = userData ? 0 : (isOAuthRedirect ? 1400 : 500);
        
        const checkAuthWithDelay = setTimeout(() => {
            let isValid = false;
            
            console.log('🔒 Protected route checking authentication...');
            console.log('📦 Redux userData:', userData);
            console.log('🔄 Is OAuth redirect:', isOAuthRedirect);
            
            // Check if userData exists in Redux
            if (userData && userData.email) {
                console.log('✅ Found userData in Redux');
                isValid = true;
            } else {
                // Check localStorage
                const storedUserData = localStorage.getItem('userData');
                console.log('💾 localStorage userData:', storedUserData);
                
                if (storedUserData) {
                    try {
                        const parsed = JSON.parse(storedUserData);
                        
                        if (parsed && parsed.email) {
                            console.log('✅ Found valid userData in localStorage');
                            isValid = true;
                        }
                    } catch (error) {
                        console.log('❌ Failed to parse localStorage userData');
                        localStorage.removeItem('userData');
                    }
                }
            }
            
            if (!isValid) {
                console.log('❌ Not authenticated - redirecting to Sign In');
                setIsAuthenticated(false);
                setIsChecking(false);
                dispatch(showLoading());
                // If this is immediately after OAuth, give one last short grace period
                if (isOAuthRedirect) {
                    setTimeout(() => {
                        const retryUser = localStorage.getItem('userData');
                        if (retryUser) {
                            setIsAuthenticated(true);
                            setIsChecking(false);
                            return;
                        }
                        router.replace('/SignIn');
                    }, 500);
                } else {
                    router.replace('/SignIn');
                }
            } else {
                console.log('✅ Authenticated - allowing access');
                setIsAuthenticated(true);
                setIsChecking(false);
            }
        }, delay);

        return () => clearTimeout(checkAuthWithDelay);
    }, [userData, router, dispatch, searchParams]);

    return { isChecking, isAuthenticated };
};

export default useProtectedRoute;
