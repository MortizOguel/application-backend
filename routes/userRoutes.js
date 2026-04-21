const express = require ('express')
const { VerifyToken } = require('../middleware/auth')
const { LoginUser } = require('../controllers/authController')

const router = express.Router()

router.post('/login', LoginUser)

router.get('/profile', VerifyToken, (req, res) => {
    res.status(200).json({
        message: 'Acceso autorizado'
    })
})

module.exports = { router }