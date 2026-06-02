const express = require('express')
const router = express.Router()
const { VerifyToken } = require('../middleware/auth')
const { getBrands } = require('../controllers/brandController')

router.get('/', VerifyToken, getBrands)

module.exports = router
