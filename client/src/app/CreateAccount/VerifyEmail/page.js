"use client";

// Force dynamic rendering due to useSearchParams
export const dynamic = 'force-dynamic';

import SignInContBox from "../../components/SignInContBox";
import { useEffect, useState, Suspense } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "@/app/slices/loadingSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Paper, keyframes, Button, CircularProgress } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "../../utils/axios";
import { usePageReady } from "../../hooks/usePageReady";

// Animation for the email icon
const bounceAnimation = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
`;

const pulseAnimation = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
`;

const VerifyEmail_PendingContent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);

    useEffect(() => {
        // Wait for rendering to complete before marking as ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000); // Wait 1000ms after render for page to be fully painted
        });
    }, []);

    // Page is ready after rendering completes
    usePageReady(pageRendered);

    const handleResendEmail = async () => {
        if (!email) {
            setResendError("Email address not found. Please go back and try again.");
            return;
        }

        try {
            setResending(true);
            setResendError(null);
            setResendSuccess(false);

            await axios.post('/api/user/email/verify/send', {
                email: email
            });

            setResendSuccess(true);
            setTimeout(() => {
                setResendSuccess(false);
            }, 5000);
        } catch (err) {
            console.error('Resend email error:', err);
            setResendError(err.response?.data?.message || 'Failed to resend email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleGoBack = () => {
        dispatch(showLoading());
        router.push('/CreateAccount');
    };

    return (
        <SignInContBox>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "70vh",
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        maxWidth: 600,
                        width: "100%",
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        textAlign: "center",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                    }}
                >
                    {/* Animated Email Icon */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-block",
                            }}
                        >
                            <EmailOutlinedIcon
                                sx={{
                                    fontSize: { xs: 80, sm: 100 },
                                    color: "var(--main-color)",
                                    animation: `${bounceAnimation} 2s ease-in-out infinite`,
                                }}
                            />
                            <CheckCircleOutlineIcon
                                sx={{
                                    position: "absolute",
                                    bottom: -5,
                                    right: -5,
                                    fontSize: 30,
                                    color: "#4caf50",
                                    bgcolor: "white",
                                    borderRadius: "50%",
                                    animation: `${pulseAnimation} 2s ease-in-out infinite`,
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#1a237e",
                            mb: 2,
                            fontSize: { xs: "1.75rem", sm: "2.125rem" },
                        }}
                    >
                        Check Your Email
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#546e7a",
                            mb: 3,
                            fontSize: { xs: "0.95rem", sm: "1.05rem" },
                            lineHeight: 1.7,
                        }}
                    >
                        We&apos;ve sent a verification link to
                    </Typography>

                    {/* Email Display */}
                    {email && (
                        <Box
                            sx={{
                                bgcolor: "#e8eaf6",
                                py: 1.5,
                                px: 2,
                                borderRadius: 2,
                                mb: 3,
                                display: "inline-block",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "var(--main-color)",
                                    fontWeight: 600,
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    wordBreak: "break-word",
                                }}
                            >
                                {email}
                            </Typography>
                        </Box>
                    )}

                    {/* Instructions */}
                    <Box
                        sx={{
                            bgcolor: "#f5f5f5",
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#37474f",
                                mb: 2,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <OpenInNewIcon sx={{ fontSize: 20 }} />
                            <strong>Click the link in the email</strong> to verify your account
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#78909c",
                                fontSize: "0.85rem",
                            }}
                        >
                            The link will expire in 15 minutes
                        </Typography>
                    </Box>

                    {/* Footer Note */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#90a4ae",
                            fontSize: "0.85rem",
                            fontStyle: "italic",
                            mb: 3,
                        }}
                    >
                        Didn&apos;t receive the email? Check your spam folder
                    </Typography>

                    {/* Success/Error Messages for Resend */}
                    {resendSuccess && (
                        <Box
                            sx={{
                                bgcolor: "#e8f5e9",
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #c8e6c9",
                                mb: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#2e7d32",
                                    fontSize: "0.9rem",
                                }}
                            >
                                ✓ Verification email sent successfully!
                            </Typography>
                        </Box>
                    )}

                    {resendError && (
                        <Box
                            sx={{
                                bgcolor: "#ffebee",
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #ffcdd2",
                                mb: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#c62828",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {resendError}
                            </Typography>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "center",
                            alignItems: "stretch",
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleGoBack}
                            sx={{
                                flex: { xs: "1", sm: "0 1 auto" },
                                textTransform: "none",
                                px: 3,
                                py: 1.5,
                                fontSize: "1rem",
                                borderColor: "var(--main-color)",
                                color: "var(--main-color)",
                                "&:hover": {
                                    borderColor: "var(--main-color)",
                                    bgcolor: "rgba(102, 126, 234, 0.04)",
                                },
                            }}
                        >
                            Go Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={resending ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                            onClick={handleResendEmail}
                            disabled={resending}
                            sx={{
                                flex: { xs: "1", sm: "0 1 auto" },
                                textTransform: "none",
                                px: 3,
                                py: 1.5,
                                fontSize: "1rem",
                                bgcolor: "var(--main-color)",
                                "&:hover": {
                                    bgcolor: "#5568d3",
                                },
                            }}
                        >
                            {resending ? "Sending..." : "Resend Email"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </SignInContBox>
    );
};

const VerifyEmail_Pending = () => {
    return (
        <Suspense fallback={
            <SignInContBox>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "70vh",
                        py: 4,
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            maxWidth: 600,
                            width: "100%",
                            p: { xs: 3, sm: 5 },
                            borderRadius: 4,
                            textAlign: "center",
                        }}
                    >
                        <CircularProgress size={60} sx={{ color: "var(--main-color)" }} />
                        <Typography sx={{ mt: 2, color: "#546e7a" }}>
                            Loading...
                        </Typography>
                    </Paper>
                </Box>
            </SignInContBox>
        }>
            <VerifyEmail_PendingContent />
        </Suspense>
    );
};

export default VerifyEmail_Pending;