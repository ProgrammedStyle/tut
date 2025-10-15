"use client";

import { useState, useEffect } from "react";
import SignInCont from "../../../components/SignInCont";
import SignInContBox from "../../../components/SignInContBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../../slices/loadingSlice";
import axios from "axios";

const VerifyEmail_Check = () => {
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

export default VerifyEmail_Check;