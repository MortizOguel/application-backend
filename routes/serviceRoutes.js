const express = require('express')
const router = express.Router()
const { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService,
    getActiveServicesByRoute,
    getMyServices
} = require('../controllers/serviceController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.post('/', VerifyToken, checkRole([1, 2]), createService)
router.get('/', VerifyToken, checkRole([1, 2]), getAllServices)
router.get('/mis-asignaciones', VerifyToken, checkRole([3]), getMyServices)
router.get('/active/route/:routeId', VerifyToken, checkRole([1, 2]), getActiveServicesByRoute)
router.get('/:id', VerifyToken, checkRole([1, 2]), getServiceById)
router.put('/:id', VerifyToken, checkRole([1, 2]), updateService)
router.delete('/:id', VerifyToken, checkRole([1, 2]), deleteService)

module.exports = router
