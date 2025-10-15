const signout = async (req, res) => {
    try {
        // Clear the auth cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
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
