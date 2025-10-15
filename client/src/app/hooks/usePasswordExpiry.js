import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../utils/axios';

export const usePasswordExpiry = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkPasswordExpiry = async () => {
            try {
                // Make a request to check if password is expired
                const response = await axios.get('/api/user/me');
                
                console.log('Password expiry check response:', response.data);
                
                if (response.data.passwordExpired) {
                    console.log('PASSWORD EXPIRED - redirecting to password-expired page');
                    router.push('/Dashboard/password-expired');
                } else {
                    console.log('Password is still valid');
                }
            } catch (error) {
                console.error('Password expiry check error:', error);
            } finally {
                setChecking(false);
            }
        };

        checkPasswordExpiry();
        
        // Check every 10 seconds
        const interval = setInterval(checkPasswordExpiry, 10000);
        
        return () => clearInterval(interval);
    }, [router]);

    return { checking };
};

