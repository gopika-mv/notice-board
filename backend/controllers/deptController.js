const { Department } = require('../models');

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error });
    }
};

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const dept = await Department.create({ name });
        res.status(201).json(dept);
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error });
    }
};

module.exports = { getDepartments, createDepartment };
