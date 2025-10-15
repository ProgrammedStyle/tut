import User from "../../models/User.js";
import PageView from "../../models/PageView.js";

const getStats = async (req, res) => {
    try {
        // Get total registered users
        const totalUsers = await User.countDocuments();
        
        // Get users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        // Calculate user growth percentage
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const previousPeriodUsers = await User.countDocuments({
            createdAt: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo
            }
        });
        
        const userGrowthPercentage = previousPeriodUsers > 0 
            ? ((recentUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
            : 0;

        // Get REAL visitor data from PageView collection
        const totalPageViews = await PageView.countDocuments();
        const totalVisitors = await PageView.distinct('sessionId').then(sessions => sessions.length);
        
        // Calculate visitors growth
        const previousPeriodVisitors = await PageView.distinct('sessionId', {
            timestamp: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo
            }
        }).then(sessions => sessions.length);
        
        const recentVisitors = await PageView.distinct('sessionId', {
            timestamp: { $gte: thirtyDaysAgo }
        }).then(sessions => sessions.length);
        
        const visitorsGrowth = previousPeriodVisitors > 0 
            ? ((recentVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100 
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalVisitors,
                recentUsers,
                userGrowthPercentage: Math.round(userGrowthPercentage * 10) / 10,
                visitorsGrowth: Math.round(visitorsGrowth * 10) / 10,
                conversionRate: totalVisitors > 0 ? Math.round((totalUsers / totalVisitors) * 100 * 10) / 10 : 0,
                pageViews: totalPageViews
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default getStats;
