const express = require('express')
const router = express.Router()
const { GetEmployees, GetEmployeeById, UpdateEmployee, DeleteEmployee } = require('../controllers/employeeController')

router.get('/', GetEmployees)
router.get('/:id', GetEmployeeById)
router.put('/:id', UpdateEmployee)
router.delete('/:id', DeleteEmployee)

module.exports = router