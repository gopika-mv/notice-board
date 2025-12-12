const express = require('express');
const { createNotice, getNotices, getPendingNotices, updateNoticeStatus } = require('../controllers/noticeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Public/Student routes (Authenticated but any role)
// Actually students must be logged in? Assuming yes.
router.get('/', verifyToken, getNotices);

// Staff Routes
router.post('/', verifyToken, verifyRole(['staff']), createNotice);

// Admin Routes
router.get('/pending', verifyToken, verifyRole(['admin']), getPendingNotices);
router.put('/:id/status', verifyToken, verifyRole(['admin']), updateNoticeStatus);

module.exports = router;
