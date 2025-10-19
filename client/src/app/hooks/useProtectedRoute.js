import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading } from '../slices/loadingSlice';

export const useProtectedRoute = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    
    // ALWAYS start with true during SSR to prevent hydration mismatch
    // The useEffect will handle the actual auth check on the client
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check authentication immediately if userData is already available
        // Only delay if userData is not yet loaded (e.g., after OAuth)
        const delay = userData ? 0 : 500;
        
        const checkAuthWithDelay = setTimeout(() => {
            let isValid = false;
            
            console.log('🔒 Protected route checking authentication...');
            console.log('📦 Redux userData:', userData);
            
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
                router.replace('/SignIn');
            } else {
                console.log('✅ Authenticated - allowing access');
                setIsAuthenticated(true);
                setIsChecking(false);
            }
        }, delay);

        return () => clearTimeout(checkAuthWithDelay);
    }, [userData, router, dispatch]);

    return { isChecking, isAuthenticated };
};

export default useProtectedRoute;
