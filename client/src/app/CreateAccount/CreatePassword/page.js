"use client";

import SignInCont from "../components/SignInCont";
import signInContStyles from "../components/SignInCont/index.module.css";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SignInContBox from "../components/SignInContBox";
import InputText from "../components/InputText";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import passwordSchema from "../../../../modules/userValidation_password.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/slices/userSlice";
import { hideLoading, showLoading } from "../../slices/loadingSlice";

const CreateAccount = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);
    const { register, handleSubmit, formState: {errors} } = useForm( { resolver: zodResolver(passwordSchema) } );

    useEffect(() => {
        dispatch(hideLoading());
        if ( !sessionStorage.getItem("emailToRegister") || !sessionStorage.getItem("emailVerified") )
            router.push("/CreateAccount");
    }, []);

    const onSucceededSubmit = async ( data ) => {
        try {
            dispatch(showLoading());
            data.email = sessionStorage.getItem("emailToRegister");
            const res = await axios.post("http://localhost:5000/api/user/create", data);
            dispatch(setUserData(data));
            sessionStorage.removeItem("emailToRegister");
            sessionStorage.removeItem("emailVerified");
            router.push("/");
        } catch ( error ) {
            setError(error.message);
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <SignInContBox>
            <SignInCont title="Create Account" image={<PersonAddAltOutlinedIcon sx={{fontSize: "180px", opacity: "0.2", color: "var(--main-color)"}} />}>
                <form onSubmit={handleSubmit(onSucceededSubmit)} className={signInContStyles.form}>
                    <InputText 
                        inputProps={{
                            type: "password",
                            value: "",
                            name: "password",
                            error: (errors.password && errors.password.message),
                            inputTextStyle: signInContStyles.inputTextBox
                        }}
                        borderBottom={false}
                        bgColor={false}
                        linesColor={"blackColor"}
                        focusLinesColor={"focusMainColor"}
                        label="Password"
                        focus={true}
                        { ...register("password") }
                    />
                    <InputText 
                        inputProps={{
                            type: "password",
                            value: "",
                            name: "confirmPassword",
                            error: (errors.confirmPassword && errors.confirmPassword.message),
                            inputTextStyle: signInContStyles.inputTextBox
                        }}
                        borderBottom={false}
                        bgColor={false}
                        linesColor={"blackColor"}
                        focusLinesColor={"focusMainColor"}
                        label="Confirm Password"
                        focus={true}
                        { ...register("confirmPassword") }
                    />
                    <div className={signInContStyles.formSubmitBox}>
                        <Button type="submit" variant="contained" color="primary">
                            Create Account
                        </Button>
                    </div>
                </form>
            </SignInCont>
        </SignInContBox>
    );
};

export default CreateAccount;