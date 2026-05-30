const express = require('express')
const router = express.Router()
const { CreateRoute, UpdateRoute, DeleteRoute, GetRoutes, GetRouteById } = require('../controllers/routeController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.get('/', VerifyToken, checkRole([1, 2, 3]), GetRoutes)
router.get('/:id', VerifyToken, checkRole([1, 2, 3]), GetRouteById)
router.post('/', VerifyToken, checkRole([1, 2]), CreateRoute)
router.put('/:id', VerifyToken, checkRole([1, 2]), UpdateRoute)
router.delete('/:id', VerifyToken, checkRole([1, 2]), DeleteRoute)

module.exports = router
