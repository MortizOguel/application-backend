const express = require('express')
const router = express.Router()
const { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService,
    getActiveServicesByRoute
} = require('../controllers/serviceController')

router.post('/', createService)
router.get('/', getAllServices)
router.get('/active/route/:routeId', getActiveServicesByRoute)
router.get('/:id', getServiceById)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

module.exports = router