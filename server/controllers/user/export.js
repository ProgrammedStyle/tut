import User from '../../models/User.js';

// Export users as CSV
const exportUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email role status createdAt updatedAt').lean();

        // Create CSV content
        const headers = ['Email', 'Role', 'Status', 'Created At', 'Last Updated'];
        const csvRows = [headers.join(',')];

        users.forEach(user => {
            const row = [
                user.email,
                user.role || 'user',
                user.status || 'active',
                new Date(user.createdAt).toISOString(),
                new Date(user.updatedAt).toISOString()
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=users_export_${new Date().toISOString().split('T')[0]}.csv`);
        
        res.send(csvContent);
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export users'
        });
    }
};

export default exportUsers;

