"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import styles from "./index.module.css";

const SocialSignInBox = () => {
    // Social login buttons are visible but OAuth is not configured yet
    // To make them work: Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET to server/.env
    // See GOOGLE_OAUTH_SETUP.md for instructions
    const SOCIAL_LOGIN_ENABLED = true; // Changed to true - buttons will show but won't work until OAuth is configured

    if (!SOCIAL_LOGIN_ENABLED) {
        return null; // Hide social login buttons when not configured
    }

    var onGoogleLogin, onFacebookLogin;

            onGoogleLogin = () => {
                window.location.href = "http://localhost:5000/api/user/google";
            };

            onFacebookLogin = () => {
                window.location.href = "http://localhost:5000/api/user/facebook";
            };


    return (
        <React.Fragment>
            <div className={styles.socialButtonsHRBox}>
                <div className={styles.socialButtonsHR}></div>
                <div className={styles.socialButtonsHROr}>
                    OR
                </div>
                <div className={styles.socialButtonsHR}></div>
            </div>
            <div className={styles.socialButtonsBox}>
                <Button 
                    onClick={onGoogleLogin}
                    sx={{
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        minWidth: 0,
                        textTransform: 'none'
                    }}
                >
                    <div className={styles.socialIconBox}>
                        <FcGoogle size={20} />
                    </div>
                    Sign in using Google
                </Button>
                <Button 
                    onClick={onFacebookLogin}
                    sx={{
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        minWidth: 0,
                        textTransform: 'none'
                    }}
                >
                    <div className={styles.socialIconBox}>
                        <FaFacebookF size={18} />
                    </div>
                    Sign in using Facebook
                </Button>
            </div>
        </React.Fragment>
    );
};

export default SocialSignInBox;
