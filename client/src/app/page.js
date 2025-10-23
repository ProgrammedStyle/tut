"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, Map } from '@mui/icons-material';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from './contexts/LanguageContext';
import { usePageReady } from './hooks/usePageReady';
import axios from './utils/axios';

const MapComponent = dynamic(() => import('./components/Map'), { ssr: false });

export default function Home() {
    const routesRef = useRef(null);
    const mapRef = useRef(null);
    const { t, currentLanguage } = useLanguage();
    const [animationDistance, setAnimationDistance] = useState(-50); // Default for SSR
    const [pageReady, setPageReady] = useState(false);
    const [imageLinks, setImageLinks] = useState({});
    
    useEffect(() => {
        // Set animation distance based on screen size after mount
        setAnimationDistance(window.innerWidth < 768 ? -50 : -300);
        
        // Wait for rendering to complete before marking as ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageReady(true);
            }, 1000); // Wait 1000ms after render for page to be fully painted
        });
    }, []);

    // Fetch image links for the current language
    useEffect(() => {
        const fetchImageLinks = async () => {
            try {
                console.log('='.repeat(50));
                console.log('🌍 [IMAGE LINKS] Starting fetch...');
                console.log('📍 [IMAGE LINKS] Current language:', currentLanguage);
                console.log('📍 [IMAGE LINKS] API URL:', `/api/image-links?language=${currentLanguage}`);
                
                const response = await axios.get(`/api/image-links?language=${currentLanguage}`);
                
                console.log('📡 [IMAGE LINKS] Response received:');
                console.log('   - Status:', response.status);
                console.log('   - Success:', response.data.success);
                console.log('   - Data:', JSON.stringify(response.data.data, null, 2));
                
                if (response.data.success) {
                    const links = response.data.data || {};
                    setImageLinks(links);
                    console.log('✅ [IMAGE LINKS] State updated with:', links);
                    console.log('   - Number of links:', Object.keys(links).length);
                    console.log('   - Image IDs with links:', Object.keys(links).join(', '));
                } else {
                    console.warn('⚠️ [IMAGE LINKS] Response not successful');
                }
                console.log('='.repeat(50));
            } catch (error) {
                console.error('❌ [IMAGE LINKS] Error fetching:', error);
                console.error('   - Message:', error.message);
                console.error('   - Response:', error.response?.data);
                console.error('='.repeat(50));
            }
        };
        
        console.log('🔄 [IMAGE LINKS] useEffect triggered, currentLanguage:', currentLanguage);
        if (currentLanguage) {
            fetchImageLinks();
        } else {
            console.log('⏸️ [IMAGE LINKS] Waiting for currentLanguage...');
        }
    }, [currentLanguage]);

    // Signal that the page is ready after rendering completes
    usePageReady(pageReady);

    const routes = [
        { 
            id: 1, 
            name: "Damascus Gate", 
            ar: "باب العامود", 
            img: '/1.jpg',
            type: "Historic Gate"
        },
        { 
            id: 2, 
            name: "Al-Aqsa Mosque", 
            ar: "المسجد الاقصى", 
            img: '/3.jpg',
            type: "Sacred Site"
        },
        { 
            id: 3, 
            name: "Holy Sepulchre", 
            ar: "كنيسة القيامة", 
            img: '/4.jpg',
            type: "Religious Site"
        },
        { 
            id: 4, 
            name: "Jaffa Gate", 
            ar: "باب الخليل", 
            img: '/5.jpg',
            type: "Historic Gate"
        },
        { 
            id: 5, 
            name: "Muslim Quarter", 
            ar: "الحي الاسلامي", 
            img: '/6.jpg',
            type: "Historic Quarter"
        },
        { 
            id: 6, 
            name: "Markets", 
            ar: "الاسواق", 
            img: '/7.jpg',
            type: "Marketplace"
        },
        { 
            id: 7, 
            name: "Via Dolorosa", 
            ar: "طريق الالام", 
            img: '/8.jpg',
            type: "Sacred Path"
        },
        { 
            id: 8, 
            name: "New Gate", 
            ar: "باب الجديد", 
            img: '/9.jpg',
            type: "Historic Gate"
        },
        { 
            id: 9, 
            name: "Armenian Quarter", 
            ar: "الحي الارمني", 
            img: '/10.jpg',
            type: "Historic Quarter"
        },
        { 
            id: 10, 
            name: "Dung Gate", 
            ar: "باب المغاربة", 
            img: '/11.jpg',
            type: "Historic Gate"
        }
    ];

    return (
        <>
            {/* HERO SECTION */}
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage: 'url(/13.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Light Dark Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%)',
                        zIndex: 1
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, px: { xs: 3, md: 3 }, py: { xs: 8, md: 8 } }}>
                    <Grid container spacing={6} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: '3.5rem',
                                        fontWeight: 800,
                                        color: 'white',
                                        mb: 3,
                                        mt: -10,
                                        lineHeight: 1.1,
                                        textAlign: 'center',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {t('home-hero-title')}
                                </Typography>
                                
                                <Typography
                                    sx={{
                                        fontSize: '1.2rem',
                                        color: 'rgba(255,255,255,0.95)',
                                        mt: 16,
                                        mb: 4,
                                        fontWeight: 300,
                                        lineHeight: 1.6,
                                        textAlign: 'center',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    {t('home-hero-subtitle')}
                                </Typography>


                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward sx={{ fontSize: '0.6rem !important' }} />}
                                    onClick={() => routesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: '0.5rem',
                                        fontWeight: 600,
                                        mt: 4,
                                        background: 'linear-gradient(45deg, #dc2626 0%, #b91c1c 100%)',
                                        color: 'white',
                                        borderRadius: 4,
                                        textTransform: 'none',
                                        boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4)',
                                        border: '1px solid rgba(185, 28, 28, 0.3)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 15px 50px rgba(220, 38, 38, 0.6)'
                                        }
                                    }}
                                >
                                        {t('home-start-button')}
                                </Button>
                            </motion.div>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            {/* VIDEO SECTION */}
            <Box sx={{ py: { xs: 4, md: 6 }, background: '#000000' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
                            <Typography
                                sx={{
                                    fontSize: '1.2rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    px: { xs: 2, md: 0 }
                                }}
                            >
                                {t('home-video-subtitle')}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: { xs: '250px', sm: '350px', md: '450px' },
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <iframe
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                className="embed-responsive-item"
                                src="https://www.youtube.com/embed/EDh8pgxsp8k?mute=0&showinfo=0&controls=0&start=0"
                                frameBorder="0"
                                allowFullScreen=""
                                title="Jerusalem Virtual Guide Video"
                            />
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* ALQUDS GUIDE SECTION */}
            <Box sx={{ py: { xs: 8, md: 12 }, background: '#ffffff' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'center', md: 'flex-start' },
                            gap: { xs: 4, md: 6 },
                            minHeight: '400px'
                        }}
                    >
                        <motion.div
                            initial={{ 
                                opacity: 0, 
                                x: animationDistance,
                                rotate: -360 
                            }}
                            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            style={{
                                flex: '0 0 auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: '50%',
                                        width: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
                                        height: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
                                        aspectRatio: '1 / 1',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                        margin: '0 auto',
                                        flexShrink: 0,
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 30px 80px rgba(0,0,0,0.2)'
                                        },
                                        transition: 'all 0.4s ease'
                                    }}
                                >
                                <Image
                                    src="/14.jpg"
                                    alt="Alquds Old City Market"
                                    fill
                                    style={{ 
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                flex: '1 1 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    textAlign: 'center',
                                    pl: { md: 2 }
                                }}
                            >
                                    <Typography
                                        sx={{
                                            fontSize: '1.8rem',
                                            fontWeight: 700,
                                            color: '#000000',
                                            mb: 4,
                                            fontStyle: 'normal',
                                            lineHeight: 1.2,
                                            letterSpacing: '-0.02em',
                                            fontFamily: '"Oswald", sans-serif'
                                        }}
                                    >
                                        {t('home-guide-quote')}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: '1.4rem',
                                            color: '#444444',
                                            mb: 3,
                                            lineHeight: 1.6,
                                            fontWeight: 400,
                                            fontStyle: 'italic',
                                            letterSpacing: '0.01em',
                                            fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif'
                                        }}
                                    >
                                        {t('home-guide-description-1')}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: '1.4rem',
                                            color: '#444444',
                                            mb: 4,
                                            lineHeight: 1.6,
                                            fontWeight: 400,
                                            fontStyle: 'italic',
                                            letterSpacing: '0.01em',
                                            fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif'
                                        }}
                                    >
                                        {t('home-guide-description-2')}
                                    </Typography>

                                </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Box>

            {/* IMAGE SLIDER SECTION */}
            <Box sx={{ py: { xs: 6, md: 8 }, background: '#781818', overflow: 'hidden', maxWidth: { xs: '90%', md: '60%' }, mx: 'auto', borderRadius: '13px' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                height: { xs: '300px', md: '400px' },
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Slider Container - Perfect seamless loop */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '100%'
                                }}
                                style={{
                                    width: 'calc((100vw / 3) * 14)', // 7 images × 2 sets × (100vw/3 per image)
                                    animation: 'slideRightToLeft 20s linear infinite'
                                }}
                            >
                                {/* First Complete Set */}
                                {[
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.18 PM.jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM (1).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM (4).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM.jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM (1).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM (3).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM.jpeg'
                                ].map((imagePath, index) => (
                                    <Box
                                        key={`first-${index}`}
                                        sx={{
                                            width: 'calc(100vw / 3)',
                                            height: '100%',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={imagePath}
                                            alt={`Slider image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                imageRendering: 'high-quality',
                                                imageRendering: '-webkit-optimize-contrast',
                                                imageRendering: 'crisp-edges',
                                                filter: 'none'
                                            }}
                                        />
                                    </Box>
                                ))}
                                
                                {/* Second Complete Set - Exact duplicate for seamless loop */}
                                {[
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.18 PM.jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM (1).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM (4).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.19 PM.jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM (1).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM (3).jpeg',
                                    '/B/B1/WhatsApp Image 2025-10-22 at 10.05.20 PM.jpeg'
                                ].map((imagePath, index) => (
                                    <Box
                                        key={`second-${index}`}
                                        sx={{
                                            width: 'calc(100vw / 3)',
                                            height: '100%',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={imagePath}
                                            alt={`Slider image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                imageRendering: 'high-quality',
                                                imageRendering: '-webkit-optimize-contrast',
                                                imageRendering: 'crisp-edges',
                                                filter: 'none'
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            
                            {/* Decorative Elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            
                            {/* Floating Particles Effect */}
                            {[...Array(6)].map((_, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        width: '4px',
                                        height: '4px',
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        borderRadius: '50%',
                                        top: `${20 + (i * 15)}%`,
                                        left: `${10 + (i * 15)}%`,
                                        animation: `float${i} 3s ease-in-out infinite`,
                                        [`@keyframes float${i}`]: {
                                            '0%, 100%': {
                                                transform: 'translateY(0px)',
                                                opacity: 0.6
                                            },
                                            '50%': {
                                                transform: 'translateY(-20px)',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* FEATURES SECTION */}
            <Box ref={routesRef} sx={{ py: { xs: 8, md: 12 }, background: '#f5e8e8' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                textAlign: 'center',
                                mb: 8,
                                color: '#1a202c'
                            }}
                        >
                            {t('home-routes-title')}
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 6, md: 8 }} sx={{ justifyContent: 'center' }}>
                        {routes.map((route, index) => (
                            <Grid item xs={12} sm={6} md={4} key={route.id}
                                sx={{
                                    maxWidth: { xs: '100%', sm: '50%', md: '33.333333%' },
                                    flexBasis: { xs: '100%', sm: '50%', md: '33.333333%' },
                                    '@media (max-width: 550px)': {
                                        maxWidth: '96%',
                                        flexBasis: '96%',
                                        paddingLeft: '0 !important',
                                        paddingRight: '0 !important'
                                    }
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    {/* Debug: Log image link status */}
                                    {console.log(`Image ${route.id} (${route.name}):`, {
                                        hasLink: !!imageLinks[route.id],
                                        link: imageLinks[route.id],
                                        allLinks: imageLinks
                                    })}
                                    <Box
                                        component={imageLinks[route.id] ? 'a' : 'div'}
                                        href={imageLinks[route.id] || undefined}
                                        target={imageLinks[route.id] ? '_blank' : undefined}
                                        rel={imageLinks[route.id] ? 'noopener noreferrer' : undefined}
                                        onClick={(e) => {
                                            console.log('🖱️ Clicked on image:', route.id);
                                            console.log('🔗 Link:', imageLinks[route.id]);
                                            console.log('📦 Component type:', imageLinks[route.id] ? 'a' : 'div');
                                            if (imageLinks[route.id]) {
                                                console.log('✅ Should redirect to:', imageLinks[route.id]);
                                                // Force navigation as backup
                                                window.open(imageLinks[route.id], '_blank');
                                            } else {
                                                console.log('❌ No link set for this image');
                                            }
                                        }}
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'block'
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                borderRadius: { xs: 4, md: 3 },
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s ease',
                                                cursor: imageLinks[route.id] ? 'pointer' : 'default',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                '&:hover': imageLinks[route.id] ? {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                                } : {}
                                            }}
                                        >
                                        <Box sx={{ 
                                            position: 'relative', 
                                            width: '100%', 
                                            height: '280px',
                                            overflow: 'hidden',
                                            pointerEvents: 'none' // Allow clicks to pass through
                                        }}>
                                            <Image
                                                src={route.img}
                                                alt={route.name}
                                                fill
                                                unoptimized={true}
                                                style={{ 
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    pointerEvents: 'none' // Allow clicks to pass through
                                                }}
                                            />
                                            {imageLinks[route.id] && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 16,
                                                        left: 16,
                                                        background: 'rgba(76, 175, 80, 0.9)',
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: 600,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        🔗 CLICKABLE
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <CardContent sx={{ p: { xs: 1, md: 1 }, mt: 2 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    color: '#1a202c',
                                                    fontSize: '1.1rem',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {currentLanguage === 'ar' ? route.ar : route.name}
                                            </Typography>
                                            
                                            <Typography
                                                sx={{
                                                    color: '#4a5568',
                                                    fontSize: '1rem',
                                                    direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
                                                    fontFamily: 'Arial, sans-serif',
                                                    lineHeight: 1.5,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {currentLanguage === 'ar' ? route.ar : route.name}
                                            </Typography>
                                        </CardContent>
                                        </Card>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* IMAGE SLIDER SECTION B2 */}
            <Box sx={{ py: { xs: 6, md: 8 }, background: '#781818', overflow: 'hidden', maxWidth: { xs: '90%', md: '60%' }, mx: 'auto', borderRadius: '13px' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                height: { xs: '300px', md: '400px' },
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Slider Container - Perfect seamless loop */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '100%'
                                }}
                                style={{
                                    width: 'calc((100vw / 3) * 14)', // 7 images × 2 sets × (100vw/3 per image)
                                    animation: 'slideRightToLeft 20s linear infinite'
                                }}
                            >
                                {/* First Complete Set */}
                                {[
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.18 PM (1).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.18 PM (2).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (2).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (3).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (5).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (6).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.20 PM (2).jpeg'
                                ].map((imagePath, index) => (
                                    <Box
                                        key={`first-${index}`}
                                        sx={{
                                            width: 'calc(100vw / 3)',
                                            height: '100%',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={imagePath}
                                            alt={`Slider image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                imageRendering: 'high-quality',
                                                imageRendering: '-webkit-optimize-contrast',
                                                imageRendering: 'crisp-edges',
                                                filter: 'none'
                                            }}
                                        />
                                    </Box>
                                ))}
                                
                                {/* Second Complete Set - Exact duplicate for seamless loop */}
                                {[
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.18 PM (1).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.18 PM (2).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (2).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (3).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (5).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.19 PM (6).jpeg',
                                    '/B/B2/WhatsApp Image 2025-10-22 at 10.05.20 PM (2).jpeg'
                                ].map((imagePath, index) => (
                                    <Box
                                        key={`second-${index}`}
                                        sx={{
                                            width: 'calc(100vw / 3)',
                                            height: '100%',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={imagePath}
                                            alt={`Slider image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                imageRendering: 'high-quality',
                                                imageRendering: '-webkit-optimize-contrast',
                                                imageRendering: 'crisp-edges',
                                                filter: 'none'
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            
                            {/* Decorative Elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            
                            {/* Floating Particles Effect */}
                            {[...Array(6)].map((_, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        width: '4px',
                                        height: '4px',
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        borderRadius: '50%',
                                        top: `${20 + (i * 15)}%`,
                                        left: `${10 + (i * 15)}%`,
                                        animation: `floatB2${i} 3s ease-in-out infinite`,
                                        [`@keyframes floatB2${i}`]: {
                                            '0%, 100%': {
                                                transform: 'translateY(0px)',
                                                opacity: 0.6
                                            },
                                            '50%': {
                                                transform: 'translateY(-20px)',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* MAP SECTION */}
            <Box ref={mapRef} sx={{ py: { xs: 6, md: 8 }, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                            <Typography
                                sx={{
                                    fontSize: '1.2rem',
                                    color: '#4a5568',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    px: { xs: 2, md: 0 }
                                }}
                            >
                                {t('home-map-subtitle')}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: { xs: '400px', md: '500px' },
                                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
                                border: '1px solid rgba(102, 126, 234, 0.1)',
                                background: 'white',
                                position: 'relative'
                            }}
                        >
                            {/* Map Background Pattern */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                                    zIndex: 1
                                }}
                            />
                            
                            <Box sx={{ position: 'relative', zIndex: 2, height: '100%' }}>
                                <MapComponent />
                            </Box>

                            {/* Map Overlay Elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 2,
                                    p: 2,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    zIndex: 3
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#667eea',
                                        mb: 0.5,
                                        textAlign: 'center'
                                    }}
                                >
                                    {t('home-map-location')}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#4a5568',
                                        textAlign: 'center'
                                    }}
                                >
                                    10 Sacred Routes
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* CTA SECTION */}
            <Box
                sx={{
                    py: 12,
                    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                    textAlign: 'center',
                    color: 'white'
                }}
            >
                <Container maxWidth="md" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: '3.5rem',
                                fontWeight: 700,
                                mb: 3,
                                background: 'linear-gradient(45deg, #ffffff 0%, #e3f2fd 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {t('home-cta-title')}
                        </Typography>
                        
                        <Typography
                            sx={{
                                fontSize: '1.2rem',
                                color: 'rgba(255,255,255,0.8)',
                                mb: 4,
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6,
                                px: { xs: 2, md: 0 }
                            }}
                        >
                            {t('home-cta-subtitle')}
                        </Typography>
                        
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward sx={{ fontSize: '0.8rem !important' }} />}
                            onClick={() => mapRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            sx={{
                                px: 2,
                                py: 0.8,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #dc2626 0%, #b91c1c 100%)',
                                borderRadius: 3,
                                textTransform: 'none',
                                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 40px rgba(220, 38, 38, 0.4)'
                                }
                            }}
                        >
                            {t('home-cta-button')}
                        </Button>
                    </motion.div>
                </Container>
            </Box>
        </>
    );
}