const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Department } = require('../models');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ message: 'Invalid password' });

        // Check if staff user is approved
        if (user.role === 'staff') {
            if (user.approval_status === 'rejected') {
                return res.status(403).json({ message: 'Your account has been rejected. Please contact admin.' });
            }
            if (user.approval_status === 'pending') {
                return res.status(403).json({ message: 'Your account is pending admin approval' });
            }
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, department_id: user.department_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role, department_id: user.department_id } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Start: Seed helper (dev only)
const register = async (req, res) => {
    try {
        const { username, password, name, role, department_id } = req.body; // added name
        const hashedPassword = await bcrypt.hash(password, 10);

        // Staff users need admin approval, others are auto-approved
        const approval_status = role === 'staff' ? 'pending' : 'approved';

        const user = await User.create({
            username,
            password: hashedPassword,
            name, // added name
            role,
            department_id,
            approval_status
        });

        const message = role === 'staff'
            ? 'Staff registration successful. Please wait for admin approval to login.'
            : 'User created';

        res.status(201).json({ message, user });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Error creating user: ' + error.message, error });
    }
};

module.exports = { login, register };
