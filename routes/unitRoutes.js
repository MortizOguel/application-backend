const express = require('express');
const router = express.Router();
const { createUnit, UpdateUnit, DeleteUnit, GetUnits } = require('../controllers/unitController');
const { VerifyToken } = require('../middleware/auth');

router.get('/', GetUnits);
router.post('/', VerifyToken, createUnit);
router.put('/:id', VerifyToken, UpdateUnit);
router.delete('/:id', VerifyToken, DeleteUnit);

module.exports = router;