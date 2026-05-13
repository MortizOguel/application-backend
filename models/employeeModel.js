const { pool } = require('../config/db')

const Employee = {
  create: async (employeeData) => {
    const { id_user, employment_type, duration } = employeeData
    const query = `INSERT INTO employees (id_user, employment_type, duration) VALUES ($1, $2, $3) RETURNING *`
    const values = [id_user, employment_type, duration]
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  update: async (id_user, data) => {
    const updates = []
    const values = []
    let paramIndex = 1

    if (data.employment_type !== undefined && data.employment_type !== null) {
      updates.push(`employment_type = $${paramIndex++}`)
      values.push(data.employment_type)
    }
    if (data.duration !== undefined && data.duration !== null) {
      updates.push(`duration = $${paramIndex++}`)
      values.push(data.duration)
    }

    if (updates.length === 0) return null

    values.push(id_user)
    const query = `UPDATE employees SET ${updates.join(', ')} WHERE id_user = $${paramIndex} RETURNING *`
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  delete: async (id_user) => {
    const query = 'DELETE FROM employees WHERE id_user = $1'
    await pool.query(query, [id_user])
  },

  getByUserId: async (id_user) => {
    const query = 'SELECT * FROM employees WHERE id_user = $1'
    const { rows } = await pool.query(query, [id_user])
    return rows[0]
  },

  getAll: async () => {
    const query = `SELECT e.*, u.first_name, u.last_name, u.email, u.dni, u.status
      FROM employees e
      JOIN users u ON e.id_user = u.id_user
      WHERE u.status != 'deleted'
      ORDER BY u.id_user DESC`
    const { rows } = await pool.query(query)
    return rows
  },

  getById: async (id) => {
    const query = `SELECT e.*, u.first_name, u.last_name, u.email, u.dni, u.status
      FROM employees e
      JOIN users u ON e.id_user = u.id_user
      WHERE e.id_user = $1 AND u.status != 'deleted'`
    const { rows } = await pool.query(query, [id])
    return rows[0]
  }
}

module.exports = Employee