const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const { User, Department } = require('../models');
const bcrypt = require('bcrypt');

const createDBIfNeeded = async () => {
    const sequelizeRoot = new Sequelize('', process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    });
    await sequelizeRoot.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await sequelizeRoot.close();
};

const seed = async () => {
    try {
        await createDBIfNeeded();
        const sequelize = require('../config/database');
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Ensure tables exist

        // Create Department
        const [csDept] = await Department.findOrCreate({
            where: { name: 'Computer Science' },
            defaults: { name: 'Computer Science' }
        });
        console.log('Department ensure: Computer Science');

        const users = [
            { username: 'admin', password: 'admin123', role: 'admin', department_id: null, approval_status: 'approved' },
            { username: 'staff', password: 'staff123', role: 'staff', department_id: csDept.id, approval_status: 'approved' },
            { username: 'student', password: 'student123', role: 'student', department_id: csDept.id, approval_status: 'approved' }
        ];

        for (const u of users) {
            const existing = await User.findOne({ where: { username: u.username } });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await User.create({
                    username: u.username,
                    password: hashedPassword,
                    role: u.role,
                    department_id: u.department_id,
                    approval_status: u.approval_status
                });
                console.log(`Created user: ${u.username}`);
            } else {
                console.log(`User already exists: ${u.username}`);
            }
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seed();
