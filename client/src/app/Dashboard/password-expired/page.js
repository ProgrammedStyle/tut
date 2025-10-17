"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Alert,
    useTheme
} from '@mui/material';
import {
    LockClock as LockClockIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../slices/loadingSlice';
// Manually controlling loading instead of usePageReady to avoid conflicts

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const PasswordExpired = () => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);
    const hasCalledPageReady = useRef(false);
    const hasHandledSuccess = useRef(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    useEffect(() => {
        // Wait for rendering to complete
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000);
        });
    }, []);

    // Page ready - hides initial loading (ONLY ONCE)
    useEffect(() => {
        if (pageRendered && !hasCalledPageReady.current) {
            hasCalledPageReady.current = true;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dispatch(hideLoading());
                }, 1500);
            });
        }
    }, [pageRendered, dispatch]);

    // When form submits successfully, wait for success view to render before hiding loading
    useEffect(() => {
        if (success && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true;
            // Wait for browser to paint the success view, then add buffer time
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dispatch(hideLoading());
                }, 3500); // Wait 3.5 seconds after paint for complete stability
            });
        }
    }, [success, dispatch]);

    const onSubmit = async (data) => {
        dispatch(showLoading());
        setError(null);
        
        try {
            const response = await axios.put('/api/user/profile', {
                currentPassword: data.currentPassword,
                password: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            
            if (response.data.success) {
                setSuccess(true);
                // Loading will be hidden by useEffect after success view renders
                
                // Then navigate after showing success for 2 seconds
                setTimeout(() => {
                    dispatch(showLoading());
                    router.push('/Dashboard');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update password');
            dispatch(hideLoading()); // Hide loading on error
        }
    };

    if (success) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}>
                <Container maxWidth="sm">
                    <Card sx={{ textAlign: 'center', p: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'success.main' }}>
                            Password Updated Successfully!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Redirecting to dashboard...
                        </Typography>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Card sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <LockClockIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Password Expired
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your password has expired. Please change it to continue.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            margin="normal"
                            {...register('currentPassword')}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword?.message}
                        />

                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            margin="normal"
                            {...register('newPassword')}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message || 'Minimum 6 characters'}
                        />

                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            margin="normal"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, py: 1.5 }}
                        >
                            Change Password
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};

export default PasswordExpired;

