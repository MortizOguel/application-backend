const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {pool} = require('../config/db')
require('dotenv').config()

const LoginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        
        if(results.row.lenght === 0){
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        const user = result.rows[0]
        const ValidPassword = await bcrypt.compare(password, user.password)

        if(!ValidPassword){
            return res.status(401).json({
                message: 'Correo o contraseña incorrectos'
            })
        }
        const TokenPayload = {
            id_user = user.id_user,
            id_rol = user.id_rol
        }

        const token = jwt.sign(TokenPayload, process.env.JWT_SECRET, {expiresIn: '6h'})

        res.status(200).json({
            message: 'Autenticación Exitosa'
        })
    } catch (error){
        res.status(500).json({
            message: 'Error interno del servidor'
        })
    }
}

module.exports = { LoginUser }