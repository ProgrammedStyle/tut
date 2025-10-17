const signout = async (req, res) => {
    try {
        // Clear the auth cookie with same settings used to set it
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        res.status(200).json({
            success: true,
            message: "Signed out successfully"
        });

    } catch (error) {
        console.error("Sign out error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during sign out"
        });
    }
};

export default signout;
