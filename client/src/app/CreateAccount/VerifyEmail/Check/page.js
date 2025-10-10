"use client";

import { useEffect } from "react";
import SignInCont from "../../../components/SignInCont";
import SignInContBox from "../../../components/SignInContBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../../slices/loadingSlice";
import axios from "axios";

const VerifyEmail_Check = () => {
    //const router = useRouter();
    //const searchParams = useSearchParams();
    const dispatch = useDispatch();
    //const [ error, setError ] = useState(null);

    /*useEffect(async () => {
        dispatch(showLoading());
        try {
            const data = { token: searchParams.get("token") };
            const res = await axios.post("http://localhost:5000/api/user/email/verify/check", data);
            sessionStorage.setItem("emailVerified", "true");
            router.push("/CreateAccount/CreatePassword");
        } catch ( error ) {
            setError(error.message);
        }
    }, []);*/

    return (
        <SignInContBox>
            <SignInCont>
                Verifying your email
            </SignInCont>
        </SignInContBox>
    );
};

export default VerifyEmail_Check;