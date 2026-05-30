const express = require('express')
const router = express.Router()
const { registerDriver, getDriversDetailed, DeleteDriver, updateDriverData, getDriversWithUnits } = require('../controllers/driverController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.get('/', VerifyToken, checkRole([1, 2]), getDriversDetailed)
router.get('/with-units', VerifyToken, checkRole([1, 2]), getDriversWithUnits)
router.post('/', VerifyToken, checkRole([1]), registerDriver)
router.put('/:id', VerifyToken, checkRole([1, 2]), updateDriverData)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteDriver)

module.exports = router
