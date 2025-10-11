"use client";

import SignInCont from "../components/SignInCont/index.js";
import signInContStyles from "../components/SignInCont/index.module.css";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailSchema from "../../../../modules/userValidation_email.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading } from "../slices/loadingSlice";
import SocialSignInBox from "../components/SocialSignInBox";
import axios from "axios";

const CreateEmail = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);
    const { register, handleSubmit, formState: {errors} } = useForm( { resolver: zodResolver(emailSchema) } );

    const onSucceededSubmit = async ( data ) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(`https://tut-o7qu.onrender.com/api/user/email/verify/send`, data);
            console.log(res);
            //sessionStorage.setItem("emailToRegister", data.email);
            //sessionStorage.removeItem("emailVerified");
            //router.push("/CreateAccount/VerifyEmail");
        } catch ( error ) {
            setError(error.message);
        }
    };

    return (
        <SignInContBox>
            <SignInCont title="Create Account" image={<PersonAddAltOutlinedIcon sx={{fontSize: "180px", opacity: "0.2", color: "var(--main-color)"}} />}>
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
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
                        <Button type="submit" variant="contained" color="primary">
                            Next
                        </Button>
                    </div>
                </form>
                <SocialSignInBox />
            </SignInCont>
        </SignInContBox>
    );
};

export default CreateEmail;