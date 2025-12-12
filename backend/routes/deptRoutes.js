const express = require('express');
const { getDepartments, createDepartment } = require('../controllers/deptController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); // Optional protection
const router = express.Router();

router.get('/', getDepartments);
router.post('/', createDepartment); // Open for seeding, usually Admin only

module.exports = router;
