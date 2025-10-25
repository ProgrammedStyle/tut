import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useAdminCheck = () => {
    const { userData } = useSelector((state) => state.user);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdminRole = () => {
            console.log('🔐 Checking admin role...');
            console.log('📦 Redux userData:', userData);
            
            // Check Redux first
            if (userData && userData.role === 'admin') {
                console.log('✅ Admin role found in Redux');
                setIsAdmin(true);
                setIsChecking(false);
                return;
            }
            
            // Check localStorage as fallback
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                try {
                    const parsed = JSON.parse(storedUserData);
                    if (parsed && parsed.role === 'admin') {
                        console.log('✅ Admin role found in localStorage');
                        setIsAdmin(true);
                        setIsChecking(false);
                        return;
                    }
                } catch (error) {
                    console.error('❌ Failed to parse localStorage userData:', error);
                }
            }
            
            console.log('❌ No admin role found');
            setIsAdmin(false);
            setIsChecking(false);
        };

        // Small delay to ensure userData is loaded
        const timeoutId = setTimeout(checkAdminRole, 100);
        
        return () => clearTimeout(timeoutId);
    }, [userData]);

    return { isAdmin, isChecking };
};

export default useAdminCheck;
