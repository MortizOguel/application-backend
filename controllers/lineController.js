const Line = require('../config/db')

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
}