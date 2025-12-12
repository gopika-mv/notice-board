const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { User } = require('../models');
const sequelize = require('../config/database');

const check = async () => {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        console.log('Users found:', users.map(u => u.username));
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await sequelize.close();
    }
};

check();
