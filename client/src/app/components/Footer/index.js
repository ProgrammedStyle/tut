"use client";

import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';
import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' }
    ];

    return (
        <Box className={styles.footerWrapper}>
            <Container maxWidth="xl">
                <Grid container spacing={6} sx={{ py: 8 }}>
                    {/* About Section */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #ffffff 0%, #42a5f5 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            AL-QUDS
                        </Typography>
                        <Typography
                            sx={{
                                color: 'rgba(255,255,255,0.75)',
                                mb: 3,
                                lineHeight: 1.8,
                                fontSize: '1rem'
                            }}
                        >
                            Discover the sacred beauty and rich history of Jerusalem through our immersive virtual experience.
                        </Typography>
                        
                        {/* Social Icons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[
                                { icon: <Facebook />, link: '#' },
                                { icon: <Twitter />, link: '#' },
                                { icon: <Instagram />, link: '#' },
                                { icon: <LinkedIn />, link: '#' }
                            ].map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.link}
                                    className={styles.socialIcon}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#42a5f5',
                                            borderColor: '#42a5f5',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 8px 24px rgba(66,165,245,0.4)'
                                        }
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 3,
                                fontSize: '1.1rem'
                            }}
                        >
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {footerLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={styles.footerLink}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 3,
                                fontSize: '1.1rem'
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Email sx={{ color: '#42a5f5', fontSize: '1.3rem' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
                                    info@alquds.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Phone sx={{ color: '#42a5f5', fontSize: '1.3rem' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
                                    +970 123 456 789
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <LocationOn sx={{ color: '#42a5f5', fontSize: '1.3rem' }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
                                    Jerusalem, Palestine
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        py: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography
                        sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.9rem',
                            textAlign: { xs: 'center', md: 'left' }
                        }}
                    >
                        © {currentYear} AL-QUDS. All rights reserved.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: { xs: 'center', md: 'flex-end' } }}>
                        <Typography
                            sx={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.9rem',
                                textAlign: { xs: 'center', md: 'right' }
                            }}
                        >
                            Made with ❤️ for Jerusalem
                        </Typography>
                        <Typography
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.85rem',
                                textAlign: { xs: 'center', md: 'right' }
                            }}
                        >
                            Developed by{' '}
                            <Box
                                component="a"
                                href="https://www.facebook.com/profile.php?id=61582352101462"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: '#42a5f5',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        color: '#ffffff',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                ProgrammedStyle
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

