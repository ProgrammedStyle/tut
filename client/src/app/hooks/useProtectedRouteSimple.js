// Alternative approach: Check localStorage first, then Redux
// This ensures we always have the most up-to-date user data

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading } from '../slices/loadingSlice';
import { setUserData } from '../slices/userSlice';

export const useProtectedRouteSimple = (requireAdmin = false) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { userData } = useSelector((state) => state.user);
    
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            console.log('🔒 Simple auth check starting...');
            
            // Always check localStorage first (most reliable)
            const storedUserData = localStorage.getItem('userData');
            let currentUserData = null;
            
            if (storedUserData) {
                try {
                    currentUserData = JSON.parse(storedUserData);
                    console.log('✅ Found userData in localStorage:', currentUserData);
                    
                    // Restore Redux state if needed
                    if (!userData || !userData.email) {
                        console.log('🔄 Restoring Redux state...');
                        dispatch(setUserData(currentUserData));
                    }
                } catch (error) {
                    console.error('❌ Failed to parse localStorage:', error);
                    localStorage.removeItem('userData');
                    currentUserData = null;
                }
            }
            
            // If no localStorage data, check Redux
            if (!currentUserData && userData && userData.email) {
                currentUserData = userData;
                console.log('✅ Using Redux userData:', currentUserData);
            }
            
            // Determine authentication status
            const isValid = currentUserData && currentUserData.email;
            const userIsAdmin = currentUserData && currentUserData.role === 'admin';
            const shouldGrantAccess = isValid && (!requireAdmin || userIsAdmin);
            
            console.log('🎯 Simple auth decision:', {
                isValid,
                requireAdmin,
                userIsAdmin,
                shouldGrantAccess,
                userRole: currentUserData?.role
            });
            
            if (shouldGrantAccess) {
                console.log('✅ Access granted');
                setIsAuthenticated(true);
                setIsAdmin(userIsAdmin);
                setIsChecking(false);
            } else {
                console.log('❌ Access denied - redirecting to Sign In');
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsChecking(false);
                dispatch(showLoading());
                router.replace('/SignIn');
            }
        };

        // Small delay to ensure everything is loaded
        const timeoutId = setTimeout(checkAuth, 100);
        
        return () => clearTimeout(timeoutId);
    }, [userData, router, dispatch, requireAdmin]);

    return { isChecking, isAuthenticated, isAdmin };
};

export default useProtectedRouteSimple;
