import Analytics from "../../models/Analytics.js";
import User from "../../models/User.js";

const getAnalytics = async (req, res) => {
    try {
        // Get total page views
        const totalPageViews = await Analytics.countDocuments();
        
        // Get unique visitors (unique session IDs)
        const uniqueVisitors = await Analytics.distinct('sessionId');
        const uniqueVisitorsCount = uniqueVisitors.length;
        
        // Get page views from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentPageViews = await Analytics.countDocuments({
            timestamp: { $gte: thirtyDaysAgo }
        });
        
        // Get previous 30 days for comparison
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const previousPageViews = await Analytics.countDocuments({
            timestamp: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo
            }
        });
        
        // Calculate growth percentage
        const pageViewsGrowth = previousPageViews > 0 
            ? ((recentPageViews - previousPageViews) / previousPageViews) * 100 
            : 0;
        
        // Get top pages
        const topPagesData = await Analytics.aggregate([
            {
                $group: {
                    _id: '$pageView.path',
                    views: { $sum: 1 }
                }
            },
            { $sort: { views: -1 } },
            { $limit: 5 }
        ]);
        
        const topPages = topPagesData.map(page => ({
            page: page._id,
            views: page.views,
            percentage: totalPageViews > 0 ? (page.views / totalPageViews) * 100 : 0
        }));
        
        // Get traffic sources (based on referrer)
        const trafficSourcesData = await Analytics.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$pageView.referrer', null] },
                            'Direct',
                            {
                                $cond: [
                                    { $regexMatch: { input: '$pageView.referrer', regex: /google/i } },
                                    'Google Search',
                                    {
                                        $cond: [
                                            { $regexMatch: { input: '$pageView.referrer', regex: /facebook|twitter|instagram|linkedin/i } },
                                            'Social Media',
                                            'Referrals'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        const trafficSources = trafficSourcesData.map(source => ({
            source: source._id,
            visitors: source.count,
            percentage: uniqueVisitorsCount > 0 ? (source.count / uniqueVisitorsCount) * 100 : 0
        }));
        
        // Calculate bounce rate (sessions with only 1 page view)
        const sessionsWithMultipleViews = await Analytics.aggregate([
            {
                $group: {
                    _id: '$sessionId',
                    count: { $sum: 1 }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);
        
        const bounceRate = uniqueVisitorsCount > 0
            ? ((uniqueVisitorsCount - sessionsWithMultipleViews.length) / uniqueVisitorsCount) * 100
            : 0;
        
        // Calculate average session duration (mock for now - would need start/end tracking)
        const avgSessionDuration = 3.5; // This would require session start/end tracking
        
        res.status(200).json({
            success: true,
            data: {
                pageViews: totalPageViews,
                uniqueVisitors: uniqueVisitorsCount,
                bounceRate: Math.round(bounceRate * 10) / 10,
                avgSessionDuration,
                pageViewsGrowth: Math.round(pageViewsGrowth * 10) / 10,
                topPages,
                trafficSources
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics data",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default getAnalytics;
