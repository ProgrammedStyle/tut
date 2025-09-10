import { z } from "zod";

const passwordSchema = z.object({
    password: 
        z.string()
        .min(1, {message: "Password is required"})
        .min(6, {message: "Password must be 6 characters at least"})
        .max(64, {message: "The maximum is 64 characters for the password"})
        .regex(/[A-Za-z]/, {message: "Password must have at least one letter"})
        .regex(/[0-9]/, {message: "Password must have at least one number"})
        .regex(/[^0-9A-Za-z]/, {message: "Password must have at least one character like (* or $)"}),
    confirmPassword: z.string().min(1, {message: "You should confirm your password"})
}).refine(data => data.password === data.confirmPassword, {
    message: "The two passwords are not match",
    path: ["confirmPassword"]
});

export default passwordSchema;