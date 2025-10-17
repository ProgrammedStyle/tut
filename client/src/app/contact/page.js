"use client";

import { 
    Box, 
    Container, 
    Typography, 
    TextField,
    Button,
    Alert,
    Fade,
    Stack,
    Paper
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../slices/loadingSlice";
import axios from "../utils/axios";
import layoutStyles from "../layoutIndex.module.css";
import { useLanguage } from '../contexts/LanguageContext';
// Manually controlling loading instead of usePageReady to avoid conflicts

// Validation schema
const contactSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    subject: z.string().min(1, { message: "Subject is required" }).min(5, { message: "Subject must be at least 5 characters" }),
    message: z.string().min(1, { message: "Message is required" }).min(10, { message: "Message must be at least 10 characters" })
});

const Contact = () => {
    const { t } = useLanguage();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);
    const hasCalledPageReady = useRef(false);
    const hasHandledSuccess = useRef(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(contactSchema)
    });

    useEffect(() => {
        // Wait for rendering to complete before marking as ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000);
        });
    }, []);

    // Page ready - hides initial loading (ONLY ONCE)
    useEffect(() => {
        if (pageRendered && !hasCalledPageReady.current) {
            hasCalledPageReady.current = true;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dispatch(hideLoading());
                }, 1500);
            });
        }
    }, [pageRendered, dispatch]);

    // When form submits successfully, wait for success alert to render before hiding loading
    useEffect(() => {
        if (success && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true;
            // Wait for browser to paint the alert, then add buffer time
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dispatch(hideLoading());
                }, 3500); // Wait 3.5 seconds after paint for complete stability
            });
        }
    }, [success, dispatch]);

    const onSubmit = async (data) => {
        try {
            console.log('📧 Submitting contact form...', data);
            dispatch(showLoading());
            setError(null);
            setSuccess(false);

            const response = await axios.post("/api/contact", data);
            console.log('📧 Contact form response:', response.data);

            if (response.data.success) {
                console.log('✅ Contact form submitted successfully');
                setSuccess(true);
                reset();
                setTimeout(() => setSuccess(false), 5000);
                // Loading will be hidden by useEffect after success alert renders
            } else {
                console.log('❌ Contact form failed:', response.data.message);
                setError(response.data.message || "Failed to send message. Please try again.");
                dispatch(hideLoading());
            }
        } catch (err) {
            console.error("❌ Contact form error:", err);
            console.error("❌ Error response:", err.response?.data);
            setError(err.response?.data?.message || "Failed to send message. Please try again.");
            dispatch(hideLoading()); // Hide loading on error
        }
    };

    const contactInfo = [
        {
            icon: <EmailIcon sx={{ fontSize: 28 }} />,
            labelKey: "contact-info1-label",
            valueKey: "contact-info1-value",
            color: '#667eea'
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 28 }} />,
            labelKey: "contact-info2-label",
            valueKey: "contact-info2-value",
            color: '#f093fb'
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
            labelKey: "contact-info3-label",
            valueKey: "contact-info3-value",
            color: '#4facfe'
        }
    ];

    return (
        <div className={layoutStyles.bodyCont} style={{ background: '#fafafa' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
                <Box sx={{ py: { xs: 6, md: 10 } }}>
                    {/* Hero Section */}
                    <Fade in={true} timeout={800}>
                        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
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
                                {t('contact-badge')}
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: 3,
                                    fontSize: '4.5rem',
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: '#1a1a1a',
                                    letterSpacing: '-0.03em'
                                }}
                            >
                                {t('contact-hero-title-1')}
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
                                    {t('contact-hero-title-2')}
                                </Box>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#666',
                                    maxWidth: '650px',
                                    mx: 'auto',
                                    fontSize: '1.25rem',
                                    lineHeight: 1.7,
                                    fontWeight: 400
                                }}
                            >
                                {t('contact-hero-subtitle')}
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Contact Info Cards */}
                    <Fade in={true} timeout={1000}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={3}
                            sx={{ mb: { xs: 6, md: 8 } }}
                        >
                            {contactInfo.map((info, index) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        flex: 1,
                                        p: 3.5,
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        border: '1px solid #f0f0f0',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: info.color,
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 24px ${info.color}30`
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: `${info.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: info.color,
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        {info.icon}
                                    </Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 0.5,
                                            color: '#888',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        }}
                                    >
                                        {t(info.labelKey)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {t(info.valueKey)}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Fade>

                    {/* Contact Form */}
                    <Fade in={true} timeout={1200}>
                        <Box
                            sx={{
                                maxWidth: '700px',
                                mx: 'auto',
                                p: { xs: 4, md: 6 },
                                bgcolor: 'white',
                                borderRadius: 4,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 1,
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                }}
                            >
                                {t('contact-form-title')}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 4,
                                    color: '#666',
                                    textAlign: 'center',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {t('contact-form-subtitle')}
                            </Typography>

                            {success && (
                                <Fade in={success}>
                                    <Alert
                                        severity="success"
                                        sx={{
                                            mb: 3,
                                            borderRadius: 2,
                                            border: '1px solid #4caf50'
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {t('contact-success-title')}
                                        </Typography>
                                        <Typography variant="body2">
                                            {t('contact-success-message')}
                                        </Typography>
                                    </Alert>
                                </Fade>
                            )}

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        border: '1px solid #f44336'
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label={t('contact-form-name-label')}
                                            {...register("name")}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea'
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea'
                                                    }
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('contact-form-email-label')}
                                            type="email"
                                            {...register("email")}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea'
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>

                                    <TextField
                                        fullWidth
                                        label={t('contact-form-subject-label')}
                                        {...register("subject")}
                                        error={!!errors.subject}
                                        helperText={errors.subject?.message}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#667eea'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea'
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label={t('contact-form-message-label')}
                                        multiline
                                        rows={5}
                                        {...register("message")}
                                        error={!!errors.message}
                                        helperText={errors.message?.message}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#667eea'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea'
                                                }
                                            }
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<SendIcon />}
                                        sx={{
                                            py: 1.75,
                                            fontSize: '1.05rem',
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                                                boxShadow: '0 8px 24px rgba(102,126,234,0.5)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                        >
                                            {t('contact-form-submit-button')}
                                        </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Fade>

                    {/* Additional Info */}
                    <Fade in={true} timeout={1400}>
                        <Box
                            sx={{
                                mt: { xs: 6, md: 8 },
                                p: { xs: 4, md: 5 },
                                bgcolor: 'white',
                                borderRadius: 3,
                                textAlign: 'center',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    fontSize: '1.25rem'
                                }}
                            >
                                We&apos;re Here to Help
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#666',
                                    lineHeight: 1.8,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: '1rem'
                                }}
                            >
                                Our support team typically responds within 24 hours during business days. 
                                For urgent matters, please call us directly or reach out via email.
                            </Typography>
                        </Box>
                    </Fade>
                </Box>
            </Container>
        </div>
    );
};

export default Contact;
