"use client";

// Force dynamic rendering due to useSearchParams
export const dynamic = 'force-dynamic';

import SignInCont from "../components/SignInCont";
import signInContStyles from "../components/SignInCont/index.module.css";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../slices/loadingSlice";
import axios from "../utils/axios";
import LoadingLink from "../components/LoadingLink";
// Manually controlling loading instead of usePageReady to avoid conflicts

// Validation schema
const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);
    const hasCalledPageReady = useRef(false);
    const hasHandledSuccess = useRef(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });
    
    // Check if user is already logged in
    const isAuthenticated = !!userData;

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            setError("Invalid or missing reset token");
        } else {
            setToken(tokenParam);
        }
        
        // Wait for rendering to complete
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPageRendered(true);
            }, 1000);
        });
    }, [searchParams]);

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

    // When form submits successfully, wait for success view to render before hiding loading
    useEffect(() => {
        if (success && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true;
            // Wait for browser to paint the success view, then add buffer time
            requestAnimationFrame(() => {
                setTimeout(() => {
                    dispatch(hideLoading());
                }, 3500); // Wait 3.5 seconds after paint for complete stability
            });
        }
    }, [success, dispatch]);

    const onSucceededSubmit = async (data) => {
        try {
            dispatch(showLoading());
            setError(null);

            console.log("Resetting password with token");

            const res = await axios.post(`/api/user/reset-password`, {
                token,
                password: data.password,
                confirmPassword: data.confirmPassword
            });

            console.log("Password reset successful:", res.data);

            setSuccess(true);
            // Loading will be hidden by useEffect after success view renders
        } catch (error) {
            console.error("Reset password error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to reset password. The link may have expired.");
            dispatch(hideLoading()); // Hide loading on error
        }
    };

    if (success) {
        return (
            <SignInContBox>
                <SignInCont 
                    title="Password Reset Successful" 
                    image={<LockResetOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}
                >
                    <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 0 } }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold', fontSize: '1.25rem' }}>
                            ✅ Password Changed Successfully!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontSize: '1rem' }}>
                            {isAuthenticated 
                                ? "Your password has been updated. You're still logged in with your new password."
                                : "Your password has been reset. You can now sign in with your new password."
                            }
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                dispatch(showLoading());
                                router.push(isAuthenticated ? "/Dashboard" : "/SignIn");
                            }}
                            fullWidth
                            sx={{ 
                                padding: { xs: '10px 20px', sm: '8px 22px' }
                            }}
                        >
                            {isAuthenticated ? 'Return to Dashboard' : 'Go to Sign In'}
                        </Button>
                    </Box>
                </SignInCont>
            </SignInContBox>
        );
    }

    if (!token) {
        return (
            <SignInContBox>
                <SignInCont 
                    title="Invalid Link" 
                    image={<LockResetOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "error" }} />}
                >
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body1" sx={{ mb: 3, color: 'error.main' }}>
                            Invalid or missing reset token. Please request a new password reset link.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                dispatch(showLoading());
                                router.push("/ForgotPassword");
                            }}
                            fullWidth
                        >
                            Request New Link
                        </Button>
                    </Box>
                </SignInCont>
            </SignInContBox>
        );
    }

    return (
        <SignInContBox>
            <SignInCont 
                title="Reset Password" 
                image={<LockResetOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}
            >
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                        Enter your new password below.
                    </Typography>

                    {error && (
                        <Box sx={{ 
                            mb: 2, 
                            p: 2, 
                            backgroundColor: '#ffebee', 
                            borderRadius: 1,
                            border: '1px solid #ef5350'
                        }}>
                            <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                                {error}
                            </Typography>
                        </Box>
                    )}

                    <InputText
                        inputProps={{
                            type: "password",
                            name: "password",
                            value: "",
                            error: (errors.password && errors.password.message),
                            inputTextStyle: signInContStyles.inputTextBox
                        }}
                        borderBottom={false}
                        bgColor={false}
                        linesColor={"blackColor"}
                        focusLinesColor={"focusMainColor"}
                        label="New Password"
                        focus={true}
                        {...register("password")}
                    />

                    <InputText
                        inputProps={{
                            type: "password",
                            name: "confirmPassword",
                            value: "",
                            error: (errors.confirmPassword && errors.confirmPassword.message),
                            inputTextStyle: signInContStyles.inputTextBox
                        }}
                        borderBottom={false}
                        bgColor={false}
                        linesColor={"blackColor"}
                        focusLinesColor={"focusMainColor"}
                        label="Confirm New Password"
                        focus={false}
                        {...register("confirmPassword")}
                    />

                    <div className={signInContStyles.formSubmitBox}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            sx={{ 
                                minWidth: { xs: '100%', sm: 'auto' },
                                padding: { xs: '10px 20px', sm: '8px 22px' }
                            }}
                        >
                            Reset Password
                        </Button>
                    </div>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" component="div">
                            Remember your password?{' '}
                            <LoadingLink href="/SignIn" style={{ textDecoration: 'none' }}>
                                <Typography component="span" sx={{ color: 'var(--main-color)', cursor: 'pointer', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                                    Sign In
                                </Typography>
                            </LoadingLink>
                        </Typography>
                    </Box>
                </form>
            </SignInCont>
        </SignInContBox>
    );
};

const ResetPassword = () => {
    return (
        <Suspense fallback={
            <SignInContBox>
                <SignInCont 
                    title="Reset Password"
                    image={<LockResetOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                </SignInCont>
            </SignInContBox>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword;
