const express = require('express')
const router = express.Router()
const { CreateRoute, UpdateRoute, DeleteRoute, GetRoutes } = require('../controllers/routeController')
const { VerifyToken } = require('../middleware/auth')

router.get('/', GetRoutes)
router.post('/', VerifyToken, CreateRoute)
router.put('/:id', VerifyToken, UpdateRoute)
router.delete('/:id', VerifyToken, DeleteRoute)

module.exports = router