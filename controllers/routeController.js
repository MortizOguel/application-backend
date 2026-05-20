const Route = require('../models/routeModel')
const Service = require('../models/serviceModel')

const CreateRoute = async (req, res) => {
    try {
        const route = await Route.create(req.body)
        res.status(201).json({
            message: 'Ruta registrada exitosamente',
            data: route
        })
    }catch(error){
        res.status(500).json({
            message: 'Error interno del servidor al crear una ruta',
            error: error.message
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
            message: 'Error interno en el servidor al actualizar la ruta',
            error: error.message    
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
            message: 'Error interno del servidor al eliminar la ruta',
            error: error.message
        })
    }
}

const GetRoutes = async (req, res) => {
    try {
        const routes = await Route.getAll()
        res.status(200).json(routes)
    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al obtener las rutas',
            error: error.message
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
        res.status(500).json({ message: 'Error al obtener ruta', error: error.message })
    }
}

module.exports = { CreateRoute, UpdateRoute, DeleteRoute, GetRoutes, GetRouteById }