import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading } from '../slices/loadingSlice';
import { setUserData } from '../slices/userSlice';

export const useProtectedRoute = (requireAdmin = false) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { userData } = useSelector((state) => state.user);
    
    // ALWAYS start with true during SSR to prevent hydration mismatch
    // The useEffect will handle the actual auth check on the client
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if this is an OAuth redirect
        const oauthSuccess = searchParams.get('oauth_success');
        const userDataParam = searchParams.get('user_data');
        const googleAuth = searchParams.get('google_auth');
        const facebookAuth = searchParams.get('facebook_auth');
        const isOAuthRedirect = oauthSuccess === 'true' || googleAuth === 'true' || facebookAuth === 'true' || !!userDataParam;
        
        // Check authentication immediately if userData is already available
        // Use longer delay for OAuth redirects to allow state to sync
        const delay = userData ? 0 : (isOAuthRedirect ? 2000 : 1000);
        
        const checkAuthWithDelay = setTimeout(() => {
            let isValid = false;
            let userIsAdmin = false;
            let currentUserData = userData;
            
            console.log('🔒 Protected route checking authentication...');
            console.log('📦 Redux userData:', userData);
            console.log('🔐 Require admin:', requireAdmin);
            console.log('🔄 Is OAuth redirect:', isOAuthRedirect);
            
            // If this is an OAuth redirect with user_data parameter, process it
            if (isOAuthRedirect && userDataParam) {
                try {
                    const decodedUserData = JSON.parse(decodeURIComponent(userDataParam));
                    console.log('🔄 Processing OAuth user_data parameter:', decodedUserData);
                    
                    if (decodedUserData && decodedUserData.email) {
                        // Store the OAuth user data in localStorage and Redux
                        localStorage.setItem('userData', JSON.stringify(decodedUserData));
                        dispatch(setUserData(decodedUserData));
                        currentUserData = decodedUserData;
                        console.log('✅ OAuth user data processed and stored');
                    }
                } catch (error) {
                    console.log('❌ Failed to process OAuth user_data parameter:', error);
                }
            }
            
            // Check if userData exists in Redux
            if (userData && userData.email) {
                console.log('✅ Found userData in Redux');
                isValid = true;
                currentUserData = userData;
                
                // Check admin role if required
                if (requireAdmin) {
                    if (userData.role === 'admin') {
                        console.log('✅ Admin role confirmed in Redux');
                        userIsAdmin = true;
                    } else {
                        console.log('❌ User is not admin in Redux - role:', userData.role);
                        userIsAdmin = false;
                    }
                }
            } else {
                // Check localStorage and restore Redux state if needed
                const storedUserData = localStorage.getItem('userData');
                console.log('💾 localStorage userData:', storedUserData);
                
                if (storedUserData) {
                    try {
                        const parsed = JSON.parse(storedUserData);
                        console.log('📋 Parsed localStorage data:', parsed);
                        
                        if (parsed && parsed.email) {
                            console.log('✅ Found valid userData in localStorage');
                            console.log('🔄 Restoring Redux state from localStorage...');
                            
                            // Restore Redux state from localStorage
                            dispatch(setUserData(parsed));
                            currentUserData = parsed;
                            isValid = true;
                            
                            // Check admin role if required
                            if (requireAdmin) {
                                console.log('🔍 Checking admin role for localStorage user:', parsed.role);
                                if (parsed.role === 'admin') {
                                    console.log('✅ Admin role confirmed in localStorage');
                                    userIsAdmin = true;
                                } else {
                                    console.log('❌ User is not admin in localStorage - role:', parsed.role);
                                    userIsAdmin = false;
                                }
                            }
                        } else {
                            console.log('❌ Parsed data missing email field');
                        }
                    } catch (error) {
                        console.log('❌ Failed to parse localStorage userData:', error);
                        localStorage.removeItem('userData');
                    }
                } else {
                    console.log('❌ No userData found in localStorage');
                }
            }
            
            // Determine if access should be granted
            const shouldGrantAccess = isValid && (!requireAdmin || userIsAdmin);
            
            console.log('🎯 Access decision:', {
                isValid,
                requireAdmin,
                userIsAdmin,
                shouldGrantAccess
            });
            
            if (!shouldGrantAccess) {
                if (!isValid) {
                    console.log('❌ Not authenticated - redirecting to Sign In');
                } else if (requireAdmin && !userIsAdmin) {
                    console.log('❌ Not admin - redirecting to Sign In');
                }
                
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsChecking(false);
                dispatch(showLoading());
                
                // If this is immediately after OAuth, give more time for OAuth processing
                if (isOAuthRedirect) {
                    console.log('🔄 OAuth redirect detected - waiting for OAuth data to be processed...');
                    setTimeout(() => {
                        const retryUser = localStorage.getItem('userData');
                        if (retryUser) {
                            try {
                                const parsed = JSON.parse(retryUser);
                                if (parsed && parsed.email && (!requireAdmin || parsed.role === 'admin')) {
                                    console.log('✅ OAuth retry successful - granting access');
                                    dispatch(setUserData(parsed)); // Restore Redux state
                                    setIsAuthenticated(true);
                                    setIsAdmin(parsed.role === 'admin');
                                    setIsChecking(false);
                                    return;
                                }
                            } catch (error) {
                                console.error('Failed to parse retry user data:', error);
                            }
                        }
                        console.log('❌ OAuth retry failed - redirecting to Sign In');
                        router.replace('/SignIn');
                    }, 3000); // Increased from 1000ms to 3000ms for OAuth processing
                } else {
                    router.replace('/SignIn');
                }
            } else {
                console.log('✅ Access granted');
                setIsAuthenticated(true);
                setIsAdmin(userIsAdmin);
                setIsChecking(false);
            }
        }, delay);

        return () => clearTimeout(checkAuthWithDelay);
    }, [userData, router, dispatch, searchParams, requireAdmin]);

    return { isChecking, isAuthenticated, isAdmin };
};

export default useProtectedRoute;
