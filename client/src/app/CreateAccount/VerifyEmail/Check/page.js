"use client";

import { useEffect } from "react";
import SignInCont from "../components/SignInCont";
import SignInContBox from "../components/SignInContBox";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyEmail_Check = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(async () => {
        try {
            const data = { token: searchParams.get("token") };
            const res = await axios.post("http://localhost:5000/api/user/email/verify/check", data);
            sessionStorage.setItem("emailVerified", "true");
            router.push("/CreateAccount/CreatePassword");
        } catch ( error ) {

        }
    }, []);
    return (
        <SignInContBox>
            <SignInCont>
                Verifying your email
            </SignInCont>
        </SignInContBox>
    );
};

export default VerifyEmail_Check;