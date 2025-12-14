const { User, Department } = require('../models');

const getPendingStaff = async (req, res) => {
    try {
        const pendingStaff = await User.findAll({
            where: {
                role: 'staff',
                approval_status: 'pending'
            },
            include: [
                { model: Department, attributes: ['name'] }
            ],
            attributes: ['id', 'username', 'department_id', 'createdAt'],
            order: [['createdAt', 'ASC']]
        });
        res.json(pendingStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending staff', error });
    }
};

const updateStaffStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { approval_status } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role !== 'staff') {
            return res.status(400).json({ message: 'Can only approve/reject staff users' });
        }

        // Set to 'approved' or 'rejected'
        user.approval_status = approval_status;
        await user.save();

        const message = approval_status === 'approved' ? 'Staff approved' : 'Staff rejected';
        res.json({ message, user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff status', error });
    }
};

module.exports = { getPendingStaff, updateStaffStatus };
