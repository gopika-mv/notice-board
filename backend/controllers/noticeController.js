const { Notice, User, Department } = require('../models');
const { Op } = require('sequelize');

const createNotice = async (req, res) => {
    try {
        const { title, content, is_urgent } = req.body;
        // Department is auto-assigned from Staff's department
        const notice = await Notice.create({
            title,
            content,
            is_urgent,
            department_id: req.departmentId,
            author_id: req.userId,
            status: 'pending'
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error });
    }
};

const getNotices = async (req, res) => {
    try {
        const { search, department_id, date, is_urgent } = req.query;
        const { role, userId } = req;

        let whereClause = {};

        // Role-based visibility
        if (role === 'student') {
            whereClause.status = 'approved';
        } else if (role === 'staff') {
            if (role !== 'admin') {
                whereClause.status = 'approved';
            }
        }

        // Filters
        if (department_id) whereClause.department_id = department_id;
        if (is_urgent !== undefined && is_urgent !== '') {
            whereClause.is_urgent = is_urgent === 'true';
        }
        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            whereClause.date = { [Op.between]: [startOfDay, endOfDay] };
        }
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ];
        }

        const notices = await Notice.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Department, attributes: ['name'] }
            ],
            order: [['date', 'DESC']]
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error });
    }
};

const getPendingNotices = async (req, res) => {
    // Specifically for Admins
    try {
        const notices = await Notice.findAll({
            where: { status: 'pending' },
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Department, attributes: ['name'] }
            ],
            order: [['date', 'ASC']]
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending notices', error });
    }
};

const updateNoticeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const notice = await Notice.findByPk(id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        notice.status = status;
        await notice.save();

        res.json({ message: `Notice ${status}`, notice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notice', error });
    }
};

module.exports = { createNotice, getNotices, getPendingNotices, updateNoticeStatus };
