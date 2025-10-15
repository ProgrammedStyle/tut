"use client";

import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    LinearProgress,
    Paper,
    Divider,
    useTheme,
    useMediaQuery,
    Fade,
    Slide,
    Zoom,
    Tooltip,
    Badge,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Analytics as AnalyticsIcon,
    AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../slices/userSlice';
import { showLoading, hideLoading } from '../slices/loadingSlice';
import { useRouter } from 'next/navigation';
import axios from '../utils/axios';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { usePasswordExpiry } from '../hooks/usePasswordExpiry';

// Validation schema - checks validation dynamically based on fields filled
const profileSchema = z.object({
    email: z.string().email('Invalid email format'),
    currentPassword: z.string().optional().or(z.literal('')),
    password: z.string().optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal(''))
}).refine((data) => {
    // Only validate password if it's actually being changed (not empty)
    if (data.password && data.password.trim() !== '') {
        // Password must be at least 6 characters
        if (data.password.length < 6) {
            return false;
        }
        // If password is provided, confirmPassword must match
        if (data.password !== data.confirmPassword) {
            return false;
        }
    }
    return true;
}, {
    message: "Password must be at least 6 characters and passwords must match",
    path: ["password"]
});

const Dashboard = () => {
    // Protect this route - redirect to sign in if not authenticated
    const { isChecking, isAuthenticated } = useProtectedRoute();
    // Check if password is expired
    const { checking: checkingPasswordExpiry } = usePasswordExpiry();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Redux state
    const { userData } = useSelector((state) => state.user);
    
    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS!
    // Local state
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVisitors: 0,
        recentUsers: 0,
        userGrowthPercentage: 0,
        visitorsGrowth: 0,
        conversionRate: 0,
        pageViews: 0
    });
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [userHasPassword, setUserHasPassword] = useState(true); // Default to true until we check
    const hasCheckedPassword = useRef(false); // Track if we've already checked
    const [pendingEmail, setPendingEmail] = useState(null); // Track pending email change
    
    // Form setup (MUST be before conditional return!)
    const { register, handleSubmit, formState: { errors }, reset, watch, setError } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            email: userData?.email || '',
            password: '',
            confirmPassword: '',
            currentPassword: ''
        }
    });
    
    const watchedPassword = watch('password');

    // Fetch user data to ensure we have hasPassword field
    useEffect(() => {
        // Skip if we've already checked
        if (hasCheckedPassword.current) {
            return;
        }
        
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/me');
                if (response.data.success && response.data.user) {
                    const updatedUserData = {
                        email: response.data.user.email,
                        id: response.data.user.id,
                        hasPassword: response.data.user.hasPassword,
                        pendingEmail: response.data.user.pendingEmail
                    };
                    dispatch(setUserData(updatedUserData));
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));
                    setUserHasPassword(response.data.user.hasPassword === true);
                    setPendingEmail(response.data.user.pendingEmail || null);
                    hasCheckedPassword.current = true;
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                hasCheckedPassword.current = true; // Mark as checked even on error
            }
        };
        
        // Only fetch if userData exists but doesn't have hasPassword property
        if (userData && userData.hasPassword === undefined && !hasCheckedPassword.current) {
            fetchUserData();
        } else if (userData && userData.hasPassword !== undefined && !hasCheckedPassword.current) {
            setUserHasPassword(userData.hasPassword === true);
            setPendingEmail(userData.pendingEmail || null);
            hasCheckedPassword.current = true;
        }
    }, [userData, dispatch]);

    // Fetch real statistics (useEffect MUST be before conditional return!)
    useEffect(() => {
        const fetchStats = async () => {
            const startTime = Date.now();
            try {
                const response = await axios.get('/api/user/stats');
                
                if (response.data.success) {
                    setStats(response.data.data);
                } else {
                    setStats({
                        totalUsers: 0,
                        totalVisitors: 0,
                        recentUsers: 0,
                        userGrowthPercentage: 0,
                        visitorsGrowth: 0,
                        conversionRate: 0,
                        pageViews: 0
                    });
                }
            } catch (error) {
                // Silently handle error and set empty data
                setStats({
                    totalUsers: 0,
                    totalVisitors: 0,
                    recentUsers: 0,
                    userGrowthPercentage: 0,
                    visitorsGrowth: 0,
                    conversionRate: 0,
                    pageViews: 0
                });
            } finally {
                // Don't hide loading here - UniversalLoadingHandler will handle it
                setLoading(false);
            }
        };

        // Call fetchStats immediately (no delay)
        fetchStats();
    }, [dispatch]);
    
    // Don't render the page while checking authentication or password expiry
    if (isChecking || checkingPasswordExpiry || !isAuthenticated) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {isChecking ? 'Loading...' : 'Redirecting...'}
                    </Typography>
                </Container>
            </Box>
        );
    }

    // Handle profile update - v2.0 Updated error handling
    const handleProfileUpdate = (data) => {
        // Check if user has a password directly from userData
        const hasPassword = userData?.hasPassword === true;
        
        console.log('=== FRONTEND SUBMIT DEBUG ===');
        console.log('userData:', userData);
        console.log('hasPassword:', hasPassword);
        console.log('Submitting password?', !!data.password);
        console.log('Submitting currentPassword?', !!data.currentPassword);
        console.log('Form data:', data);
        
        // Clean the data - remove empty password fields
        const cleanedData = {
            email: data.email
        };
        
        // Only include password fields if they're actually filled
        if (data.password && data.password.trim() !== '') {
            // If user has a password and is trying to change it, they need current password
            if (hasPassword && !data.currentPassword) {
                console.log('Frontend validation FAILED - current password required');
                setError('currentPassword', {
                    type: 'manual',
                    message: 'Current password is required to change password'
                });
                return;
            }
            
            cleanedData.password = data.password;
            if (data.currentPassword) {
                cleanedData.currentPassword = data.currentPassword;
            }
        }
        
        console.log('Frontend validation PASSED - submitting to server...');
        console.log('Cleaned data:', cleanedData);
        dispatch(showLoading());
        
        axios.put('/api/user/profile', cleanedData)
        .then(response => {
            if (response.data.success) {
                console.log('=== FRONTEND PROFILE UPDATE RESPONSE ===');
                console.log('Response from server:', response.data);
                console.log('User email from server:', response.data.user.email);
                console.log('Pending email from server:', response.data.user.pendingEmail);
                
                // Create updated user data
                const updatedUserData = {
                    id: response.data.user.id,
                    email: response.data.user.email, // This is the CURRENT (old) email, not the pending one
                    hasPassword: response.data.user.hasPassword,
                    pendingEmail: response.data.user.pendingEmail || null
                };
                
                console.log('Saving to Redux/localStorage:', updatedUserData);
                
                // Update Redux state and localStorage with correct data
                dispatch(setUserData(updatedUserData));
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                
                // Update hasPassword state if password was changed
                if (cleanedData.password && response.data.user.hasPassword !== undefined) {
                    setUserHasPassword(response.data.user.hasPassword);
                }
                
                // Close dialog and reset form
                setEditDialogOpen(false);
                setIsEditing(false);
                reset();
                
                // If email was changed, redirect to verification page
                if (response.data.user.pendingEmail) {
                    setPendingEmail(response.data.user.pendingEmail);
                    router.push('/Dashboard/email-verification-sent');
                } else {
                    // Show success message for other changes (e.g., password)
                    setSnackbar({
                        open: true,
                        message: response.data.message,
                        severity: 'success'
                    });
                }
            }
        })
        .catch(error => {
            // Handle error gracefully without throwing
            let errorMessage = 'Failed to update profile. Please try again.';
            
            console.error('Profile update error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        })
        .finally(() => {
            dispatch(hideLoading());
        });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditDialogOpen(false);
        setIsEditing(false);
        reset();
    };

    // Statistics Card Component
    const StatCard = ({ title, value, change, icon: Icon, color, delay = 0 }) => (
        <Zoom in={true} style={{ transitionDelay: `${delay}ms` }}>
            <Card 
                sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        transform: 'translate(30px, -30px)'
                    }
                }}
            >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <Icon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Chip
                            icon={change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            label={`${change > 0 ? '+' : ''}${change}%`}
                            color={change > 0 ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ 
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {value.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {title}
                    </Typography>
                </CardContent>
            </Card>
        </Zoom>
    );

    // Profile Card Component
    const ProfileCard = () => (
        <Slide direction="up" in={true}>
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                            <AccountCircleIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {userData?.email || 'User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Registered User
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            Personal Information
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography variant="body1">{userData?.email || 'N/A'}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LockIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography variant="body1">••••••••</Typography>
                        </Box>
                    </Box>
                    
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setEditDialogOpen(true)}
                        fullWidth
                        sx={{ 
                            py: 1.5,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                            }
                        }}
                    >
                        Edit Profile
                    </Button>
                </CardContent>
            </Card>
        </Slide>
    );

    if (loading) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Container maxWidth="xl">
                    <Paper sx={{ p: 4, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
                        <Typography variant="h6">Loading dashboard...</Typography>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Fade in={true}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography 
                            variant={isMobile ? "h4" : "h3"} 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: 'white',
                                mb: 1,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            Dashboard
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Welcome back! Here&apos;s what&apos;s happening with your website.
                        </Typography>
                    </Box>
                </Fade>

                {/* Pending Email Verification Alert */}
                {pendingEmail && (
                    <Fade in={true}>
                        <Alert 
                            severity="warning" 
                            sx={{ 
                                mb: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)'
                            }}
                            icon={<EmailIcon />}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Email Verification Pending
                            </Typography>
                            <Typography variant="body2">
                                A verification email has been sent to <strong>{pendingEmail}</strong>. 
                                Please check your inbox and click the verification link to complete the email change.
                            </Typography>
                        </Alert>
                    </Fade>
                )}

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Total Visitors"
                                value={stats.totalVisitors}
                                change={stats.visitorsGrowth}
                                icon={VisibilityIcon}
                                color="primary"
                                delay={0}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Registered Users"
                                value={stats.totalUsers}
                                change={stats.userGrowthPercentage}
                                icon={PeopleIcon}
                                color="secondary"
                                delay={100}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Page Views"
                                value={stats.pageViews}
                                change={15.2}
                                icon={AnalyticsIcon}
                                color="success"
                                delay={200}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Conversion Rate"
                                value={stats.conversionRate}
                                change={-2.1}
                                icon={TrendingUpIcon}
                                color="warning"
                                delay={300}
                            />
                        </Grid>
                    </Grid>

                {/* Main Content */}
                <Grid container spacing={3}>
                    {/* Profile Card */}
                    <Grid item xs={12} lg={4}>
                        <ProfileCard />
                    </Grid>
                    
                    {/* Additional Info Card */}
                    <Grid item xs={12} lg={8}>
                        <Slide direction="right" in={true} style={{ transitionDelay: '400ms' }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                        Quick Actions
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Paper 
                                                sx={{ 
                                                    p: 2, 
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: theme.shadows[8]
                                                    }
                                                }}
                                                onClick={() => {
                                                    router.push('/Dashboard/analytics');
                                                }}
                                            >
                                                <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                                <Typography variant="h6">Analytics</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    View detailed analytics
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Paper 
                                                sx={{ 
                                                    p: 2, 
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: theme.shadows[8]
                                                    }
                                                }}
                                                onClick={() => {
                                                    router.push('/Dashboard/users');
                                                }}
                                            >
                                                <PeopleIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                                                <Typography variant="h6">Users</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Manage user accounts
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Paper 
                                                sx={{ 
                                                    p: 2, 
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: theme.shadows[8]
                                                    }
                                                }}
                                                onClick={() => {
                                                    router.push('/Dashboard/content-management');
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                                <Typography variant="h6">Content Management</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Edit website content
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Slide>
                    </Grid>
                </Grid>

                {/* Edit Profile Dialog */}
                <Dialog 
                    open={editDialogOpen} 
                    onClose={handleCancelEdit}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        Edit Profile
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(handleProfileUpdate)} id="profile-edit-form">
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Box>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    {userHasPassword ? 'Change Password (Optional)' : 'Set Password (Optional)'}
                                </Typography>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    {userHasPassword 
                                        ? 'Leave these fields empty if you don\'t want to change your password'
                                        : 'You signed in with social media. You can optionally set a password to enable email/password login'
                                    }
                                </Alert>
                                
                                {userHasPassword && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            type="password"
                                            margin="normal"
                                            {...register('currentPassword')}
                                            error={!!errors.currentPassword}
                                            helperText={errors.currentPassword?.message || 'Enter your current password'}
                                            InputProps={{
                                                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            }}
                                        />
                                        <Box sx={{ mt: 1, textAlign: 'right' }}>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setEditDialogOpen(false);
                                                    router.push('/ForgotPassword');
                                                }}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                Forgot your password?
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                                
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    margin="normal"
                                    {...register('password')}
                                    error={!!errors.password}
                                    helperText={errors.password?.message || 'Minimum 6 characters'}
                                    InputProps={{
                                        startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                                
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    margin="normal"
                                    {...register('confirmPassword')}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message || 'Re-enter your new password to confirm'}
                                    InputProps={{
                                        startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Box>
                        </form>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button 
                            onClick={handleCancelEdit}
                            startIcon={<CancelIcon />}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit(handleProfileUpdate)}
                            startIcon={<SaveIcon />}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

// Wrap with ErrorBoundary to suppress development error overlay
const DashboardWithErrorBoundary = () => (
    <ErrorBoundary>
        <Dashboard />
    </ErrorBoundary>
);

export default DashboardWithErrorBoundary;
