const get = async ( req, res ) => {
    res.status(201).json({
        isAuthenticated: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role
        }
    });
};

export default get;