"use client";

import signInContStyles from "../components/SignInCont/index.module.css";
import SignInCont from "../components/SignInCont";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { Button, Box, Typography } from "@mui/material";
import userValidation_email from "../../../../modules/userValidation_email";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading } from "../slices/loadingSlice";
import SocialSignInBox from "../components/SocialSignInBox";
import axios from "../utils/axios";
import LoadingLink from "../components/LoadingLink";

const CreateEmail = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userValidation_email)
    });

    const onSucceededSubmit = async (submittedData) => {
        try {
            dispatch(showLoading());
            setError(null);
            
            // Send verification email
            const response = await axios.post('/api/user/email/verify/send', {
                email: submittedData.email
            });
            
            // If successful, navigate to verify email page
            router.push(`/CreateAccount/VerifyEmail?email=${encodeURIComponent(submittedData.email)}`);
        } catch (err) {
            console.error('Email verification send error:', err);
            setError(err.response?.data?.message || 'Failed to send verification email. Please try again.');
        }
    };

    return (
        <SignInContBox>
            <SignInCont title="Create Account" image={<PersonAddAltOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}>
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
                        {error && (
                            <Box sx={{ 
                                p: 2, 
                                mb: 2, 
                                bgcolor: '#ffebee', 
                                color: '#c62828', 
                                borderRadius: 1,
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </Box>
                        )}
                        
                        <InputText 
                            inputProps={{
                                type: "text",
                                value: "",
                                name: "email",
                                error: (errors.email && errors.email.message),
                                inputTextStyle: signInContStyles.inputTextBox
                            }}
                            borderBottom={false}
                            bgColor={false}
                            linesColor={"blackColor"}
                            focusLinesColor={"focusMainColor"}
                            label="Email"
                            focus={true}
                            { ...register("email") }
                        />
                    <div className={signInContStyles.formSubmitBox}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            sx={{ 
                                minWidth: { xs: '100%', sm: 'auto' },
                                padding: { xs: '10px 20px', sm: '8px 22px' },
                                '@media (min-width: 551px)': {
                                    fontSize: '13px !important'
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '14px !important',
                                    padding: '8px 22px'
                                }
                            }}
                        >
                            Next
                        </Button>
                    </div>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            fontSize: '12px'
                        }}>
                            Already have an account?{' '}
                            <LoadingLink href="/SignIn" style={{ textDecoration: 'none' }}>
                                <span style={{ color: 'var(--main-color)', cursor: 'pointer', fontWeight: 'medium' }}>
                                    Sign In
                                </span>
                            </LoadingLink>
                        </Typography>
                    </Box>
                </form>
                <SocialSignInBox />
            </SignInCont>
        </SignInContBox>
    );
};

export default CreateEmail;
