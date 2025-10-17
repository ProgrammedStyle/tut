"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../slices/userSlice';
import { showLoading, hideLoading } from '../slices/loadingSlice';
import axios from '../utils/axios';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { usePageReady } from '../hooks/usePageReady';

const SignOut = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [pageRendered, setPageRendered] = useState(false);

    useEffect(() => {
        const performSignOut = async () => {
            try {
                dispatch(showLoading());

                console.log('=== SIGNING OUT ===');
                console.log('Current localStorage before clear:', localStorage.getItem('userData'));

                // Call backend to clear cookie
                await axios.post('/api/user/signout', {});

                console.log('Backend signout successful');

                // Clear Redux state
                dispatch(clearUserData());
                console.log('Redux cleared');

                // Clear ALL localStorage (to be absolutely sure)
                localStorage.clear();
                console.log('localStorage cleared completely');

                // Verify it's cleared
                console.log('localStorage after clear:', localStorage.getItem('userData'));

                // Redirect to home - keep loading visible during navigation
                console.log('Redirecting to home page...');
                dispatch(showLoading());
                router.push('/');
            } catch (error) {
                console.error('Sign out error:', error);
                // Even if backend fails, clear local state and redirect
                dispatch(clearUserData());
                localStorage.clear();
                console.log('Emergency clear - localStorage and Redux cleared');
                dispatch(showLoading());
                router.push('/');
            }
            // Don't hide loading in finally - let the next page hide it
        };

        performSignOut();
    }, [dispatch, router]);

    // This page shows briefly before redirect, mark as rendered
    useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000);
        });
    }, []);

    usePageReady(pageRendered);

    return (
        <Box sx={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: { xs: 2, sm: 3 }
        }}>
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: 'white', mb: 2, width: '50px', height: '50px' }} />
                <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem' }}>
                    Signing out...
                </Typography>
            </Container>
        </Box>
    );
};

export default SignOut;
