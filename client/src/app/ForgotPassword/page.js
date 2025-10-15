"use client";

import SignInCont from "../components/SignInCont";
import signInContStyles from "../components/SignInCont/index.module.css";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import { Button, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../slices/loadingSlice";
import axios from "axios";
import LoadingLink from "../components/LoadingLink";

// Validation schema
const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Email is not a valid syntax" })
});

const ForgotPassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema)
    });

    // Check if user is logged in
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        setIsLoggedIn(!!userData);
    }, []);

    const onSucceededSubmit = async (data) => {
        try {
            dispatch(showLoading());
            setError(null);

            console.log("Requesting password reset for:", data.email);

            const res = await axios.post(`http://localhost:5000/api/user/forgot-password`, data);

            console.log("Password reset email sent:", res.data);

            setSuccess(true);
        } catch (error) {
            console.error("Forgot password error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to send reset email. Please try again.");
        } finally {
            dispatch(hideLoading());
        }
    };

    if (success) {
        return (
            <SignInContBox>
                <SignInCont 
                    title="Check Your Email"
                    image={<LockResetOutlinedIcon sx={{ fontSize: { xs: "120px", sm: "150px", md: "180px" }, opacity: "0.2", color: "var(--main-color)" }} />}
                >
                    <div className={signInContStyles.form} style={{ textAlign: 'center' }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: { xs: 1.5, sm: 2 }, 
                                color: 'success.main', 
                                fontWeight: 'bold', 
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                            }}
                        >
                            ✅ Email Sent Successfully!
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: { xs: 2, sm: 3 }, 
                                color: 'text.secondary', 
                                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' }
                            }}
                        >
                            We've sent a password reset link to your email address.
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mb: { xs: 2, sm: 3 }, 
                                color: 'text.secondary', 
                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' }
                            }}
                        >
                            Please check your inbox and click the link to reset your password.
                            The link will expire in 15 minutes.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => router.push(isLoggedIn ? "/Dashboard" : "/SignIn")}
                            fullWidth
                            sx={{ 
                                padding: { xs: '12px 24px', sm: '10px 22px', md: '8px 22px' },
                                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
                            }}
                        >
                            {isLoggedIn ? "Return to Dashboard" : "Back to Sign In"}
                        </Button>
                    </div>
                </SignInCont>
            </SignInContBox>
        );
    }

    return (
        <SignInContBox>
            <SignInCont 
                title="Forgot Password"
                image={<LockResetOutlinedIcon sx={{ fontSize: { xs: "120px", sm: "150px", md: "180px" }, opacity: "0.2", color: "var(--main-color)" }} />}
            >
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 3, textAlign: 'center' }}
                    >
                        Enter your email address and we'll send you a link to reset your password.
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
                            type: "email",
                            name: "email",
                            value: "",
                            error: (errors.email && errors.email.message),
                            inputTextStyle: signInContStyles.inputTextBox
                        }}
                        borderBottom={false}
                        bgColor={false}
                        linesColor={"blackColor"}
                        focusLinesColor={"focusMainColor"}
                        label="Email"
                        focus={true}
                        {...register("email")}
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
                            Send Reset Link
                        </Button>
                    </div>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Remember your password?{' '}
                            <LoadingLink href="/SignIn" style={{ textDecoration: 'none' }}>
                                <span style={{ color: 'var(--main-color)', cursor: 'pointer', fontWeight: 'medium' }}>
                                    Sign In
                                </span>
                            </LoadingLink>
                        </Typography>
                    </Box>
                </form>
            </SignInCont>
        </SignInContBox>
    );
};

export default ForgotPassword;
