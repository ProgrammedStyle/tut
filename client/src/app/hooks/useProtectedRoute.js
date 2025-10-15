import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export const useProtectedRoute = () => {
    const router = useRouter();
    const { userData } = useSelector((state) => state.user);
    
    // ALWAYS start with true during SSR to prevent hydration mismatch
    // The useEffect will handle the actual auth check on the client
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Give useAuthPersistence time to load user data from cookie (e.g., after OAuth)
        const checkAuthWithDelay = setTimeout(() => {
            let isValid = false;
            
            // Check if userData exists in Redux
            if (userData && userData.email) {
                isValid = true;
            } else {
                // Check localStorage
                const storedUserData = localStorage.getItem('userData');
                
                if (storedUserData) {
                    try {
                        const parsed = JSON.parse(storedUserData);
                        
                        if (parsed && parsed.email) {
                            isValid = true;
                        }
                    } catch (error) {
                        localStorage.removeItem('userData');
                    }
                }
            }
            
            if (!isValid) {
                setIsAuthenticated(false);
                setIsChecking(false);
                router.replace('/SignIn');
            } else {
                setIsAuthenticated(true);
                setIsChecking(false);
            }
        }, 500); // Wait 500ms for auth persistence to load from cookie

        return () => clearTimeout(checkAuthWithDelay);
    }, [userData, router]);

    return { isChecking, isAuthenticated };
};

export default useProtectedRoute;
