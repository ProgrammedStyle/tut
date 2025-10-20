"use client";

// Force dynamic rendering due to useSearchParams
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import SignInContBox from "../../../components/SignInContBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../../slices/loadingSlice";
import axios from "../../../utils/axios";
import { CircularProgress, Box, Typography, Paper, keyframes, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { usePageReady } from "../../../hooks/usePageReady";

// Animations
const spinAnimation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const checkmarkAnimation = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const shakeAnimation = keyframes`
    0%, 100% {
        transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
    }
    20%, 40%, 60%, 80% {
        transform: translateX(5px);
    }
`;

const VerifyEmail_CheckContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState("verifying"); // "verifying", "success", "error"
    const [error, setError] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get("token");
                
                if (!token) {
                    setError("Invalid verification link");
                    setStatus("error");
                    return;
                }

                const data = { token };
                const res = await axios.post(`/api/user/email/verify/check`, data);
                
                // Extract email from the JWT token
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                console.log("Decoded token:", decodedToken);
                console.log("Email from token:", decodedToken.email);
                
                sessionStorage.setItem("emailToRegister", decodedToken.email);
                sessionStorage.setItem("emailVerified", "true");
                
                setStatus("success");
                
                // Redirect after showing success message
                setTimeout(() => {
                    dispatch(showLoading());
                    router.push("/CreateAccount/CreatePassword");
                }, 2000);
            } catch (error) {
                console.error("Verification error:", error);
                setError(error.response?.data?.message || error.message || "Verification failed");
                setStatus("error");
            }
        };
        
        verifyEmail();
    }, [dispatch, searchParams, router]);

    // Wait for page rendering
    useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000);
        });
    }, []);

    // Page is ready after rendering
    usePageReady(pageRendered);

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
                        maxWidth: 500,
                        width: "100%",
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        textAlign: "center",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                    }}
                >
                    {/* Verifying State */}
                    {status === "verifying" && (
                        <>
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
                                    <VerifiedUserIcon
                                        sx={{
                                            fontSize: { xs: 80, sm: 100 },
                                            color: "var(--main-color)",
                                        }}
                                    />
                                    <CircularProgress
                                        size={120}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            marginTop: "-60px",
                                            marginLeft: "-60px",
                                            color: "var(--main-color)",
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1a237e",
                                    mb: 2,
                                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                                }}
                            >
                                Verifying Email
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#546e7a",
                                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                }}
                            >
                                Please wait while we verify your email address...
                            </Typography>
                        </>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: 3,
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: { xs: 80, sm: 100 },
                                        color: "#4caf50",
                                        animation: `${checkmarkAnimation} 0.6s ease-out`,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#2e7d32",
                                    mb: 2,
                                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                                }}
                            >
                                Email Verified!
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#546e7a",
                                    mb: 3,
                                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                }}
                            >
                                Your email has been successfully verified.
                            </Typography>

                            <Box
                                sx={{
                                    bgcolor: "#e8f5e9",
                                    p: 2,
                                    borderRadius: 2,
                                    border: "1px solid #c8e6c9",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#2e7d32",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Redirecting you to create your password...
                                </Typography>
                            </Box>
                        </>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: 3,
                                }}
                            >
                                <ErrorOutlineIcon
                                    sx={{
                                        fontSize: { xs: 80, sm: 100 },
                                        color: "#f44336",
                                        animation: `${shakeAnimation} 0.5s ease-out`,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#c62828",
                                    mb: 2,
                                    fontSize: { xs: "1.75rem", sm: "2.125rem" },
                                }}
                            >
                                Verification Failed
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#546e7a",
                                    mb: 3,
                                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                }}
                            >
                                {error || "We couldn't verify your email address."}
                            </Typography>

                            <Box
                                sx={{
                                    bgcolor: "#ffebee",
                                    p: 3,
                                    borderRadius: 2,
                                    border: "1px solid #ffcdd2",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#c62828",
                                        fontSize: "0.85rem",
                                        mb: 2,
                                    }}
                                >
                                    This could happen if:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#c62828",
                                        fontSize: "0.85rem",
                                        textAlign: "left",
                                        pl: 2,
                                    }}
                                >
                                    • The link has expired (valid for 15 minutes)
                                    <br />
                                    • The link has already been used
                                    <br />
                                    • The link is invalid or corrupted
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    dispatch(showLoading());
                                    router.push("/CreateAccount");
                                }}
                                sx={{
                                    textTransform: "none",
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1rem",
                                }}
                            >
                                Try Again
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </SignInContBox>
    );
};

const VerifyEmail_Check = () => {
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
                            maxWidth: 500,
                            width: "100%",
                            p: { xs: 3, sm: 5 },
                            borderRadius: 4,
                            textAlign: "center",
                        }}
                    >
                        <CircularProgress size={60} />
                        <Typography sx={{ mt: 2, color: "#546e7a" }}>
                            Loading...
                        </Typography>
                    </Paper>
                </Box>
            </SignInContBox>
        }>
            <VerifyEmail_CheckContent />
        </Suspense>
    );
};

export default VerifyEmail_Check;