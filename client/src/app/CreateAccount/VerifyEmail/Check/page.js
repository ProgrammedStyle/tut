"use client";

import { useState, useEffect, Suspense } from "react";
import SignInCont from "../../../components/SignInCont";
import SignInContBox from "../../../components/SignInContBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../../slices/loadingSlice";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

const VerifyEmail_CheckContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            dispatch(showLoading());
            try {
                const token = searchParams.get("token");
                const data = { token };
                const res = await axios.post(`http://localhost:5000/api/user/email/verify/check`, data);
                
                // Extract email from the JWT token
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                console.log("Decoded token:", decodedToken);
                console.log("Email from token:", decodedToken.email);
                
                sessionStorage.setItem("emailToRegister", decodedToken.email);
                sessionStorage.setItem("emailVerified", "true");
                router.push("/CreateAccount/CreatePassword");
            } catch ( error ) {
                setError(error.message);
            }
        };
        
        verifyEmail();
    }, [dispatch, searchParams, router]);

    return (
        <SignInContBox>
            <SignInCont>
                Verifying your email
            </SignInCont>
        </SignInContBox>
    );
};

const VerifyEmail_Check = () => {
    return (
        <Suspense fallback={
            <SignInContBox>
                <SignInCont>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                </SignInCont>
            </SignInContBox>
        }>
            <VerifyEmail_CheckContent />
        </Suspense>
    );
};

export default VerifyEmail_Check;