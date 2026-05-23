const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/stats.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getStats);

module.exports = router;
