"use client";

import SignInCont from "../../components/SignInCont";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SignInContBox from "../../components/SignInContBox";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "@/app/slices/loadingSlice";

const VerifyEmail_Pending = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(hideLoading());
        }, 300);
    }, [dispatch]);

    return (
        <SignInContBox>
            <SignInCont 
                title="Create Account" 
                image={<PersonAddAltOutlinedIcon sx={{ fontSize: { xs: "120px", sm: "150px", md: "180px" }, opacity: "0.2", color: "var(--main-color)" }} />}
            >
                Check your email and click the link to verify 
            </SignInCont>
        </SignInContBox>
    );
};

export default VerifyEmail_Pending;