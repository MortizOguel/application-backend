const Route = require('../models/routeModel')
const Service = require('../models/serviceModel')
const Driver = require('../models/driverModel')

const stripHtml = (str) => str.replace(/<[^>]*>/g, '')

const CreateRoute = async (req, res) => {
    try {
        const { name, origin, destination, details } = req.body

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ message: 'El nombre de la ruta es requerido' })
        }
        if (!origin || typeof origin !== 'string' || origin.trim().length === 0) {
            return res.status(400).json({ message: 'El punto de inicio es requerido' })
        }
        if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
            return res.status(400).json({ message: 'El punto de llegada es requerido' })
        }

        req.body.name = stripHtml(name.trim()).slice(0, 100)
        req.body.origin = stripHtml(origin.trim()).slice(0, 100)
        req.body.destination = stripHtml(destination.trim()).slice(0, 100)
        if (details) req.body.details = stripHtml(details.trim()).slice(0, 500)

        const existing = await Route.findByName(req.body.name)
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Ya existe una ruta con este nombre' })
        }

        const route = await Route.create(req.body)
        res.status(201).json({
            message: 'Ruta registrada exitosamente',
            data: route
        })
    }catch(error){
        res.status(500).json({
            message: 'Error interno del servidor al crear una ruta'
        })
    }
}

const UpdateRoute = async(req, res) => {
    try{
        const { id } = req.params
        const activeServices = await Service.getActiveByRoute(id)
        if (activeServices.length > 0) {
            return res.status(409).json({
                message: 'No se puede editar la ruta: tiene asignaciones vigentes en el dashboard'
            })
        }
        const stripHtml = (str) => str.replace(/<[^>]*>/g, '')
        if (req.body.name) req.body.name = stripHtml(req.body.name).trim().slice(0, 100)
        if (req.body.origin) req.body.origin = stripHtml(req.body.origin).trim().slice(0, 100)
        if (req.body.destination) req.body.destination = stripHtml(req.body.destination).trim().slice(0, 100)
        if (req.body.details) req.body.details = stripHtml(req.body.details).trim().slice(0, 500)

        const current = await Route.getById(id)
        if (current && current.name !== req.body.name) {
            const existing = await Route.findByName(req.body.name)
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Ya existe una ruta con este nombre' })
            }
        }

        const UpdatedRoute = await Route.update(id, req.body)
        if(!UpdatedRoute) return res.status(404).json({
            message: 'Ruta no encontrada '
        })
        res.status(200).json({
            message: 'Ruta actualizada correctamente'
        }) 
    }catch(error){
        console.error('Error en UpdateRoute:', error)
        res.status(500).json({
            message: 'Error interno en el servidor al actualizar la ruta'
        })
    }
}

const DeleteRoute = async(req, res) => {
    try{
        const { id } = req.params
        const activeServices = await Service.getActiveByRoute(id)
        if (activeServices.length > 0) {
            return res.status(409).json({
                message: 'No se puede eliminar la ruta: tiene asignaciones vigentes en el dashboard'
            })
        }
        const deleted = await Route.softDelete(id)
        if(!deleted) return res.status(404).json({
            message: 'La ruta no se ha podido encontrar',
        })
        res.status(200).json({
            message: 'La ruta ha sido eliminada con exito',
        })
    }catch(error){
        res.status(500).json({
            message: 'Error interno del servidor al eliminar la ruta'
        })
    }
}

const GetRoutes = async (req, res) => {
    try {
        let routes
        if (req.user.id_rol === 3) {
            const driver = await Driver.getByIdUser(req.user.id_user)
            if (driver && driver.id_line) {
                routes = await Route.getByLineId(driver.id_line)
            } else {
                routes = []
            }
        } else {
            routes = await Route.getAll()
        }
        res.status(200).json(routes)
    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al obtener las rutas'
        })
    }
}

const GetRouteById = async (req, res) => {
    try {
        const { id } = req.params
        const route = await Route.getById(id)
        if (!route) return res.status(404).json({ message: 'Ruta no encontrada' })
        res.status(200).json(route)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ruta'})
    }
}

module.exports = { CreateRoute, UpdateRoute, DeleteRoute, GetRoutes, GetRouteById }