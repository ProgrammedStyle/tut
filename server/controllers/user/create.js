import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import emailSchema from "../../../modules/userValidation_email.js";
import passwordSchema from "../../../modules/userValidation_password.js";

const create = async ( req, res ) => {
    try {
        const emailParsedData = await emailSchema.safeParseAsync({ email: req.body.email });
        const passwordParsedData = await passwordSchema.safeParseAsync({ password: req.body.password, confirmPassword: req.body.confirmPassword });

        if ( !emailParsedData.success ) {
            console.log("Email validation failed:", emailParsedData.error.errors);
            return res.status(400).json({ message: emailParsedData.error.errors[0].message });
        }
        
        if ( !passwordParsedData.success ) {
            return res.status(400).json({ message: passwordParsedData.error.errors[0].message });
        }

        const { email } = emailParsedData.data;
        const { password } = passwordParsedData.data;

        const existingUser = await User.findOne({ email });
        if ( existingUser )
            return res.status(400).json({ message: "This email was taken" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
            role: "admin"
        });

        await newUser.save();

        const token = jwt.sign(
            {
                id: newUser._id,
                email
            },
            `${process.env.JWT_SECRET}`,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Always secure for HTTPS
            sameSite: 'none', // Allow cross-domain
            maxAge: 1000 * 60 * 60 * 24
        });

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                hasPassword: !!newUser.password
            },
            token: token, // Include token in response for frontend to store
            message: "Account created successfully"
        });
    } catch ( error ) {
        console.error("User creation error:", error);
        res.status(500).json({ 
            message: "Some error occured while creating your account",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default create;