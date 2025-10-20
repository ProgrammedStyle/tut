"use client";

import React, { useState, useEffect } from 'react';

// Force dynamic rendering for protected routes
export const dynamic = 'force-dynamic';
import axios from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { showLoading } from '../../slices/loadingSlice';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { usePageReady } from '../../hooks/usePageReady';
import {
    Box, Container, Grid, Card, CardContent, Typography, LinearProgress,
    Paper, useTheme, useMediaQuery, Fade, IconButton, Avatar, CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon, TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon, Visibility as VisibilityIcon,
    People as PeopleIcon, Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const Analytics = () => {
    const { isChecking, isAuthenticated } = useProtectedRoute();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const dispatch = useDispatch();
    
    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS!
    const [analyticsData, setAnalyticsData] = useState({ pageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: 0, topPages: [], trafficSources: [] });
    const [loading, setLoading] = useState(true);
    const [pageRendered, setPageRendered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/analytics/data');
                if (res.data.success) setAnalyticsData(res.data.data);
            } catch (e) {}
            finally { 
                setLoading(false);
                // Wait for data to render before marking as ready
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        setPageRendered(true);
                    }, 1000); // Wait 1000ms after data loads for page to be fully painted
                });
            }
        };
        fetchData();
    }, [dispatch]);

    // Signal when page data is loaded and rendered
    usePageReady(pageRendered);
    
    if (isChecking || !isAuthenticated) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Fade in={true} timeout={800}>
                    <Paper elevation={24} sx={{ 
                        p: 6, 
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        textAlign: 'center',
                        maxWidth: 400
                    }}>
                        <Box sx={{ mb: 3 }}>
                            <CircularProgress 
                                size={60} 
                                thickness={4}
                                sx={{ 
                                    color: '#667eea',
                                    '& .MuiCircularProgress-circle': {
                                        strokeLinecap: 'round'
                                    }
                                }} 
                            />
                        </Box>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1.5
                        }}>
                            {isChecking ? 'Loading Analytics' : 'Redirecting'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isChecking ? 'Please wait while we load your analytics data...' : 'Taking you to the sign in page...'}
                        </Typography>
                    </Paper>
                </Fade>
            </Box>
        );
    }

    const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color }) => (
        <Fade in={true}><Card sx={{ height: '100%' }}><CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: color + '.main', width: 56, height: 56 }}><Icon sx={{ fontSize: 28 }} /></Avatar>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: color + '.main' }}>{value}</Typography>
                    <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {trend > 0 ? <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} /> : <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />}
                <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'medium' }}>
                    {trend > 0 ? '+' : ''}{trend}% from last month
                </Typography>
            </Box>
        </CardContent></Card></Fade>
    );

    const TopPagesCard = () => (<Fade in={true} style={{ transitionDelay: '200ms' }}><Card sx={{ height: '100%' }}><CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Top Pages</Typography>
        {analyticsData.topPages.map((page) => (
            <Box key={page.page} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{page.page}</Typography>
                    <Typography variant="body2" color="text.secondary">{page.views.toLocaleString()} views</Typography>
                </Box>
                <LinearProgress variant="determinate" value={page.percentage} sx={{ height: 8, borderRadius: 4, backgroundColor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: 'primary.main' } }} />
                <Typography variant="caption" color="text.secondary">{page.percentage}%</Typography>
            </Box>
        ))}
    </CardContent></Card></Fade>);

    const TrafficSourcesCard = () => (<Fade in={true} style={{ transitionDelay: '400ms' }}><Card sx={{ height: '100%' }}><CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Traffic Sources</Typography>
        {analyticsData.trafficSources.map((source, index) => (
            <Box key={source.source} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{source.source}</Typography>
                    <Typography variant="body2" color="text.secondary">{source.visitors.toLocaleString()} visitors</Typography>
                </Box>
                <LinearProgress variant="determinate" value={source.percentage} sx={{ height: 8, borderRadius: 4, backgroundColor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : index === 2 ? 'success.main' : 'warning.main' } }} />
                <Typography variant="caption" color="text.secondary">{source.percentage}%</Typography>
            </Box>
        ))}
    </CardContent></Card></Fade>);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fade in={true} timeout={800}>
                    <Paper elevation={24} sx={{ 
                        p: 6, 
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        textAlign: 'center',
                        maxWidth: 400
                    }}>
                        <Box sx={{ mb: 3 }}>
                            <CircularProgress 
                                size={60} 
                                thickness={4}
                                sx={{ 
                                    color: '#667eea',
                                    '& .MuiCircularProgress-circle': {
                                        strokeLinecap: 'round'
                                    }
                                }} 
                            />
                        </Box>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1.5
                        }}>
                            Loading Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Fetching your analytics data...
                        </Typography>
                    </Paper>
                </Fade>
            </Box>
        );
    }

    return (<Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}><Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => {
                dispatch(showLoading());
                router.back();
            }} sx={{ mr: 2, color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}><ArrowBackIcon /></IconButton>
            <Box>
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Analytics</Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>Detailed website performance metrics</Typography>
            </Box>
        </Box></Box>
        {analyticsData.pageViews === 0 ? (
            <Fade in={true}><Card sx={{ mb: 4 }}><CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>No Analytics Data Available</Typography>
                <Typography variant="body1" color="text.secondary">Analytics tracking is active, but no data has been collected yet.</Typography>
            </CardContent></Card></Fade>
        ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}><MetricCard title="Page Views" value={analyticsData.pageViews.toLocaleString()} subtitle="Total views" trend={0} icon={VisibilityIcon} color="primary" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><MetricCard title="Unique Visitors" value={analyticsData.uniqueVisitors.toLocaleString()} subtitle="Individual users" trend={8.3} icon={PeopleIcon} color="secondary" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><MetricCard title="Bounce Rate" value={analyticsData.bounceRate + '%'} subtitle="Single page visits" trend={-5.2} icon={AssessmentIcon} color="warning" /></Grid>
                <Grid item xs={12} sm={6} lg={3}><MetricCard title="Avg Session" value={analyticsData.avgSessionDuration + 'm'} subtitle="Session duration" trend={15.8} icon={TrendingUpIcon} color="success" /></Grid>
            </Grid>
        )}
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>{analyticsData.topPages.length > 0 ? <TopPagesCard /> : <Card><CardContent><Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Top Pages</Typography><Typography variant="body1" color="text.secondary">No data yet.</Typography></CardContent></Card>}</Grid>
            <Grid item xs={12} lg={6}>{analyticsData.trafficSources.length > 0 ? <TrafficSourcesCard /> : <Card><CardContent><Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Traffic Sources</Typography><Typography variant="body1" color="text.secondary">No data yet.</Typography></CardContent></Card>}</Grid>
        </Grid>
    </Container></Box>);
};

export default Analytics;