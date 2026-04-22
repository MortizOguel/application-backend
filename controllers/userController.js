const User = require('../models/userModel')
const Driver = require('../models/driverModel')

const UpdateUser = async(req, res) => {
    try{
        const { id } = req.params
        const { userData, driverData, employeeData } = req.body

        if (!userData) {
            return res.status(400).json({ message: 'No se proporcionaron datos de usuario (userData) para actualizar' });
        }

        const updatedUser = await User.update(id, userData)

        if(driverData) await Driver.update(id, driverData)

        if (employeeData) await Employee.update(id, employeeData)

        if (employeeData && typeof Employee !== 'undefined') {
            await Employee.update(id, employeeData);
        }   
    
    res.status(200).json({
        message: 'Usuario actualizado correctamente',
        data: updatedUser
    })
    } catch(error){
        res.status(500).json({
            message: 'Fallo interno en el servidor a la hora de actualizar el usuario',
            error: error.message
        })
    }
}

const DeleteUser = async(req, res) => {
    try{
        
        const { id } = req.params
        await User.delete(id)
        res.status(200).json({ message: 'Usuario inactivado lógicamente del sistema' })

    } catch(error){
        res.status(500).json({
            message: 'Fallo interno en el servidor a la hora de eliminar el usuario',
            error: error.message
        })
    }
}

const GetUsers = async (req, res) => {
    try {
        const users = await User.getAll()
        
        // Retornamos un código 200 (OK) con el arreglo de usuarios
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ 
            message: 'Error interno al recuperar la lista de usuarios', 
            error: error.message 
        })
    }
}

const GetUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.getById(id)
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error en la consulta individual', error: error.message })
    }
}



module.exports = { UpdateUser, DeleteUser, GetUsers, GetUserById }