import ImageLink from "../../models/ImageLink.js";

const getAllImageLinks = async (req, res) => {
    try {
        const { language } = req.query;
        
        // Build query filter
        const filter = { isActive: true };
        if (language) {
            filter.language = language;
        }
        
        // Get all image links, sorted by imageId
        const imageLinks = await ImageLink.find(filter).sort({ imageId: 1 });
        
        // If language is specified, return as object keyed by imageId with all data
        if (language) {
            const linksMap = {};
            imageLinks.forEach(link => {
                // Include all image link data
                linksMap[link.imageId] = {
                    link: link.link || null,
                    titleText: link.titleText || null,
                    subtitleText: link.subtitleText || null
                };
            });
            
            return res.status(200).json({
                success: true,
                data: linksMap
            });
        }
        
        // Otherwise return all links grouped by language
        const groupedLinks = {};
        imageLinks.forEach(link => {
            // Only include links that are not null or empty
            if (link.link && link.link.trim() !== '') {
                if (!groupedLinks[link.language]) {
                    groupedLinks[link.language] = {};
                }
                groupedLinks[link.language][link.imageId] = link.link;
            }
        });
        
        res.status(200).json({
            success: true,
            data: groupedLinks
        });
        
    } catch (error) {
        console.error('Error fetching image links:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch image links',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default getAllImageLinks;

