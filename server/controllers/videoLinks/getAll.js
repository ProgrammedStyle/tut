import VideoLink from "../../models/VideoLink.js";

const getAllVideoLinks = async (req, res) => {
    try {
        const { language } = req.query;
        
        // Build query filter
        const filter = { isActive: true };
        if (language) {
            filter.language = language;
        }
        
        // Get all video links, sorted by language
        const videoLinks = await VideoLink.find(filter).sort({ language: 1 });
        
        // If language is specified, return the video URL for that language
        if (language) {
            const videoLink = videoLinks.find(link => link.language === language);
            
            if (videoLink) {
                return res.status(200).json({
                    success: true,
                    data: {
                        videoUrl: videoLink.videoUrl,
                        videoId: videoLink.videoId,
                        title: videoLink.title
                    }
                });
            } else {
                // Return default video if no language-specific video found
                return res.status(200).json({
                    success: true,
                    data: {
                        videoUrl: "https://www.youtube.com/embed/EDh8pgxsp8k?mute=0&showinfo=0&controls=0&start=0",
                        videoId: "EDh8pgxsp8k",
                        title: "Jerusalem Virtual Guide Video"
                    }
                });
            }
        }
        
        // Otherwise return all video links grouped by language
        const groupedLinks = {};
        videoLinks.forEach(link => {
            groupedLinks[link.language] = {
                videoUrl: link.videoUrl,
                videoId: link.videoId,
                title: link.title
            };
        });
        
        res.status(200).json({
            success: true,
            data: groupedLinks
        });
        
    } catch (error) {
        console.error('Error fetching video links:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video links',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default getAllVideoLinks;
