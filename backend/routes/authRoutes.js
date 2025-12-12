const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/register', register); // Helper to create users

module.exports = router;
