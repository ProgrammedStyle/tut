"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../slices/loadingSlice';
import { setUserData } from '../../slices/userSlice';

const VerifyEmailContent = () => {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                dispatch(showLoading());
                const token = searchParams.get('token');
                
                if (!token) {
                    setStatus('error');
                    setMessage('No verification token provided');
                    return;
                }

                const response = await axios.post('/api/user/verify-email', {
                    token: token
                });

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message);
                    
                    // Update Redux and localStorage with new email immediately
                    if (response.data.user) {
                        dispatch(setUserData(response.data.user));
                        localStorage.setItem('userData', JSON.stringify(response.data.user));
                        console.log('✅ User data updated with new email:', response.data.user);
                    }
                } else {
                    setStatus('error');
                    setMessage(response.data.message);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Failed to verify email address');
            } finally {
                dispatch(hideLoading());
            }
        };

        verifyEmail();
    }, [searchParams, dispatch]);

    const getStatusIcon = () => {
        switch (status) {
            case 'verifying':
                return <CircularProgress size={60} />;
            case 'success':
                return <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main' }} />;
            case 'error':
                return <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />;
            default:
                return <EmailIcon sx={{ fontSize: 60, color: 'primary.main' }} />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'verifying':
                return 'primary';
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            default:
                return 'primary';
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 }
        }}>
            <Container maxWidth="sm">
                <Card sx={{ 
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                            {getStatusIcon()}
                        </Box>
                        
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 'bold', 
                                mb: 2,
                                color: `${getStatusColor()}.main`,
                                fontSize: '2.125rem'
                            }}
                        >
                            {status === 'verifying' && 'Verifying Email...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'error' && 'Verification Failed'}
                        </Typography>

                        {message && (
                            <Alert 
                                severity={getStatusColor()} 
                                sx={{ mb: 3, textAlign: 'left' }}
                            >
                                {message}
                            </Alert>
                        )}

                        {status === 'success' && (
                            <Box>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Your email address has been successfully verified. 
                                    You can now use your new email address for all future communications.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => {
                                        // Force a full page reload to refresh all data
                                        window.location.href = '/Dashboard';
                                    }}
                                    sx={{
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                                        }
                                    }}
                                >
                                    Return to Dashboard
                                </Button>
                            </Box>
                        )}

                        {status === 'error' && (
                            <Box>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    There was an error verifying your email address. 
                                    The verification link may have expired or is invalid.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => router.push('/Dashboard')}
                                    sx={{
                                        background: 'linear-gradient(45deg, #f44336 30%, #ff7043 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #d32f2f 30%, #ff5722 90%)'
                                        }
                                    }}
                                >
                                    Return to Dashboard
                                </Button>
                            </Box>
                        )}

                        {status === 'verifying' && (
                            <Typography variant="body1">
                                Please wait while we verify your email address...
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

const VerifyEmail = () => {
    return (
        <Suspense fallback={
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail;
