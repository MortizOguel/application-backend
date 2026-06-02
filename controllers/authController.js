const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const RegisterUser = async (req, res) => {
  const { userData, driverData, isDriver, employeeData, isEmployee } = req.body

  try {
    // Encriptacion de seguridad antes de persistir
    const salt = await bcrypt.genSalt(12)
    userData.password = await bcrypt.hash(userData.password, salt)

    if (isDriver && driverData) {
      // Flujo combinado para conductores
      console.log(`[Register] Creando conductor para usuario ${userData.email}`);
      
      const result = await User.createWithDriver(userData, driverData)
      return res.status(201).json(result)
    } 
    
    if (isEmployee && employeeData) {
      const result = await User.createWithEmployee(userData, employeeData)
      return res.status(201).json(result)
    }

    const result = await User.create(userData)
    res.status(201).json({ message: 'Usuario administrativo creado', data: result })
    
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro institucional'})
  }
}

const LoginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findByEmail(email)
    
    if (!user) {
      return res.status(404).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    const ValidPassword = await bcrypt.compare(password, user.password)

    if (!ValidPassword) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    const TokenPayload = {
      id_user: user.id_user,
      id_rol: user.id_rol
    }

    const token = jwt.sign(TokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '6h' })

    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 6 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: 'Autenticación exitosa',
      token: token,
      user: {
        id: user.id_user,
        dni: user.dni,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        id_rol: user.id_rol
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

const ForgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findByEmail(email)
    if (user) {
      console.log(`[Password Recovery] Solicitud para: ${email}`)
    }
  } catch (error) {
    console.error('[Password Recovery] Error interno:', error.message)
  }

  res.status(200).json({
    message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.'
  })
}

const GetMe = async (req, res) => {
  try {
    const user = await User.getById(req.user.id_user)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json({
      id: user.id_user,
      dni: user.dni,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`.trim(),
      first_name: user.first_name,
      last_name: user.last_name,
      id_rol: user.id_rol
    })
  } catch (error) {
    console.error('[GetMe] Error:', error.message)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { LoginUser, RegisterUser, ForgotPassword, GetMe }