"use client";

import React from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Alert
} from '@mui/material';
import {
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const EmailVerificationSent = () => {
    const router = useRouter();
    const { userData } = useSelector((state) => state.user);
    const pendingEmail = userData?.pendingEmail;

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 2
        }}>
            <Container maxWidth="sm">
                <Card sx={{ 
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 3 }}>
                            <EmailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                        </Box>
                        
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 'bold', 
                                mb: 2,
                                color: 'primary.main'
                            }}
                        >
                            Verification Email Sent!
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Please check your email inbox
                            </Typography>
                            <Typography variant="body2">
                                We've sent a verification link to:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                                {pendingEmail || 'your new email address'}
                            </Typography>
                        </Alert>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                📧 Click the link in the email to complete your email address change.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                The verification link will expire in 15 minutes.
                            </Typography>
                        </Box>

                        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, textAlign: 'left' }}>
                            <Typography variant="body2">
                                Your current email address ({userData?.email}) is still active and will remain so until you verify the new email.
                            </Typography>
                        </Alert>

                        <Button 
                            variant="contained" 
                            size="large"
                            fullWidth
                            onClick={() => router.push('/Dashboard')}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                                }
                            }}
                        >
                            Return to Dashboard
                        </Button>

                        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                            Didn't receive the email? Check your spam folder or try changing your email again.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default EmailVerificationSent;

