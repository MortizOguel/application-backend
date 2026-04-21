const express = require('express')
const router = express.Router
const { RegisterLine, UpdateLines, GetLines, DeleteLines } = require('../controllers/lineController')
const { VerifyToken } = require('../middleware/auth')

router.post('/', VerifyToken, RegisterLine)     // 5.1 Crear
router.put('/:id', VerifyToken, UpdateLines)  // 5.2 Editar
router.delete('/:id', VerifyToken, DeleteLines) // 5.3 Eliminar

module.exports = router