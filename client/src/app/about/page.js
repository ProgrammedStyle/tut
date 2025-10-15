"use client";

import { Box, Container, Typography, Stack, Fade, Zoom } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import PeopleIcon from '@mui/icons-material/People';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import layoutStyles from "../layoutIndex.module.css";
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
    const { t } = useLanguage();
    
    const values = [
        {
            icon: <TipsAndUpdatesIcon sx={{ fontSize: 48 }} />,
            titleKey: "about-value1-title",
            descKey: "about-value1-description"
        },
        {
            icon: <ShieldIcon sx={{ fontSize: 48 }} />,
            titleKey: "about-value2-title",
            descKey: "about-value2-description"
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            titleKey: "about-value3-title",
            descKey: "about-value3-description"
        },
        {
            icon: <RocketLaunchIcon sx={{ fontSize: 48 }} />,
            titleKey: "about-value4-title",
            descKey: "about-value4-description"
        }
    ];

    return (
        <div className={layoutStyles.bodyCont} style={{ background: '#fafafa' }}>
            <Container maxWidth="lg">
                <Box sx={{ py: { xs: 6, md: 10 } }}>
                    {/* Hero Section */}
                    <Fade in={true} timeout={800}>
                        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    display: 'inline-block',
                                    mb: 2,
                                    px: 3,
                                    py: 1,
                                    bgcolor: '#667eea',
                                    color: 'white',
                                    borderRadius: 50,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {t('about-badge')}
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: '#1a1a1a',
                                    letterSpacing: '-0.03em'
                                }}
                            >
                                {t('about-hero-title-1')}
                                <br />
                                <Box
                                    component="span"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    {t('about-hero-title-2')}
                                </Box>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#666',
                                    maxWidth: '650px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    lineHeight: 1.7,
                                    fontWeight: 400
                                }}
                            >
                                {t('about-hero-subtitle')}
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Mission Statement */}
                    <Fade in={true} timeout={1000}>
                        <Box
                            sx={{
                                mb: { xs: 8, md: 12 },
                                p: { xs: 4, md: 8 },
                                bgcolor: 'white',
                                borderRadius: 4,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                }
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                }}
                            >
                                {t('about-mission-title')}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.9,
                                    color: '#555',
                                    textAlign: 'center',
                                    maxWidth: '900px',
                                    mx: 'auto',
                                    mb: 2
                                }}
                            >
                                {t('about-mission-paragraph-1')}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.9,
                                    color: '#555',
                                    textAlign: 'center',
                                    maxWidth: '900px',
                                    mx: 'auto'
                                }}
                            >
                                {t('about-mission-paragraph-2')}
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Values Grid */}
                    <Box sx={{ mb: { xs: 8, md: 12 } }}>
                    <Typography
                        variant="h3" 
                        sx={{ 
                                mb: 2,
                                fontSize: { xs: '1.75rem', md: '2.25rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                textAlign: 'center'
                            }}
                        >
                            {t('about-values-title')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 6,
                                color: '#666',
                                textAlign: 'center',
                                fontSize: '1.05rem'
                            }}
                        >
                            {t('about-values-subtitle')}
                        </Typography>

                        <Stack spacing={3}>
                            {values.map((value, index) => (
                                <Zoom in={true} timeout={600 + index * 150} key={index}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: { xs: 3, md: 4 },
                                            p: { xs: 3, md: 4 },
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                            border: '1px solid #f0f0f0',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            textAlign: { xs: 'center', sm: 'left' },
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 32px rgba(102,126,234,0.15)',
                                                borderColor: '#667eea'
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 2.5,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                flexShrink: 0,
                                                mx: { xs: 'auto', sm: 0 },
                                                boxShadow: '0 8px 24px rgba(102,126,234,0.25)'
                                            }}
                                        >
                                            {value.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    mb: 1.5,
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                                                    color: '#1a1a1a'
                                                }}
                                            >
                                                {t(value.titleKey)}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#666',
                                                    lineHeight: 1.8,
                                                    fontSize: { xs: '0.95rem', md: '1.05rem' }
                                                }}
                                            >
                                                {t(value.descKey)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Zoom>
                            ))}
                        </Stack>
                    </Box>

                    {/* Stats Section */}
                    <Fade in={true} timeout={1400}>
                        <Box
                            sx={{
                                p: { xs: 5, md: 8 },
                                bgcolor: 'white',
                                borderRadius: 4,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                mb: { xs: 8, md: 12 }
                            }}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 4, sm: 0 }}
                                divider={
                                    <Box
                                        sx={{
                                            width: { xs: '80px', sm: '1px' },
                                            height: { xs: '1px', sm: '80px' },
                                            bgcolor: '#e0e0e0',
                                            mx: { xs: 'auto', sm: 0 }
                                        }}
                                    />
                                }
                            >
                                {[
                                    { valueKey: 'about-stat1-value', labelKey: 'about-stat1-label' },
                                    { valueKey: 'about-stat2-value', labelKey: 'about-stat2-label' },
                                    { valueKey: 'about-stat3-value', labelKey: 'about-stat3-label' },
                                    { valueKey: 'about-stat4-value', labelKey: 'about-stat4-label' }
                                ].map((stat, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            flex: 1,
                                            textAlign: 'center',
                                            transition: 'transform 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '2.5rem', md: '3rem' },
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                mb: 1
                                            }}
                                        >
                                            {t(stat.valueKey)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#888',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em'
                                            }}
                                        >
                                            {t(stat.labelKey)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Fade>

                    {/* CTA Section */}
                    <Fade in={true} timeout={1600}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                p: { xs: 6, md: 10 },
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-50%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                                    animation: 'pulse 4s ease-in-out infinite'
                                },
                                '@keyframes pulse': {
                                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                                    '50%': { transform: 'scale(1.1)', opacity: 0.8 }
                                }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 2,
                                    fontWeight: 700,
                                    fontSize: { xs: '2rem', md: '2.75rem' },
                                    color: 'white',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {t('about-cta-title')}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255,255,255,0.95)',
                                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    lineHeight: 1.7,
                                    position: 'relative',
                                    zIndex: 1,
                                    fontWeight: 400
                                }}
                            >
                                {t('about-cta-subtitle')}
                            </Typography>
                        </Box>
                    </Fade>
                </Box>
            </Container>
        </div>
    );
};

export default About;
