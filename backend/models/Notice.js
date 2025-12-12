const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal',
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Notice;
