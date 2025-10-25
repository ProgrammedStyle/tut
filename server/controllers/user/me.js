import User from "../../models/User.js";

// Get current user from cookie
const me = async (req, res) => {
    try {
        console.log('🚀 /api/user/me endpoint called!');
        // req.user is set by the authenticateUser middleware
        if (req.user) {
            // Fetch full user to check password expiry
            const user = await User.findById(req.user._id);
            
            console.log('=== /api/user/me DEBUG ===');
            console.log('req.user exists?', !!req.user);
            console.log('req.user._id:', req.user?._id);
            console.log('req.user.email:', req.user?.email);
            console.log('req.user.password exists?', !!req.user?.password);
            console.log('Fresh user.password exists?', !!user?.password);
            
            // Check if password is expired
            let passwordExpired = false;
            if (user?.securitySettings?.passwordExpiry) {
                const passwordChangedAt = user.passwordChangedAt || user.createdAt;
                const minutesSinceChange = Math.floor((Date.now() - new Date(passwordChangedAt)) / (1000 * 60));
                const expiryMinutes = user.securitySettings?.passwordExpiryMinutes || 1;
                
                console.log('=== PASSWORD EXPIRY CHECK ===');
                console.log('Password expiry enabled:', user.securitySettings.passwordExpiry);
                console.log('Password changed at:', passwordChangedAt);
                console.log('Minutes since change:', minutesSinceChange);
                console.log('Expiry minutes:', expiryMinutes);
                
                if (minutesSinceChange >= expiryMinutes) {
                    passwordExpired = true;
                    console.log('🚨 PASSWORD EXPIRED! 🚨');
                } else {
                    console.log('Password is still valid');
                }
            } else {
                console.log('Password expiry is disabled');
            }
            
            const userData = {
                id: req.user._id,
                email: req.user.email,
                role: req.user.role,
                hasPassword: !!user.password, // Check if user has a password set (use fresh user data from DB)
                pendingEmail: user.pendingEmail || null // Include pending email if exists
            };
            
            console.log('Returning userData:', userData);
            console.log('Password expired?', passwordExpired);
            
            res.status(200).json({
                success: true,
                passwordExpired,
                user: userData
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
};

export default me;

