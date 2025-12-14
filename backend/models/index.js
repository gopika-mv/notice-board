const sequelize = require('../config/database');
const User = require('./User');
const Department = require('./Department');
const Notice = require('./Notice');

// Associations
User.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(User, { foreignKey: 'department_id' });

Notice.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Notice, { foreignKey: 'department_id' });

Notice.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Notice, { foreignKey: 'author_id' });

Notice.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });
User.hasMany(Notice, { as: 'approvedNotices', foreignKey: 'approved_by' });

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync({ alter: true }); // Use alter to update schema without dropping
        // console.log('Database synced!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = { User, Department, Notice, syncDatabase };
