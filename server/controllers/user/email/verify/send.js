import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const send = async ( req, res ) => {
    /*const transporter = nodemailer.createTransport({
        //host: process.env.SMTP_HOST,
        //port: process.env.SMTP_PORT,
        service: "gmail",
        auth: {
            user: `${process.env.SMTP_USER}`,
            pass: `${process.env.SMTP_PASS}`
        }
    });

    const token = jwt.sign({
        email: req.body.email
    }, `${process.env.EMAIL_VERIFY_JWT_SECRET}`, { expiresIn: "15m" });

    const verifyURL = `${process.env.CLIENT_URL}/CreateAccount/VerifyEmail/Check/?token=${token}`;

    await transporter.sendMail({
        from: "TUT",
        to: req.body.email,
        subject: "Please verify your email",
        html: `
            <div>
                Click <a href="${verifyURL}">here</a> to verify your email
            </div>
        `
    });
    res.status(201).json({
        message: "Check your email and click the link to verify"
    });*/
    res.status(201).json({
        message: "Check your email and click the link to verify"
    });
};

export default send;