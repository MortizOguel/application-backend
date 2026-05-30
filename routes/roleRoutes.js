const express = require('express')
const router = express.Router()
const { VerifyToken } = require('../middleware/auth')
const { GetRoles } = require('../controllers/roleController')

router.get('/', VerifyToken, GetRoles)

module.exports = router
