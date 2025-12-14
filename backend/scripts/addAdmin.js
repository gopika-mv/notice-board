const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const { User } = require('../models');

const addAdmin = async () => {
    try {
        const sequelize = require('../config/database');
        await sequelize.authenticate();
        console.log('Database connected...');

        // Check if admin already exists
        const existing = await User.findOne({ where: { username: 'admin' } });
        if (existing) {
            console.log('User admin already exists!');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('#notice@123#', 10);

        await User.create({
            username: 'admin',
            name: 'Campus Admin',
            password: hashedPassword,
            role: 'admin',
            department_id: null,
            approval_status: 'approved'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: #notice@123#');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

addAdmin();
