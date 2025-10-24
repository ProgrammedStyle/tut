import VideoLink from "../../models/VideoLink.js";

const updateVideoLink = async (req, res) => {
    try {
        const { language, videoId, title } = req.body;
        
        // Validation
        if (!language || !['sa', 'de', 'gb', 'it', 'es', 'ir', 'pk', 'tr', 'id', 'ru', 'in'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language. Must be one of: sa, de, gb, it, es, ir, pk, tr, id, ru, in'
            });
        }
        
        if (!videoId || typeof videoId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Video ID is required and must be a string'
            });
        }
        
        // Validate YouTube Video ID format (11 characters)
        const trimmedVideoId = videoId.trim();
        if (!trimmedVideoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Video ID format. Must be exactly 11 characters (e.g., EDh8pgxsp8k)'
            });
        }
        
        // Update or create the video link
        const videoLink = await VideoLink.findOneAndUpdate(
            { language },
            { 
                language, 
                videoId: trimmedVideoId,
                videoUrl: `https://www.youtube.com/embed/${trimmedVideoId}?mute=0&showinfo=0&controls=0&start=0`,
                title: title || 'Jerusalem Virtual Guide Video',
                isActive: true 
            },
            { 
                new: true,  // Return updated document
                upsert: true,  // Create if doesn't exist
                runValidators: true 
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Video link updated successfully',
            data: videoLink
        });
        
    } catch (error) {
        console.error('Error updating video link:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'An entry for this language already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update video link',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default updateVideoLink;
