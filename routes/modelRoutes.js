const express = require('express')
const router = express.Router()
const { VerifyToken } = require('../middleware/auth')
const { getModels } = require('../controllers/modelController')

router.get('/', VerifyToken, getModels)

module.exports = router
