const express = require('express')
const router = express.Router()
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')
const { GetMyDriverProfile } = require('../controllers/conductorController')

router.get('/me', VerifyToken, checkRole([1, 2, 3]), GetMyDriverProfile)

module.exports = router
