const express = require ('express')
const rateLimit = require('express-rate-limit')
const { body } = require('express-validator')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')
const { LoginUser, RegisterUser, ForgotPassword, GetMe } = require('../controllers/authController')
const { UpdateUser, DeleteUser, GetUsers, GetUserById, ChangePassword } = require('../controllers/userController')
const { handleValidationErrors } = require('../middleware/errorHandler')

const router = express.Router()

// Rate limit específico para login: 5 intentos por ventana de 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' }
})

const loginValidation = [
  body('email').isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]

const registerValidation = [
  body('userData.dni').notEmpty().withMessage('DNI obligatorio'),
  body('userData.email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('userData.password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('userData.first_name').notEmpty().withMessage('Nombre obligatorio'),
  body('userData.last_name').notEmpty().withMessage('Apellido obligatorio')
]

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Correo electrónico inválido').normalizeEmail()
]

router.post('/login', loginLimiter, loginValidation, handleValidationErrors, LoginUser)
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, ForgotPassword)
router.post('/register', VerifyToken, checkRole([1]), registerValidation, handleValidationErrors, RegisterUser)
router.get('/', VerifyToken, checkRole([1]), GetUsers)
router.get('/me', VerifyToken, GetMe)
router.get('/:id', VerifyToken, checkRole([1]), GetUserById)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteUser)
router.put('/change-password', VerifyToken, ChangePassword)
router.put('/:id', VerifyToken, checkRole([1, 2]), UpdateUser)

module.exports = router
