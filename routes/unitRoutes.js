const express = require('express');
const router = express.Router();
const { createUnit, UpdateUnit, DeleteUnit, GetUnits, GetUnitById, AssignDriverToUnit } = require('../controllers/unitController');
const { VerifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

router.get('/', VerifyToken, checkRole([1, 2]), GetUnits);
router.get('/:id', VerifyToken, checkRole([1, 2]), GetUnitById);
router.post('/', VerifyToken, checkRole([1]), createUnit);
router.put('/:id', VerifyToken, checkRole([1, 2]), UpdateUnit);
router.delete('/:id', VerifyToken, checkRole([1]), DeleteUnit);
router.patch('/:id/driver', VerifyToken, checkRole([1]), AssignDriverToUnit);

module.exports = router;
