"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import styles from "./index.module.css";

const SocialSignInBox = () => {
    var onGoogleLogin, onFacebookLogin;

    useEffect(() => {
        onGoogleLogin = () => {
            window.location.href = "http://localhost:5000/api/user/google";
        };

        onFacebookLogin = () => {
            window.location.href = "http://localhost:5000/api/user/facebook";
        };
    }, []);

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
                <Button onClick={onGoogleLogin}>
                    <div className={styles.socialIconBox}>
                        <FcGoogle size={24} />
                    </div>
                    <div>
                        Sign in using Google
                    </div>
                </Button>
                <Button onClick={onFacebookLogin}>
                    <div className={styles.socialIconBox}>
                        <FaFacebookF size={20} />
                    </div>
                    <div>
                        Sign in using Facebook
                    </div>
                </Button>
            </div>
        </React.Fragment>
    );
};

export default SocialSignInBox;