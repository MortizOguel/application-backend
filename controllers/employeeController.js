const Employee = require('../models/employeeModel')

const GetEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll()
    res.status(200).json(employees)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados'})
  }
}

const GetEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.getById(id)
    if (!employee) return res.status(404).json({ message: 'Empleado no encontrado' })
    res.status(200).json(employee)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleado'})
  }
}

const UpdateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Employee.update(id, req.body)
    if (!updated) return res.status(404).json({ message: 'Empleado no encontrado' })
    res.status(200).json({ message: 'Empleado actualizado', data: updated })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar empleado'})
  }
}

const DeleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    await Employee.delete(id)
    res.status(200).json({ message: 'Empleado eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleado'})
  }
}

module.exports = { GetEmployees, GetEmployeeById, UpdateEmployee, DeleteEmployee }