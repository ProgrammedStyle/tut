import jwt from "jsonwebtoken";

const check = async ( req, res ) => {
    try {
        if ( !req.body.token )
            return res.status(401).json({ message: "Email verification code is not sent" });
        
        const token = jwt.verify(req.body.token, process.env.EMAIL_VERIFY_JWT_SECRET);
        
        if (token) {
            return res.status(201).json({
                message: "Email verified successfuly"
            });
        }
    } catch ( error ) {
        res.status(401).json({
            message: "Email verification code is not valid"
        });
    }
};

export default check;