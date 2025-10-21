"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, LocationOn, Explore, History, Map } from '@mui/icons-material';
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
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Dark Overlay for Better Text Readability */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                        zIndex: 1
                    }}
                />

                {/* Subtle Pattern Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.03) 0%, transparent 50%)
                        `,
                        zIndex: 2
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, px: { xs: 3, md: 3 }, py: { xs: 8, md: 8 } }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: '4.5rem',
                                        fontWeight: 800,
                                        color: 'white',
                                        mb: 3,
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(45deg, #ffffff 0%, #f8fafc 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    {t('home-hero-title')}
                                </Typography>
                                
                                <Typography
                                    sx={{
                                        fontSize: '1.5rem',
                                        color: 'rgba(255,255,255,0.95)',
                                        mb: 4,
                                        fontWeight: 300,
                                        lineHeight: 1.6,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                                        background: 'rgba(0,0,0,0.1)',
                                        padding: { xs: 2.5, md: 2 },
                                        borderRadius: 2,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {t('home-hero-subtitle')}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: { xs: 2.5, md: 2 }, flexWrap: 'wrap', mb: 4 }}>
                                    <Chip 
                                        icon={<LocationOn sx={{ fontSize: '1.2rem !important' }} />} 
                                        label={t('home-badge-routes')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            height: '32px',
                                            '& .MuiChip-label': {
                                                padding: { xs: '0 16px', md: '0 12px' }
                                            },
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.25)',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }} 
                                    />
                                    <Chip 
                                        icon={<Explore sx={{ fontSize: '1.2rem !important' }} />} 
                                        label={t('home-badge-map')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            height: '32px',
                                            '& .MuiChip-label': {
                                                padding: { xs: '0 16px', md: '0 12px' }
                                            },
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.25)',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }} 
                                    />
                                    <Chip 
                                        icon={<History sx={{ fontSize: '1.2rem !important' }} />} 
                                        label={t('home-badge-history')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            height: '32px',
                                            '& .MuiChip-label': {
                                                padding: { xs: '0 16px', md: '0 12px' }
                                            },
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.25)',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }} 
                                    />
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward sx={{ fontSize: '1.2rem !important' }} />}
                                    onClick={() => routesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    sx={{
                                        px: 5,
                                        py: 2.5,
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                                        color: '#1a202c',
                                        borderRadius: 4,
                                        textTransform: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 15px 50px rgba(0,0,0,0.4)'
                                        }
                                    }}
                                >
                                        {t('home-start-button')}
                                </Button>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 6,
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
                                        background: 'rgba(255,255,255,0.08)',
                                        backdropFilter: 'blur(25px)',
                                        border: '2px solid rgba(255,255,255,0.15)',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 35px 100px rgba(0,0,0,0.5)',
                                            border: '2px solid rgba(255,255,255,0.25)'
                                        },
                                        transition: 'all 0.4s ease'
                                    }}
                                >
                                    <Image
                                        src="/13.jpg"
                                        alt="Jerusalem Old City"
                                        width={600}
                                        height={400}
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto',
                                            borderRadius: '24px'
                                        }}
                                    />
                                    {/* Subtle overlay for extra depth */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                            borderRadius: '24px',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* VIDEO SECTION */}
            <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '3.5rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    mb: 3
                                }}
                            >
                                {t('home-video-title')}
                            </Typography>
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
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '350px'
                            }}
                        >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: '50%',
                                        width: { xs: '250px', sm: '300px', md: '350px' },
                                        height: { xs: '250px', sm: '300px', md: '350px' },
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                        margin: '0 auto',
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
                                    width={350}
                                    height={350}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
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
                                    textAlign: { xs: 'center', md: 'left' },
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

            {/* FEATURES SECTION */}
            <Box ref={routesRef} sx={{ py: { xs: 8, md: 12 }, background: '#f8fafc' }}>
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
                                fontSize: '3.5rem',
                                fontWeight: 700,
                                textAlign: 'center',
                                mb: 8,
                                color: '#1a202c'
                            }}
                        >
                            {t('home-routes-title')}
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
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
                                                height: '450px',
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
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    background: 'rgba(255,255,255,0.9)',
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 1
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        color: '#667eea'
                                                    }}
                                                >
                                                    #{route.id}
                                                </Typography>
                                            </Box>
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

                                        <CardContent sx={{ p: { xs: 3.5, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Chip
                                                    label={route.type}
                                                    size="medium"
                                                    sx={{
                                                        background: 'rgba(102, 126, 234, 0.1)',
                                                        color: '#667eea',
                                                        fontWeight: 500,
                                                        mb: 2,
                                                        fontSize: '0.85rem',
                                                        height: '32px'
                                                    }}
                                                />
                                                
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        color: '#1a202c',
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    {route.name}
                                                </Typography>
                                                
                                                <Typography
                                                    sx={{
                                                        color: '#4a5568',
                                                        fontSize: '1rem',
                                                        direction: 'rtl',
                                                        fontFamily: 'Arial, sans-serif',
                                                        lineHeight: 1.5
                                                    }}
                                                >
                                                    {route.ar}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        </Card>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* MAP SECTION */}
            <Box ref={mapRef} sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                <Map sx={{ fontSize: '2rem', color: '#667eea', mr: 2 }} />
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: '3.5rem',
                                        fontWeight: 700,
                                        color: '#1a202c',
                                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    {t('home-map-title')}
                                </Typography>
                            </Box>
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
                                        mb: 0.5
                                    }}
                                >
                                    {t('home-map-location')}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#4a5568'
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
                            endIcon={<ArrowForward sx={{ fontSize: '1.2rem !important' }} />}
                            onClick={() => mapRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 3,
                                textTransform: 'none',
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
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