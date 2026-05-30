const express = require('express')
const router = express.Router()
const { RegisterLine, UpdateLines, GetLines, GetLineById, DeleteLines } = require('../controllers/lineController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.post('/', VerifyToken, checkRole([1]), RegisterLine)
router.get('/', VerifyToken, checkRole([1, 2]), GetLines)
router.get('/:id', VerifyToken, checkRole([1, 2]), GetLineById)
router.put('/:id', VerifyToken, checkRole([1]), UpdateLines)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteLines)

module.exports = router
