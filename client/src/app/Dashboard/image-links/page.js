"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Container, Card, CardContent, Typography, TextField, Button, 
    Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Alert,
    Snackbar, CircularProgress, Paper, Chip, Fade
} from '@mui/material';
import {
    Save as SaveIcon, Delete as DeleteIcon, Link as LinkIcon,
    ArrowBack as ArrowBackIcon, Image as ImageIcon, Language as LanguageIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../slices/loadingSlice';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { usePageReady } from '../../hooks/usePageReady';
import axios from '../../utils/axios';
import Image from 'next/image';

const ImageLinksManagement = () => {
    const { isChecking, isAuthenticated } = useProtectedRoute();
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [selectedLanguage, setSelectedLanguage] = useState('gb');
    const [imageLinks, setImageLinks] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageRendered, setPageRendered] = useState(false);
    
    // Define the 10 images
    const routes = [
        { id: 1, name: "Damascus Gate", ar: "باب العامود", img: '/1.jpg' },
        { id: 2, name: "Al-Aqsa Mosque", ar: "المسجد الاقصى", img: '/3.jpg' },
        { id: 3, name: "Holy Sepulchre", ar: "كنيسة القيامة", img: '/4.jpg' },
        { id: 4, name: "Jaffa Gate", ar: "باب الخليل", img: '/5.jpg' },
        { id: 5, name: "Muslim Quarter", ar: "الحي الاسلامي", img: '/6.jpg' },
        { id: 6, name: "Markets", ar: "الاسواق", img: '/7.jpg' },
        { id: 7, name: "Via Dolorosa", ar: "طريق الالام", img: '/8.jpg' },
        { id: 8, name: "New Gate", ar: "باب الجديد", img: '/9.jpg' },
        { id: 9, name: "Armenian Quarter", ar: "الحي الارمني", img: '/10.jpg' },
        { id: 10, name: "Dung Gate", ar: "باب المغاربة", img: '/11.jpg' }
    ];
    
    const languages = [
        { code: 'sa', name: 'العربية (Arabic)', flag: '🇸🇦' },
        { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
        { code: 'gb', name: 'English (UK)', flag: '🇬🇧' },
        { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
        { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
        { code: 'ir', name: 'فارسی (Persian)', flag: '🇮🇷' },
        { code: 'pk', name: 'اردو (Urdu)', flag: '🇵🇰' },
        { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
        { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
        { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
        { code: 'in', name: 'हिन्दी (Hindi)', flag: '🇮🇳' }
    ];
    
    usePageReady(pageRendered);
    
    // Fetch image links for the selected language
    useEffect(() => {
        fetchImageLinks();
    }, [selectedLanguage]);
    
    const fetchImageLinks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/image-links?language=${selectedLanguage}`);
            if (response.data.success) {
                setImageLinks(response.data.data || {});
            }
        } catch (error) {
            console.error('Error fetching image links:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load image links',
                severity: 'error'
            });
        } finally {
            setLoading(false);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setPageRendered(true);
                }, 500);
            });
        }
    };
    
    const handleLinkChange = (imageId, value) => {
        setImageLinks(prev => ({
            ...prev,
            [imageId]: value
        }));
    };
    
    const handleSaveLink = async (imageId) => {
        try {
            setSaving(true);
            const link = imageLinks[imageId] || null;
            
            const response = await axios.put('/api/image-links', {
                imageId,
                language: selectedLanguage,
                link: link === '' ? null : link
            });
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: 'Link saved successfully!',
                    severity: 'success'
                });
                // Refresh data
                await fetchImageLinks();
            }
        } catch (error) {
            console.error('Error saving link:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to save link',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };
    
    const handleRemoveLink = async (imageId) => {
        try {
            setSaving(true);
            const response = await axios.delete(`/api/image-links?imageId=${imageId}&language=${selectedLanguage}`);
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: 'Link removed successfully!',
                    severity: 'success'
                });
                // Refresh data
                await fetchImageLinks();
            }
        } catch (error) {
            console.error('Error removing link:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to remove link',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };
    
    if (isChecking || !isAuthenticated) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CircularProgress size={60} sx={{ color: 'white' }} />
            </Box>
        );
    }
    
    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CircularProgress size={60} sx={{ color: 'white' }} />
            </Box>
        );
    }
    
    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                            onClick={() => {
                                dispatch(showLoading());
                                router.push('/Dashboard');
                            }}
                            sx={{ mr: 2, color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                Manage Image Links
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                Set clickable links for home page images by language
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Language Selector */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                            Select Language
                        </Typography>
                        <FormControl sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: 2 }}>
                            <Select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                startAdornment={<LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                sx={{
                                    '& .MuiSelect-select': {
                                        py: 1.5,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                }}
                            >
                                {languages.map(lang => (
                                    <MenuItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                
                {/* Info Alert */}
                <Fade in={true}>
                    <Alert 
                        severity="info" 
                        sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.95)' }}
                        icon={<LinkIcon />}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            How to use:
                        </Typography>
                        <Typography variant="body2">
                            • Enter a URL (starting with http:// or https://) to make an image clickable<br/>
                            • Leave blank or remove to make an image non-clickable<br/>
                            • Links are language-specific - set different links for different languages<br/>
                            • Click "Save Link" after entering/modifying a URL
                        </Typography>
                    </Alert>
                </Fade>
                
                {/* Image Cards Grid */}
                <Grid container spacing={3}>
                    {routes.map((route, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={route.id}>
                            <Fade in={true} timeout={300 + index * 100}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Image */}
                                    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                        <Image
                                            src={route.img}
                                            alt={route.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <Chip 
                                                label={`#${route.id}`} 
                                                sx={{ 
                                                    backgroundColor: 'rgba(255,255,255,0.9)', 
                                                    fontWeight: 'bold',
                                                    color: '#667eea'
                                                }} 
                                            />
                                        </Box>
                                        {imageLinks[route.id] && (
                                            <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                                                <Chip 
                                                    icon={<CheckIcon />}
                                                    label="Linked" 
                                                    color="success"
                                                    size="small"
                                                    sx={{ backgroundColor: 'rgba(76, 175, 80, 0.9)' }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                    
                                    {/* Content */}
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                                            {route.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, direction: 'rtl' }}>
                                            {route.ar}
                                        </Typography>
                                        
                                        {/* Link Input */}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Link URL"
                                            placeholder="https://example.com"
                                            value={imageLinks[route.id] || ''}
                                            onChange={(e) => handleLinkChange(route.id, e.target.value)}
                                            sx={{ mb: 1.5 }}
                                            InputProps={{
                                                startAdornment: <LinkIcon sx={{ mr: 0.5, fontSize: '1.2rem', color: 'text.secondary' }} />
                                            }}
                                        />
                                        
                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="small"
                                                startIcon={<SaveIcon />}
                                                onClick={() => handleSaveLink(route.id)}
                                                disabled={saving}
                                                sx={{ 
                                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #5568d3 30%, #6a4190 90%)'
                                                    }
                                                }}
                                            >
                                                Save
                                            </Button>
                                            {imageLinks[route.id] && (
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemoveLink(route.id)}
                                                    disabled={saving}
                                                    sx={{ border: '1px solid', borderColor: 'error.main' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
                
                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default ImageLinksManagement;

