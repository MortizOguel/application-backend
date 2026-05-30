const Service = require('../models/serviceModel')
const Unit = require('../models/unitModel')
const Route = require('../models/routeModel')
const Driver = require('../models/driverModel')

const createService = async (req, res) => {
    try {
        console.log('=== CREATE SERVICE ===')
        console.log('Body recibido:', req.body)
        
        const { id_unit, id_route, id_driver, id_line, quantity_passenger, transport_fee, transport_fee_suburban, start_date, finish_date } = req.body

        // Validar campos obligatorios
        if (!id_unit || !id_route || !id_driver || !id_line || !start_date || !finish_date) {
            console.log('Error: Faltan campos obligatorios')
            return res.status(400).json({ 
                message: 'Faltan campos obligatorios: id_unit, id_route, id_driver, id_line, start_date, finish_date' 
            })
        }

        // Validar que los IDs sean números válidos
        if (isNaN(Number(id_unit)) || isNaN(Number(id_route)) || isNaN(Number(id_driver)) || isNaN(Number(id_line))) {
            console.log('Error: Los IDs deben ser números válidos')
            return res.status(400).json({ 
                message: 'Los IDs deben ser números válidos' 
            })
        }

        console.log('Validando unidad:', id_unit)
        // Validar que la unidad pertenece a la línea seleccionada
        const unidad = await Unit.getById(id_unit)
        if (unidad && Number(unidad.id_line) !== Number(id_line)) {
            console.log('Error: La unidad no pertenece a la línea')
            return res.status(400).json({
                message: 'La unidad no pertenece a la línea seleccionada'
            })
        }

        console.log('Validando ruta:', id_route)
        // Validar que la ruta pertenece a la línea seleccionada
        const ruta = await Route.getById(id_route)
        if (ruta && Number(ruta.id_line) !== Number(id_line)) {
            console.log('Error: La ruta no pertenece a la línea')
            return res.status(400).json({
                message: 'La ruta no pertenece a la línea seleccionada'
            })
        }

        console.log('Validando conductor:', id_driver)
        // Validar que el conductor pertenece a la línea seleccionada
        const conductor = await Driver.getAllDetailed()
        const conductorFiltrado = conductor.find(c => c.id_user == id_driver)
        if (conductorFiltrado && Number(conductorFiltrado.id_line) !== Number(id_line)) {
            console.log('Error: El conductor no pertenece a la línea')
            return res.status(400).json({
                message: 'El conductor no pertenece a la línea seleccionada'
            })
        }

        console.log('Validando conflicto de horario')
        // Validar conflicto de horario del conductor
        const existingConflict = await Service.getByDriverAndDateRange(id_driver, start_date, finish_date)
        if (existingConflict.length > 0) {
            console.log('Error: Conflicto de horario')
            return res.status(409).json({
                message: 'El conductor ya tiene una asignación en este rango de horario',
                conflict: existingConflict
            })
        }

        console.log('Creando servicio en la base de datos')
        const service = await Service.create(req.body)
        console.log('Servicio creado exitosamente:', service)
        
        res.status(201).json({
            message: 'Asignación creada exitosamente',
            data: service
        })
    } catch (error) {
        console.error('=== ERROR EN CREATE SERVICE ===')
        console.error('Error:', error.message)
        console.error('Stack:', error.stack)
        res.status(500).json({
            message: 'Error al crear la asignación',
            error: error.message
        })
    }
}

const getAllServices = async (req, res) => {
    try {
        const services = await Service.getAll()
        res.status(200).json(services)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las asignaciones',
            error: error.message
        })
    }
}

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params
        const service = await Service.getById(id)

        if (!service) {
            return res.status(404).json({ message: 'Asignación no encontrada' })
        }

        res.status(200).json(service)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener la asignación',
            error: error.message
        })
    }
}

const updateService = async (req, res) => {
    try {
        const { id } = req.params
        const { id_unit, id_route, id_driver, id_line, quantity_passenger, transport_fee, transport_fee_suburban, start_date, finish_date } = req.body

        if (!id_unit || !id_route || !id_driver || !id_line || !start_date || !finish_date) {
            return res.status(400).json({ 
                message: 'Faltan campos obligatorios: id_unit, id_route, id_driver, id_line, start_date, finish_date' 
            })
        }

        // Validar que la unidad pertenece a la línea seleccionada
        const unidad = await Unit.getById(id_unit)
        if (unidad && unidad.id_line != id_line) {
            return res.status(400).json({
                message: 'La unidad no pertenece a la línea seleccionada'
            })
        }

        // Validar que la ruta pertenece a la línea seleccionada
        const ruta = await Route.getById(id_route)
        if (ruta && ruta.id_line != id_line) {
            return res.status(400).json({
                message: 'La ruta no pertenece a la línea seleccionada'
            })
        }

        const service = await Service.update(id, req.body)

        if (!service) {
            return res.status(404).json({ message: 'Asignación no encontrada' })
        }

        res.status(200).json({
            message: 'Asignación actualizada exitosamente',
            data: service
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar la asignación',
            error: error.message
        })
    }
}

const deleteService = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Service.delete(id)

        if (!deleted) {
            return res.status(404).json({ message: 'Asignación no encontrada' })
        }

        res.status(200).json({ message: 'Asignación eliminada exitosamente' })
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar la asignación',
            error: error.message
        })
    }
}

const getActiveServicesByRoute = async (req, res) => {
    try {
        const { routeId } = req.params
        const services = await Service.getActiveByRoute(routeId)
        res.status(200).json(services)
    } catch (error) {
        res.status(500).json({
            message: 'Error al verificar asignaciones activas',
            error: error.message
        })
    }
}

const getMyServices = async (req, res) => {
    try {
        const services = await Service.getByDriverUserId(req.user.id_user)
        res.status(200).json(services)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener tus asignaciones',
            error: error.message
        })
    }
}

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getActiveServicesByRoute,
    getMyServices
}