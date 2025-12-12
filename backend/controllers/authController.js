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

        const token = jwt.sign(
            { id: user.id, role: user.role, department_id: user.department_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role, department_id: user.department_id } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Start: Seed helper (dev only)
const register = async (req, res) => {
    try {
        const { username, password, role, departmentName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        let department_id = null;
        if (departmentName) {
            const [dept] = await Department.findOrCreate({ where: { name: departmentName } });
            department_id = dept.id;
        }

        const user = await User.create({ username, password: hashedPassword, role, department_id });
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Error creating user: ' + error.message, error });
    }
};

module.exports = { login, register };
