import ImageLink from "../../models/ImageLink.js";

const updateImageLink = async (req, res) => {
    try {
        const { imageId, language, link } = req.body;
        
        // Validation
        if (!imageId || imageId < 1 || imageId > 10) {
            return res.status(400).json({
                success: false,
                message: 'Invalid imageId. Must be between 1 and 10.'
            });
        }
        
        if (!language || !['sa', 'de', 'gb', 'it', 'es', 'ir', 'pk', 'tr', 'id', 'ru', 'in'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language. Must be one of: sa, de, gb, it, es, ir, pk, tr, id, ru, in'
            });
        }
        
        // Link validation (if provided)
        if (link !== null && link !== undefined && link !== '') {
            const trimmedLink = link.trim();
            // Basic URL validation - must start with http:// or https://
            if (trimmedLink && !trimmedLink.match(/^https?:\/\/.+/)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid link format. Link must start with http:// or https://'
                });
            }
        }
        
        // Update or create the image link
        const imageLink = await ImageLink.findOneAndUpdate(
            { imageId, language },
            { 
                imageId, 
                language, 
                link: link === '' ? null : link,  // Empty string = null (no link)
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
            message: 'Image link updated successfully',
            data: imageLink
        });
        
    } catch (error) {
        console.error('Error updating image link:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'An entry for this image and language already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update image link',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default updateImageLink;

