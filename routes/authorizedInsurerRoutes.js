const express = require('express')
const router = express.Router()
const {
  createInsurer, GetInsurers, GetInsurerById, UpdateInsurer, DeleteInsurer,
} = require('../controllers/authorizedInsurerController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.get('/', VerifyToken, checkRole([1, 2]), GetInsurers)
router.get('/:id', VerifyToken, checkRole([1, 2]), GetInsurerById)
router.post('/', VerifyToken, checkRole([1]), createInsurer)
router.put('/:id', VerifyToken, checkRole([1]), UpdateInsurer)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteInsurer)

module.exports = router
