import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../slices/userSlice';
import axios from '../utils/axios';

export const useAuthPersistence = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const loadAuthState = async () => {
            // Only load if userData is not already set
            if (userData) {
                return;
            }

            // Always fetch fresh data from server to ensure we have the latest hasPassword value
            try {
                console.log('Fetching fresh user data from server...');
                const response = await axios.get('/api/user/me');
                
                if (response.data.success && response.data.user) {
                    console.log('Found authenticated user:', response.data.user);
                    const userData = {
                        email: response.data.user.email,
                        id: response.data.user.id,
                        hasPassword: response.data.user.hasPassword
                    };
                    dispatch(setUserData(userData));
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            } catch (error) {
                // No cookie or not authenticated - check localStorage as fallback
                console.log('No authentication cookie, checking localStorage...');
                const storedUserData = localStorage.getItem('userData');
                
                if (storedUserData && storedUserData !== 'null' && storedUserData !== 'undefined') {
                    try {
                        const parsedUserData = JSON.parse(storedUserData);
                        
                        // Validate that parsed data has required fields
                        if (parsedUserData && parsedUserData.email) {
                            console.log('Restoring user data from localStorage:', parsedUserData);
                            dispatch(setUserData(parsedUserData));
                        } else {
                            console.log('Invalid user data in localStorage, removing it');
                            localStorage.removeItem('userData');
                        }
                    } catch (error) {
                        localStorage.removeItem('userData');
                    }
                }
            }
        };

        loadAuthState();
    }, [dispatch, userData]);

    return null;
};

export default useAuthPersistence;
