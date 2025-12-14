const express = require('express');
const { getPendingStaff, updateStaffStatus } = require('../controllers/staffController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin Routes - Staff Approval
router.get('/pending', verifyToken, verifyRole(['admin']), getPendingStaff);
router.put('/:id/status', verifyToken, verifyRole(['admin']), updateStaffStatus);

module.exports = router;
