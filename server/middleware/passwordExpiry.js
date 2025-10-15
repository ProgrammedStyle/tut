import User from '../models/User.js';

// Middleware to check if password needs to be changed
const checkPasswordExpiry = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next();
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return next();
        }

        // Check if password expiry is enabled
        if (!user.securitySettings?.passwordExpiry) {
            return next();
        }

        // Calculate minutes since password was last changed
        const passwordChangedAt = user.passwordChangedAt || user.createdAt;
        const minutesSinceChange = Math.floor((Date.now() - new Date(passwordChangedAt)) / (1000 * 60));
        const expiryMinutes = user.securitySettings?.passwordExpiryMinutes || 1;

        // If password has expired, add flag to request
        if (minutesSinceChange >= expiryMinutes) {
            req.passwordExpired = true;
            req.minutesSinceChange = minutesSinceChange;
        }

        next();
    } catch (error) {
        console.error('Password expiry check error:', error);
        next();
    }
};

export default checkPasswordExpiry;

