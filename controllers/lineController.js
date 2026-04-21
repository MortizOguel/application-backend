const Line = require('../models/lineModel')

const RegisterLine = async (req, res) => {
    try{
        const NewLine = await Line.create(req.body);
        res.status(201).json({
            message: 'Linea registrada exitosamente',
            data: NewLine
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al registrar la linea',
            error: error.message
        })
    };
}

const GetLines = async (req, res) => {
        try {
            const lines = await Line.getAll();
            res.status(200).json(lines);
        } catch(error){
            res.status(500).json({
                message: 'Error al obtener las lineas',
                error: error.message
            })
        }
}

const UpdateLines = async (req, res) =>{
        try {
            const {id} = req.params
            const updatedLine = await Line.updated(req, body)
            res.status(200).json({
                message: 'Linea actualizada correctamente',
                data: updatedLine
            })
        }catch (error){
            res.status(500).json({
                message: 'Error al actualizar los datos de la linea',
                error: error.message
            })
        }
}

const DeleteLines = async(req, res) => {
        try{
            const {id} = req.params
            await Line.deleted(req, body )
            res.status(200).json({
                message: 'Linea eliminada exitosamente'
            })
        }catch(error){
            res.status(500).json({
                message: 'Error al eliminar la linea'
            })
        }
}

module.exports = {RegisterLine, GetLines, UpdateLines, DeleteLines}