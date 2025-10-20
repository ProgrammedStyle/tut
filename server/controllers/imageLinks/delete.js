import ImageLink from "../../models/ImageLink.js";

const deleteImageLink = async (req, res) => {
    try {
        const { imageId, language } = req.query;
        
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
        
        // Delete the image link (or set link to null)
        const result = await ImageLink.findOneAndUpdate(
            { imageId: parseInt(imageId), language },
            { link: null },
            { new: true }
        );
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Image link not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Image link removed successfully',
            data: result
        });
        
    } catch (error) {
        console.error('Error deleting image link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image link',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default deleteImageLink;

