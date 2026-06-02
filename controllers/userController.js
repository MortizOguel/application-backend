const User = require('../models/userModel')
const Driver = require('../models/driverModel')
const Employee = require('../models/employeeModel')
const bcrypt = require('bcrypt')

const UpdateUser = async(req, res) => {
    try{
        const { id } = req.params
        const { userData, driverData, employeeData, isDriver } = req.body

        if (!userData) {
            return res.status(400).json({ message: 'No se proporcionaron datos de usuario (userData) para actualizar' });
        }

        const updatedUser = await User.update(id, userData)

        if (isDriver && driverData) {
            console.log('--- UPDATE DRIVER DATA CALLED ---');
            console.log('license_photo length:', driverData.license_photo ? driverData.license_photo.length : 0);
            console.log('medic_photo length:', driverData.medic_photo ? driverData.medic_photo.length : 0);
            console.log('medic_photo preview:', driverData.medic_photo ? driverData.medic_photo.substring(0, 80) : 'N/A');
            await Driver.update(id, driverData)
        }

        if (employeeData) {
            const existingEmployee = await Employee.getByUserId(id)
            if (existingEmployee) {
                await Employee.update(id, employeeData)
            }
        }

        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            data: updatedUser
        })
    } catch(error){
        res.status(500).json({
            message: 'Fallo interno en el servidor a la hora de actualizar el usuario'
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
            message: 'Fallo interno en el servidor a la hora de eliminar el usuario'
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
            message: 'Error interno al recuperar la lista de usuarios'
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
        res.status(500).json({ message: 'Error en la consulta individual'})
    }
}



const ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id_user
    const user = await User.getById(userId)

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return res.status(401).json({ msg: 'La contraseña actual es incorrecta' })

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(newPassword, salt)

    await User.updatePassword(userId, hashed)

    res.status(200).json({ msg: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    res.status(500).json({ msg: 'Error al cambiar contraseña'})
  }
}

module.exports = { UpdateUser, DeleteUser, GetUsers, GetUserById, ChangePassword }