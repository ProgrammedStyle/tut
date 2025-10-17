"use client";

import signInContStyles from "../components/SignInCont/index.module.css";
import SignInCont from "../components/SignInCont";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../slices/userSlice";
import { showLoading, hideLoading } from "../slices/loadingSlice";
import axios from "../utils/axios";
import LoadingLink from "../components/LoadingLink";
import { usePageReady } from "../hooks/usePageReady";

// Validation schema
const signInSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Email is not a valid syntax" }),
    password: z.string().min(1, { message: "Password is required" })
});

const SignIn = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);
    const [pageRendered, setPageRendered] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signInSchema)
    });

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

    const onSucceededSubmit = async (submittedData) => {
        dispatch(showLoading());
        setError(null);
        let shouldNavigate = false;
        
        try {
            console.log('🔐 Attempting sign in...');
            console.log('📡 API URL:', axios.defaults.baseURL || 'not set');
            
            const { data } = await axios.post("/api/user/signin", submittedData);

            console.log('✅ Sign in successful:', data);
            
            if (data && data.user) {
                console.log('💾 Saving user data to Redux and localStorage');
                
                // Save to Redux
                dispatch(setUserData(data.user));
                
                // Save to localStorage for persistence across page reloads
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Wait a moment for Redux state to update before navigating
                setTimeout(() => {
                    shouldNavigate = true;
                    console.log('🔄 Redirecting to Dashboard...');
                    // Keep loading visible during navigation
                    router.push("/Dashboard");
                }, 100);
            } else {
                console.error('⚠️ Sign in response missing user data:', data);
                setError("Invalid response from server. Please try again.");
            }
        } catch (err) {
            console.error('❌ Sign in error:', err);
            console.error('❌ Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                url: err.config?.url,
                baseURL: err.config?.baseURL
            });
            
            if (err.response?.status === 404) {
                setError("Server not reachable. Please check your connection.");
            } else if (err.response?.status === 0 || !err.response) {
                setError("Cannot connect to server. Please check if the backend is running.");
            } else {
                setError(err.response?.data?.message || "Failed to sign in. Please try again.");
            }
        } finally {
            // Only hide loading if we're not navigating
            if (!shouldNavigate) {
                dispatch(hideLoading());
            }
        }
    };

    return (
        <SignInContBox>
            <SignInCont 
                title="Sign In"
                image={<LockOpenOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}
            >
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
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
                        label="Password"
                        focus={false}
                        {...register("password")}
                    />

                    <Box sx={{ textAlign: 'right', mb: 2 }}>
                        <LoadingLink href="/ForgotPassword" style={{ textDecoration: 'none' }}>
                            <Typography 
                                variant="body2" 
                                sx={{ color: 'var(--main-color)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Forgot Password?
                            </Typography>
                        </LoadingLink>
                    </Box>

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
                            Sign In
                        </Button>
                    </div>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don&apos;t have an account?{' '}
                            <LoadingLink href="/CreateAccount" style={{ textDecoration: 'none' }}>
                                <span style={{ color: 'var(--main-color)', cursor: 'pointer', fontWeight: 'medium' }}>
                                    Create Account
                                </span>
                            </LoadingLink>
                        </Typography>
                    </Box>
                </form>
            </SignInCont>
        </SignInContBox>
    );
};

export default SignIn;
