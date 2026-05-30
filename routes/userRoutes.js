const express = require ('express')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')
const { LoginUser, RegisterUser } = require('../controllers/authController')
const { UpdateUser, DeleteUser, GetUsers, GetUserById, ChangePassword } = require('../controllers/userController')

const router = express.Router()

router.post('/login', LoginUser)
router.post('/register', VerifyToken, checkRole([1]), RegisterUser)
router.get('/', VerifyToken, checkRole([1]), GetUsers)
router.get('/:id', VerifyToken, checkRole([1]), GetUserById)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteUser)
router.put('/change-password', VerifyToken, ChangePassword)
router.put('/:id', VerifyToken, checkRole([1, 2]), UpdateUser)

router.get('/profile', VerifyToken, (req, res) => {
    res.status(200).json({
        message: 'Acceso autorizado',
        user: req.user
    })
})

module.exports = router
