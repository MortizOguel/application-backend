const express = require ('express')
const { VerifyToken } = require('../middleware/auth')
const { LoginUser, RegisterUser } = require('../controllers/authController')
const { UpdateUser, DeleteUser, GetUsers, GetUserById, ChangePassword } = require('../controllers/userController')

const router = express.Router()

router.post('/login', LoginUser)
router.post('/register', RegisterUser) // El registro institucional suele ser libre o restreñido
router.get('/', VerifyToken, GetUsers)
router.get('/:id', VerifyToken, GetUserById)
router.delete('/:id', VerifyToken, DeleteUser)
router.put('/change-password', VerifyToken, ChangePassword)
router.put('/:id', VerifyToken, UpdateUser)

router.get('/profile', VerifyToken, (req, res) => {
    res.status(200).json({
        message: 'Acceso autorizado',
        user: req.user
    })
})

module.exports = router