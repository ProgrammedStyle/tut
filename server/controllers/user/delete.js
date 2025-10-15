import User from "../../models/User.js";

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Delete request - Target ID:', id);
        console.log('Delete request - Current User ID:', req.user?.id);
        console.log('Delete request - Current User _id:', req.user?._id);
        console.log('Delete request - Comparison:', req.user?.id.toString(), '===', id);
        
        // Don't allow users to delete themselves
        const currentUserId = req.user?.id?.toString() || req.user?._id?.toString();
        if (currentUserId === id) {
            console.log('BLOCKED: User trying to delete themselves!');
            return res.status(403).json({
                success: false,
                message: "You cannot delete your own account. Please use a different admin account."
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.json({
            success: true,
            message: `User ${user.email} deleted successfully`
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

export default deleteUser;

