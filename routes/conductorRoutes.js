const express = require('express')
const router = express.Router()
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')
const { GetMyDriverProfile, GetMyUnits, RenewLicense } = require('../controllers/conductorController')

router.get('/me', VerifyToken, checkRole([1, 2, 3]), GetMyDriverProfile)
router.get('/mis-unidades', VerifyToken, checkRole([3]), GetMyUnits)
router.put('/renovar-licencia', VerifyToken, checkRole([3]), RenewLicense)

module.exports = router
