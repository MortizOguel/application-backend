const express = require('express')
const router = express.Router()
const { GetEmployees, GetEmployeeById, UpdateEmployee, DeleteEmployee } = require('../controllers/employeeController')
const { VerifyToken } = require('../middleware/auth')
const { checkRole } = require('../middleware/role')

router.get('/', VerifyToken, checkRole([1]), GetEmployees)
router.get('/:id', VerifyToken, checkRole([1]), GetEmployeeById)
router.put('/:id', VerifyToken, checkRole([1]), UpdateEmployee)
router.delete('/:id', VerifyToken, checkRole([1]), DeleteEmployee)

module.exports = router
