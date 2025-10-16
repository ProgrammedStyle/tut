"use client";

import SignInCont from "../../components/SignInCont";
import signInContStyles from "../../components/SignInCont/index.module.css";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SignInContBox from "../../components/SignInContBox";
import InputText from "../../components/InputText";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import passwordSchema from "../../../../../modules/userValidation_password.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/slices/userSlice";
import { hideLoading, showLoading } from "../../slices/loadingSlice";
import axios from "axios";

const CreateAccount = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ error, setError ] = useState(null);
    const { register, handleSubmit, formState: {errors} } = useForm( { resolver: zodResolver(passwordSchema) } );

    useEffect(() => {
        dispatch(hideLoading());
        const emailToRegister = sessionStorage.getItem("emailToRegister");
        const emailVerified = sessionStorage.getItem("emailVerified");
        
        console.log("SessionStorage check:", {
            emailToRegister,
            emailVerified
        });
        
        if ( !emailToRegister || !emailVerified )
            router.push("/CreateAccount");
    }, [router, dispatch]);

    const onSucceededSubmit = async ( data ) => {
        try {
            dispatch(showLoading());
            data.email = sessionStorage.getItem("emailToRegister");
            
            console.log("Creating user with data:", {
                email: data.email,
                password: data.password ? "***" : "missing",
                confirmPassword: data.confirmPassword ? "***" : "missing"
            });
            
            const res = await axios.post(`http://localhost:5000/api/user/create`, data, {
                withCredentials: true
            });
            
            console.log("User created successfully:", res.data);
            
            // Store only necessary user data (not password)
            const userData = {
                email: data.email,
                id: res.data.user?.id
            };
            dispatch(setUserData(userData));
            localStorage.setItem('userData', JSON.stringify(userData));
            sessionStorage.removeItem("emailToRegister");
            sessionStorage.removeItem("emailVerified");
            router.push("/Dashboard");
        } catch ( error ) {
            console.error("User creation error:", error);
            console.error("Error response:", error.response);
            console.error("Error data:", error.response?.data);
            setError(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <SignInContBox>
            <SignInCont title="Create Account" image={<PersonAddAltOutlinedIcon sx={{ fontSize: "180px", opacity: "0.2", color: "var(--main-color)" }} />}>
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
                        focus={false}
                        { ...register("confirmPassword") }
                    />
                    <div className={signInContStyles.formSubmitBox}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            sx={{ 
                                minWidth: { xs: '100%', sm: 'auto' },
                                padding: { xs: '10px 20px', sm: '8px 22px' }
                            }}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </SignInCont>
        </SignInContBox>
    );
};

export default CreateAccount;