import User from "../../models/User.js";

const listUsers = async (req, res) => {
    try {
        // Get all users (excluding password and sensitive fields)
        const users = await User.find()
            .select('-password -emailVerifyToken')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.role).length;
        const adminUsers = users.filter(u => u.role === 'admin').length;

        res.status(200).json({
            success: true,
            data: {
                users: users.map(user => ({
                    id: user._id,
                    email: user.email,
                    role: user.role || 'user',
                    status: user.email ? 'active' : 'inactive',
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })),
                statistics: {
                    totalUsers,
                    activeUsers,
                    adminUsers,
                    inactiveUsers: totalUsers - activeUsers
                }
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default listUsers;
