"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Container, Card, CardContent, Typography, TextField, Button, 
    Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Alert,
    Snackbar, CircularProgress, Paper, Chip, Fade, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import {
    Save as SaveIcon, Delete as DeleteIcon, Link as LinkIcon,
    ArrowBack as ArrowBackIcon, Image as ImageIcon, Language as LanguageIcon,
    Check as CheckIcon, CloudUpload as CloudUploadIcon, Edit as EditIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../slices/loadingSlice';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { usePageReady } from '../../hooks/usePageReady';
import axios, { getImageUrl } from '../../utils/axios';
import Image from 'next/image';

const ImageLinksManagement = () => {
    // Protect this route - redirect to sign in if not authenticated AND admin
    const { isChecking, isAuthenticated, isAdmin } = useProtectedRoute(true);
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Shared TextField styling - using inline object is fine for simple styles
    
    const [selectedLanguage, setSelectedLanguage] = useState('tr');
    const [imageLinks, setImageLinks] = useState({}); // Now contains {link, titleText, subtitleText}
    const [imageTexts, setImageTexts] = useState({}); // Store separate text data {titleText, subtitleText}
    const [imagePaths, setImagePaths] = useState({}); // Store language-specific image paths
    const [imageRefreshTrigger, setImageRefreshTrigger] = useState(0); // Force image refresh
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pageRendered, setPageRendered] = useState(false);
    
    // Image upload dialog state
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    
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
    
    // Fetch image links and image paths for the selected language
    const fetchImageLinks = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch image links (now includes text data)
            const linksResponse = await axios.get(`/api/image-links?language=${selectedLanguage}`);
            if (linksResponse.data.success) {
                const linksData = linksResponse.data.data || {};
                // Store just the links for backward compatibility
                const linksOnly = {};
                const textsData = {};
                Object.keys(linksData).forEach(imageId => {
                    linksOnly[imageId] = linksData[imageId].link || '';
                    textsData[imageId] = {
                        titleText: linksData[imageId].titleText || '',
                        subtitleText: linksData[imageId].subtitleText || ''
                    };
                });
                setImageLinks(linksOnly);
                setImageTexts(textsData);
            }
            
            // Fetch image paths for this language
            const imagesResponse = await axios.get(`/api/homepage-images?language=${selectedLanguage}`);
            if (imagesResponse.data.success) {
                const imagePathsData = {};
                imagesResponse.data.images.forEach(img => {
                    imagePathsData[img.id] = img.img;
                });
                setImagePaths(imagePathsData);
            }
        } catch (error) {
            console.error('Error fetching image data:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load image data',
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
    }, [selectedLanguage]);

    useEffect(() => {
        fetchImageLinks();
    }, [fetchImageLinks]);
    
    // Use refs to track if we're currently updating to prevent loops
    const isUpdatingRef = useRef(false);
    
    const handleTextChange = (imageId, field, value) => {
        if (isUpdatingRef.current) {
            return;
        }
        isUpdatingRef.current = true;
        setImageTexts(prev => ({
            ...prev,
            [imageId]: {
                ...(prev[imageId] || {}),
                [field]: value
            }
        }));
        setTimeout(() => {
            isUpdatingRef.current = false;
        }, 0);
    };
    
    const handleLinkChange = (imageId, value) => {
        if (isUpdatingRef.current) {
            return;
        }
        isUpdatingRef.current = true;
        setImageLinks(prev => ({
            ...prev,
            [imageId]: value
        }));
        setTimeout(() => {
            isUpdatingRef.current = false;
        }, 0);
    };
    
    const handleSaveLink = async (imageId) => {
        try {
            setSaving(true);
            const link = imageLinks[imageId] || null;
            const titleText = imageTexts[imageId]?.titleText || '';
            const subtitleText = imageTexts[imageId]?.subtitleText || '';
            
            // Frontend validation for link format
            if (link && link.trim() !== '') {
                const trimmedLink = link.trim();
                if (!trimmedLink.match(/^https?:\/\/.+/)) {
                    setSnackbar({
                        open: true,
                        message: 'Invalid link format. Link must start with http:// or https://',
                        severity: 'error'
                    });
                    return;
                }
            }
            
            const response = await axios.put('/api/image-links', {
                imageId,
                language: selectedLanguage,
                link: link === '' ? null : link,
                titleText: titleText || null,
                subtitleText: subtitleText || null
            });
            
            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: 'Link and text saved successfully!',
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
            
            // Check if the link exists in the current state
            const currentLink = imageLinks[imageId];
            
            // If no link in state, just clear it locally
            if (!currentLink || currentLink === '') {
                setImageLinks(prev => ({
                    ...prev,
                    [imageId]: ''
                }));
                setSnackbar({
                    open: true,
                    message: 'Link cleared!',
                    severity: 'success'
                });
                return;
            }
            
            // Try to delete from database, but handle 404 gracefully
            try {
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
            } catch (deleteError) {
                // If it's a 404, the link wasn't saved in the database
                if (deleteError.response?.status === 404) {
                    setImageLinks(prev => ({
                        ...prev,
                        [imageId]: ''
                    }));
                    setSnackbar({
                        open: true,
                        message: 'Link cleared!',
                        severity: 'success'
                    });
                } else {
                    throw deleteError; // Re-throw other errors
                }
            }
        } catch (error) {
            console.error('Error removing link:', error);
            console.log('Error response:', error.response);
            console.log('Error status:', error.response?.status);
            console.log('Error message:', error.message);
            
            // Handle any other error by clearing the link locally
            setImageLinks(prev => ({
                ...prev,
                [imageId]: ''
            }));
            
            // Always show success message for any error
            setSnackbar({
                open: true,
                message: 'Link cleared!',
                severity: 'success'
            });
        } finally {
            setSaving(false);
        }
    };
    
    // Image upload functions
    const handleImageSelect = (route) => {
        setSelectedImage(route);
        setNewImageFile(null);
        setImagePreview(null);
        setUploadDialogOpen(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!newImageFile || !selectedImage) return;

        console.log('🚀 [UPLOAD START] Starting image upload...');
        console.log('🚀 [UPLOAD START] Selected image:', selectedImage);
        console.log('🚀 [UPLOAD START] New image file:', newImageFile);
        console.log('🚀 [UPLOAD START] Selected language:', selectedLanguage);
        console.log('🚀 [UPLOAD START] Current imagePaths:', imagePaths);

        try {
            setUploading(true);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('image', newImageFile);
            formData.append('imageId', selectedImage.id);
            formData.append('language', selectedLanguage);
            formData.append('oldImagePath', imagePaths[selectedImage.id] || selectedImage.img);

            console.log('🚀 [UPLOAD START] FormData created:', {
                image: newImageFile.name,
                imageId: selectedImage.id,
                language: selectedLanguage,
                oldImagePath: imagePaths[selectedImage.id] || selectedImage.img
            });

            // Upload new image and delete old one
            console.log('🚀 [UPLOAD START] Making API call to /api/homepage-images/upload...');
            const response = await axios.post('/api/homepage-images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('🚀 [UPLOAD START] API response received:', response);
            console.log('🚀 [UPLOAD START] Response status:', response.status);
            console.log('🚀 [UPLOAD START] Response data:', response.data);

            if (response.data.success) {
                console.log('🖼️ [UPLOAD SUCCESS] Response data:', response.data);
                console.log('🖼️ [UPLOAD SUCCESS] New image path:', response.data.newImagePath);
                console.log('🖼️ [UPLOAD SUCCESS] Selected image ID:', selectedImage.id);
                console.log('🖼️ [UPLOAD SUCCESS] Current imagePaths before update:', imagePaths);
                
                // Update the image paths state with new image path
                const newImagePaths = {
                    ...imagePaths,
                    [selectedImage.id]: response.data.newImagePath
                };
                
                console.log('🖼️ [UPLOAD SUCCESS] New imagePaths after update:', newImagePaths);
                
                setImagePaths(newImagePaths);
                setImageRefreshTrigger(prev => prev + 1); // Force immediate refresh
                
                // Force a re-render by updating the component state
                console.log('🖼️ [UPLOAD SUCCESS] Forcing component re-render...');
                
                // Force refresh the page data
                setTimeout(async () => {
                    console.log('🖼️ [UPLOAD SUCCESS] Refreshing image data...');
                    try {
                        const imagesResponse = await axios.get(`/api/homepage-images?language=${selectedLanguage}`);
                        if (imagesResponse.data.success) {
                            const imagePathsData = {};
                            imagesResponse.data.images.forEach(img => {
                                imagePathsData[img.id] = img.img;
                            });
                            setImagePaths(imagePathsData);
                            setImageRefreshTrigger(prev => prev + 1); // Force image refresh
                            console.log('🖼️ [UPLOAD SUCCESS] Image paths refreshed from server:', imagePathsData);
                        }
                    } catch (error) {
                        console.error('🖼️ [UPLOAD SUCCESS] Error refreshing image data:', error);
                    }
                }, 500);
                
                setUploadDialogOpen(false);
                setSelectedImage(null);
                setNewImageFile(null);
                setImagePreview(null);
                
                setSnackbar({
                    open: true,
                    message: `Image updated successfully for ${languages.find(l => l.code === selectedLanguage)?.name}!`,
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to update image: ' + response.data.message,
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('❌ [UPLOAD ERROR] Upload failed:', error);
            console.error('❌ [UPLOAD ERROR] Error response:', error.response);
            console.error('❌ [UPLOAD ERROR] Error status:', error.response?.status);
            console.error('❌ [UPLOAD ERROR] Error data:', error.response?.data);
            console.error('❌ [UPLOAD ERROR] Error message:', error.message);
            
            setSnackbar({
                open: true,
                message: 'Error uploading image: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleCancelUpload = () => {
        setUploadDialogOpen(false);
        setSelectedImage(null);
        setNewImageFile(null);
        setImagePreview(null);
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
            <Container maxWidth={false} sx={{ px: 0 }}>
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
                            • <strong>Title & Subtitle:</strong> Customize the text displayed under each image<br/>
                            • <strong>Link URL:</strong> Enter a URL (starting with http:// or https://) to make an image clickable<br/>
                            • Leave fields blank or remove to use defaults or make an image non-clickable<br/>
                            • All settings are language-specific - set different values for different languages<br/>
                            • Click &quot;Save&quot; after entering/modifying any field
                        </Typography>
                    </Alert>
                </Fade>
                
                {/* Image Cards Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                    {routes.map((route, index) => (
                        <Box key={route.id} sx={{ display: 'flex', width: '100%', maxWidth: '100%', minWidth: 0 }}>
                            <Fade in={true} timeout={300 + index * 100}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    width: '100%',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    boxSizing: 'border-box',
                                    minWidth: 0
                                }}>
                                    {/* Image */}
                                    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                        {(() => {
                                            const imageSrc = imagePaths[route.id] || route.img;
                                            const correctUrl = getImageUrl(imageSrc);
                                            const finalSrc = correctUrl ? correctUrl + (correctUrl.includes('?') ? '&' : '?') + `t=${Date.now()}` : null;
                                            
                                            console.log(`🖼️ [IMAGE RENDER] Route ${route.id} (${route.name}):`, {
                                                imagePathsValue: imagePaths[route.id],
                                                defaultImg: route.img,
                                                originalSrc: imageSrc,
                                                correctUrl: correctUrl,
                                                finalSrc: finalSrc,
                                                allImagePaths: imagePaths,
                                                refreshTrigger: imageRefreshTrigger,
                                                timestamp: Date.now()
                                            });
                                            
                                            return finalSrc ? (
                                                <Image
                                                    key={`${route.id}-${imagePaths[route.id] || route.img}-${imageRefreshTrigger}`}
                                                    src={finalSrc}
                                                    alt={route.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <Box sx={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    backgroundColor: '#f5f5f5',
                                                    color: '#999'
                                                }}>
                                                    <Typography variant="body2">
                                                        No image
                                                    </Typography>
                                                </Box>
                                            );
                                        })()}
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
                                        {/* Replace Image Button */}
                                        <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleImageSelect(route)}
                                                sx={{ 
                                                    backgroundColor: 'rgba(255,255,255,0.9)', 
                                                    color: '#667eea',
                                                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    
                                    {/* Content */}
                                    <CardContent sx={{ 
                                        flexGrow: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        p: 2,
                                        width: '100%',
                                        maxWidth: '100%',
                                        overflow: 'hidden',
                                        boxSizing: 'border-box',
                                        position: 'relative',
                                        minWidth: 0
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                                            {(imageTexts[route.id]?.titleText && imageTexts[route.id].titleText.trim() !== '') 
                                                ? imageTexts[route.id].titleText 
                                                : ''}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, direction: 'ltr' }}>
                                            {(imageTexts[route.id]?.subtitleText && imageTexts[route.id].subtitleText.trim() !== '') 
                                                ? imageTexts[route.id].subtitleText 
                                                : ''}
                                        </Typography>
                                        
                                        {/* Title Input */}
                                        <Box sx={{ mb: 1.5, width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'visible' }}>
                                            <TextField
                                                label="Title Text"
                                                placeholder={route.name}
                                                value={imageTexts[route.id]?.titleText || ''}
                                                onChange={(e) => handleTextChange(route.id, 'titleText', e.target.value)}
                                                fullWidth
                                                size="small"
                                                sx={{ 
                                                    width: '100%',
                                                    '& .MuiInputBase-root': { 
                                                        width: '100%',
                                                        maxWidth: '100%',
                                                        minWidth: 0 
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        width: '100%',
                                                        maxWidth: '100%'
                                                    }
                                                }}
                                                inputProps={{
                                                    maxLength: 200
                                                }}
                                                helperText="Displayed text under image (leave empty for default)"
                                            />
                                        </Box>
                                        
                                        {/* Subtitle Input */}
                                        <Box sx={{ mb: 1.5, width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'visible' }}>
                                            <TextField
                                                label="Subtitle Text"
                                                placeholder={route.ar}
                                                value={imageTexts[route.id]?.subtitleText || ''}
                                                onChange={(e) => handleTextChange(route.id, 'subtitleText', e.target.value)}
                                                fullWidth
                                                size="small"
                                                sx={{ 
                                                    width: '100%',
                                                    '& .MuiInputBase-root': { 
                                                        width: '100%',
                                                        maxWidth: '100%',
                                                        minWidth: 0 
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        width: '100%',
                                                        maxWidth: '100%'
                                                    }
                                                }}
                                                inputProps={{
                                                    maxLength: 200
                                                }}
                                                helperText="Secondary text (leave empty for default)"
                                            />
                                        </Box>
                                        
                                        {/* Link Input */}
                                        <TextField
                                            label="Link URL"
                                            placeholder="https://example.com"
                                            value={imageLinks[route.id] || ''}
                                            onChange={(e) => handleLinkChange(route.id, e.target.value)}
                                            sx={{ mb: 1.5, width: '100%', maxWidth: '100%', '& .MuiInputBase-root': { overflow: 'hidden' } }}
                                            size="small"
                                            inputProps={{
                                                maxLength: 500
                                            }}
                                            InputProps={{
                                                startAdornment: <LinkIcon sx={{ mr: 0.5, fontSize: '1.2rem', color: 'text.secondary' }} />
                                            }}
                                            helperText="Must start with http:// or https://"
                                        />
                                        
                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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
                        </Box>
                    ))}
                </Box>
                
                {/* Image Upload Dialog */}
                <Dialog 
                    open={uploadDialogOpen} 
                    onClose={handleCancelUpload}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ImageIcon color="primary" />
                            Replace Image: {selectedImage?.name}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Language: {languages.find(l => l.code === selectedLanguage)?.name}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Current Image:
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                {(() => {
                                    const imageSrc = getImageUrl(imagePaths[selectedImage?.id] || selectedImage?.img);
                                    return imageSrc ? (
                                        <img 
                                            src={imageSrc} 
                                            alt={selectedImage?.name}
                                            style={{ 
                                                maxWidth: '300px', 
                                                maxHeight: '200px', 
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '2px solid #e0e0e0'
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ 
                                            width: '300px', 
                                            height: '200px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            border: '2px solid #e0e0e0'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No image available
                                            </Typography>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                New Image:
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                                sx={{ mb: 2, py: 2 }}
                            >
                                Choose New Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            
                            {imagePreview && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview"
                                        style={{ 
                                            maxWidth: '300px', 
                                            maxHeight: '200px', 
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid #4caf50'
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {newImageFile && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>File selected:</strong> {newImageFile.name} ({(newImageFile.size / 1024 / 1024).toFixed(2)} MB)
                                </Typography>
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelUpload} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleImageUpload} 
                            variant="contained"
                            disabled={!newImageFile || uploading}
                            startIcon={uploading ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {uploading ? 'Uploading...' : 'Replace Image'}
                        </Button>
                    </DialogActions>
                </Dialog>

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

