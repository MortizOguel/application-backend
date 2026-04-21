const express = require('express')
const router = express.Router()
const { CreateRoute, UpdateRoute, DeleteRoute } = require('../controllers/routeController')
const { VerifyToken } = require('../middleware/auth')

router.post('/', VerifyToken, CreateRoute)
router.put('/:id', VerifyToken, UpdateRoute)
router.delete('/:id', VerifyToken, DeleteRoute)

module.exports = router