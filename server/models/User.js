import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: false
        },
        googleIDD: {
            type: String,
            required: false
        },
        facebookIDD: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;