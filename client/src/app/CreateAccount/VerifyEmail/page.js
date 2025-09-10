"use client";

import SignInCont from "../components/SignInCont";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SignInContBox from "../components/SignInContBox";

const VerifyEmail_Pending = () => {
    return (
        <SignInContBox>
            <SignInCont title="Create Account" image={<PersonAddAltOutlinedIcon sx={{fontSize: "180px", opacity: "0.2", color: "var(--main-color)"}} />}>
                Check your email and click the link to verify 
            </SignInCont>
        </SignInContBox>
    );
};

export default VerifyEmail_Pending;