"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, LocationOn, Explore, History, Map } from '@mui/icons-material';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from './contexts/LanguageContext';

const MapComponent = dynamic(() => import('./components/Map'), { ssr: false });

export default function Home() {
    const routesRef = useRef(null);
    const mapRef = useRef(null);
    const { t } = useLanguage();
    const [animationDistance, setAnimationDistance] = useState(-50); // Default for SSR
    
    useEffect(() => {
        // Set animation distance based on screen size after mount
        setAnimationDistance(window.innerWidth < 768 ? -50 : -300);
    }, []);

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

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
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
                                        fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
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
                                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                                        color: 'rgba(255,255,255,0.95)',
                                        mb: 4,
                                        fontWeight: 300,
                                        lineHeight: 1.6,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                                        background: 'rgba(0,0,0,0.1)',
                                        padding: 2,
                                        borderRadius: 2,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {t('home-hero-subtitle')}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                                    <Chip 
                                        icon={<LocationOn />} 
                                        label={t('home-badge-routes')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.25)',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }} 
                                    />
                                    <Chip 
                                        icon={<Explore />} 
                                        label={t('home-badge-map')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.25)',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }} 
                                    />
                                    <Chip 
                                        icon={<History />} 
                                        label={t('home-badge-history')} 
                                        sx={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            color: 'white',
                                            backdropFilter: 'blur(15px)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
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
                                    endIcon={<ArrowForward />}
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
            <Box sx={{ py: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                                    lineHeight: 1.6
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
            <Box sx={{ py: 12, background: '#ffffff' }}>
                <Container maxWidth="lg">
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
                                            fontSize: { xs: '1.5rem', md: '1.8rem' },
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
                                            fontSize: { xs: '1.3rem', md: '1.4rem' },
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
                                            fontSize: { xs: '1.3rem', md: '1.4rem' },
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
            <Box ref={routesRef} sx={{ py: 12, background: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 700,
                                textAlign: 'center',
                                mb: 8,
                                color: '#1a202c'
                            }}
                        >
                            {t('home-routes-title')}
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                        {routes.map((route, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} key={route.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            height: '400px',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            position: 'relative', 
                                            width: '100%', 
                                            height: '250px',
                                            aspectRatio: '1 / 1',
                                            overflow: 'hidden' 
                                        }}>
                                            <Image
                                                src={route.img}
                                                alt={route.name}
                                                fill
                                                style={{ 
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%'
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
                                        </Box>

                                        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Chip
                                                    label={route.type}
                                                    size="small"
                                                    sx={{
                                                        background: 'rgba(102, 126, 234, 0.1)',
                                                        color: '#667eea',
                                                        fontWeight: 500,
                                                        mb: 2
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
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* MAP SECTION */}
            <Box ref={mapRef} sx={{ py: 12, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                <Map sx={{ fontSize: '2rem', color: '#667eea', mr: 2 }} />
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                                    lineHeight: 1.6
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
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                                lineHeight: 1.6
                            }}
                        >
                            {t('home-cta-subtitle')}
                        </Typography>
                        
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
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