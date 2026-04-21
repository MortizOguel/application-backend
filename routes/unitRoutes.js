const express = require('express');
const router = express.Router();
const { createUnit } = require('../controllers/unitController');
const { VerifyToken } = require('../middleware/auth');

router.post('/', VerifyToken, createUnit);

module.exports = router;