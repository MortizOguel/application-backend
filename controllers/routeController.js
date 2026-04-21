const Route = require('../models/routeModel')

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
        const UpdatedRoute = await Route.update(id, req.body)
        if(!UpdatedRoute) return res.status(404).json({
            message: 'Ruta no encontrada '
        })
        res.status(200).json({
            message: 'Ruta actualizada correctamente'
        }) 
    }catch(error){
        res.status(500).json({
            message: 'Error interno en el servidor al actualizar la ruta',
            error: error.message    
        })
    }
}

const DeleteRoute = async(req, res) => {
    try{
        const { id } = req.params
        const deleted = await Route.delete(id)
        if(!deleted) return res.status(404).json({
            message: 'La ruta a eliminar no se ha podido encontrar',
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

module.exports = { CreateRoute, UpdateRoute, DeleteRoute }