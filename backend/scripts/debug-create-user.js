const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { User, Department } = require('../models');
const sequelize = require('../config/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const username = 'debug_user_' + Date.now();
        const password = 'password123';
        const role = 'student';
        const departmentName = 'CS';

        // Simulate logic from authController.register
        let department_id = null;
        if (departmentName) {
            const [dept] = await Department.findOrCreate({ where: { name: departmentName } });
            department_id = dept.id;
            console.log('Department found/created:', dept.toJSON());
        }

        console.log('Attempting to create user:', { username, role, department_id });
        const user = await User.create({ username, password, role, department_id });

        const result = {
            success: true,
            department_id,
            user: user.toJSON()
        };
        require('fs').writeFileSync('debug_result.json', JSON.stringify(result, null, 2));
    } catch (error) {
        const result = {
            success: false,
            error: error.message,
            stack: error.stack
        };
        require('fs').writeFileSync('debug_result.json', JSON.stringify(result, null, 2));
    } finally {
        await sequelize.close();
    }
};

run();
