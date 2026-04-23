const express = require('express')
const router = express.Router()
const { registerDriver, getDriversDetailed, DeleteDriver, updateDriverData } = require('../controllers/driverController')
const { VerifyToken } = require('../middleware/auth')

router.get('/', VerifyToken, getDriversDetailed)
router.post('/', VerifyToken, registerDriver);
router.put('/:id', VerifyToken, updateDriverData);
router.delete('/:id', VerifyToken, DeleteDriver);

module.exports = router