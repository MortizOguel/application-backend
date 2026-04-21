const express = require ('express')
const { VerifyToken } = require('../middleware/auth')
const { LoginUser, RegisterUser } = require('../controllers/authController')

const router = express.Router()

router.post('/login', LoginUser)
router.post('/register', RegisterUser)

router.get('/profile', VerifyToken, (req, res) => {
    res.status(200).json({
        message: 'Acceso autorizado',
        user: req.user
    })
})

module.exports = router 