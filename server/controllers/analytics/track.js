import PageView from "../../models/PageView.js";

const trackPageView = async (req, res) => {
    try {
        const { path, sessionId } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');
        const referrer = req.get('referrer') || req.get('referer');
        
        await PageView.create({
            page: path,
            sessionId,
            ipAddress,
            userAgent,
            referrer,
            timestamp: new Date()
        });
        
        res.json({
            success: true,
            message: "Page view tracked"
        });
    } catch (error) {
        console.error("Track page view error:", error);
        // Don't send error to client - just silently fail
        res.json({
            success: false,
            message: "Failed to track page view"
        });
    }
};

export default trackPageView;
