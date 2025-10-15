"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    AdminPanelSettings as AdminIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../slices/loadingSlice';
import { clearUserData } from '../../slices/userSlice';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

const Users = () => {
    // Protect this route - redirect to sign in if not authenticated
    const { isChecking, isAuthenticated } = useProtectedRoute();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    
    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS!
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Define fetchUsers BEFORE useEffect so it can be called
    const fetchUsers = async () => {
        const startTime = Date.now();
        try {
            const response = await axios.get('/api/user/list');
            
            if (response.data.success) {
                setUsers(response.data.data.users.map(user => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.updatedAt, // Using updatedAt as proxy for last login
                    status: user.status
                })));
            }
        } catch (error) {
            // Silently handle error and show empty state
            setUsers([]);
        } finally {
            // Don't hide loading here - UniversalLoadingHandler will handle it
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    // Don't render the page while checking authentication
    if (isChecking || !isAuthenticated) {
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

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'primary';
            case 'user': return 'secondary';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleExportUsers = async () => {
        dispatch(showLoading());
        try {
            const response = await axios.get('/api/user/export', {
                responseType: 'blob'
            });
            
            // Create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `users_export_${timestamp}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setSnackbar({
                open: true,
                message: 'Users exported successfully!',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Export feature coming soon!',
                severity: 'info'
            });
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleUserAction = (user, action) => {
        setSelectedUser({ ...user, action });
        setActionDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        // Check if trying to delete yourself
        if (userData && selectedUser.email === userData.email) {
            setSnackbar({
                open: true,
                message: 'You cannot delete your own account!',
                severity: 'error'
            });
            setActionDialogOpen(false);
            return;
        }
        
        dispatch(showLoading());
        try {
            const response = await axios.delete(`/api/user/${selectedUser.id}`);
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: `User ${selectedUser.email} deleted successfully`,
                    severity: 'success'
                });
                // Refresh the user list
                fetchUsers();
                setActionDialogOpen(false);
                setSelectedUser(null);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete user';
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            setActionDialogOpen(false);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedUser) return;
        
        const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
        
        dispatch(showLoading());
        try {
            const response = await axios.put(`/api/user/${selectedUser.id}/status`, {
                status: newStatus
            });
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: `User ${selectedUser.email} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
                    severity: 'success'
                });
                // Refresh the user list
                fetchUsers();
                setActionDialogOpen(false);
                setSelectedUser(null);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update user status';
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            setActionDialogOpen(false);
        } finally {
            dispatch(hideLoading());
        }
    };

    const UserRow = ({ user }) => (
        <TableRow hover>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <PersonIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role)}
                    size="small"
                    icon={user.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                />
            </TableCell>
            <TableCell>
                <Chip 
                    label={user.status} 
                    color={getStatusColor(user.status)}
                    size="small"
                    icon={user.status === 'active' ? <CheckCircleIcon /> : <BlockIcon />}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {formatDate(user.createdAt)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {formatDate(user.lastLogin)}
                </Typography>
            </TableCell>
            <TableCell>
                <IconButton 
                    size="small"
                    onClick={() => handleUserAction(user, 'manage')}
                >
                    <MoreVertIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    // Loading screen removed - using UniversalLoadingHandler
    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                            onClick={() => {
                                router.back();
                            }}
                            sx={{ 
                                mr: 2, 
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography 
                                variant={isMobile ? "h4" : "h3"} 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: 'white',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                User Management
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                Manage user accounts and permissions
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Button 
                        variant="contained"
                        onClick={handleExportUsers}
                        sx={{ 
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        Export Users
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        {users.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Users
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} style={{ transitionDelay: '100ms' }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                        {users.filter(u => u.status === 'active').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Users
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} style={{ transitionDelay: '200ms' }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                                        {users.filter(u => u.role === 'admin').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Administrators
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} style={{ transitionDelay: '300ms' }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                                        {users.filter(u => u.status === 'inactive').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Inactive Users
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>

                {/* Search */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <TextField
                            fullWidth
                            placeholder="Search users by email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Fade in={true} style={{ transitionDelay: '400ms' }}>
                    <Card>
                        <CardContent sx={{ p: 0 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Joined</TableCell>
                                            <TableCell>Last Login</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <UserRow key={user.id} user={user} />
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {searchTerm ? 'No users found matching your search.' : 'No users registered yet. Create an account to see users here!'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Action Dialog */}
                <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Manage User
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            What would you like to do with <strong>{selectedUser?.email}</strong>?
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Current Status:
                            </Typography>
                            <Chip 
                                label={selectedUser?.status || 'active'} 
                                size="small" 
                                color={getStatusColor(selectedUser?.status || 'active')} 
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button 
                            onClick={() => setActionDialogOpen(false)}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleToggleStatus}
                            variant="contained"
                            color={selectedUser?.status === 'active' ? 'warning' : 'success'}
                        >
                            {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'} User
                        </Button>
                        <Button 
                            onClick={handleDeleteUser}
                            variant="contained"
                            color="error"
                        >
                            Delete User
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default Users;