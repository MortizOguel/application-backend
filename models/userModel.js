const { pool } = require('../config/db')

const User = {
  // Método 1: Registro unificado (Usuario + Conductor) en una sola transacción
  createWithDriver: async (userData, driverData) => {
    const client = await pool.connect()
    try {
      await client.query('BEGIN') 

      const userQuery = `INSERT INTO users (dni, first_name, last_name, email, password, status, id_rol, photo)VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING id_user`
      const userValues = [
        userData.dni, userData.first_name, userData.last_name, 
        userData.email, userData.password, userData.status, userData.id_rol, userData.photo
      ]
      const userRes = await client.query(userQuery, userValues)
      const userId = userRes.rows[0].id_user

      const driverQuery = `INSERT INTO drivers (id_user, id_line, adress, admission_date, license_type, license_expiration_date, license_number, license_photo)VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
      const driverValues = [
        userId, driverData.id_line, driverData.adress, 
        driverData.admission_date, driverData.license_type, driverData.license_expiration_date,
        driverData.license_number, driverData.license_photo
      ]
      await client.query(driverQuery, driverValues)

      await client.query('COMMIT') 
      return { id_user: userId, message: 'Usuario y conductor creados exitosamente' }
    } catch (error) {
      await client.query('ROLLBACK') 
      throw error
    } finally {
      client.release()
    }
  },

  createWithEmployee: async (userData, employeeData) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const userQuery = 'INSERT INTO users (dni, first_name, last_name, email, password, status, id_rol, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_user'
    const userValues = [userData.dni, userData.first_name, userData.last_name, userData.email, userData.password, userData.status, userData.id_rol, userData.photo]
    const userRes = await client.query(userQuery, userValues)
    const userId = userRes.rows[0].id_user

    // Usamos las columnas exactas: employment_type y duration
    const empQuery = 'INSERT INTO employees (id_user, employment_type, duration) VALUES ($1, $2, $3)'
    const empValues = [userId, employeeData.employment_type, employeeData.duration]
    await client.query(empQuery, empValues)

    await client.query('COMMIT')
    return { id_user: userId, message: 'Usuario y empleado registrados con éxito' }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
},

  // Método 2: Registro de usuarios administrativos estándar
  create: async (userData) => {
    const query = `INSERT INTO users (dni, first_name, last_name, email, password, status, id_rol, photo)VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING id_user, email`
    const values = [
      userData.dni, userData.first_name, userData.last_name, 
      userData.email, userData.password, userData.status, userData.id_rol, userData.photo
    ]
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  getAll: async () => {
    const query = `
        SELECT 
            u.id_user, 
            u.dni, 
            u.first_name, 
            u.last_name, 
            u.email, 
            u.status, 
            u.id_rol,
            u.photo,
            r.rol_name 
        FROM users u 
        INNER JOIN roles r ON u.id_rol = r.id_rol 
        WHERE u.status != $1 
        ORDER BY u.id_user DESC
    `
    const { rows } = await pool.query(query, ['deleted'])
    return rows
},

  getById: async (id) => {
    const query = 'SELECT * FROM users WHERE id_user = $1 AND status != \'deleted\''
    const { rows } = await pool.query(query, [id])
    return rows[0]
  },

  //1.2 Editar usuarios
  update: async (id, data) => {
        const query = `UPDATE users SET first_name = $1, last_name = $2, status = $3, id_rol = $4, photo = COALESCE($5, photo) WHERE id_user = $6 RETURNING *`
        const values = [data.first_name, data.last_name, data.status, data.id_rol, data.photo || null, id]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

  delete: async(id, data) => {
    const query = `UPDATE users SET status = 'deleted' WHERE id_user = $1`
    await pool.query(query, [id])
  },

  updatePassword: async (id, hashedPassword) => {
    const query = 'UPDATE users SET password = $1 WHERE id_user = $2'
    await pool.query(query, [hashedPassword, id])
  },

  // Método 3: Búsqueda para autenticación
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1'
    const { rows } = await pool.query(query, [email])
    return rows[0]
  },

  // Método 4: Obtener lista para la tabla de conductores
  getAllDrivers: async () => {
    const query = `
      SELECT u.id_user, u.dni, u.first_name, u.last_name, d.id_driver, d.license_type, l.name as line_name
      FROM users u
      JOIN drivers d ON u.id_user = d.id_user
      JOIN lines l ON d.id_line = l.id_line
      WHERE u.status != 'deleted'
    `
    const { rows } = await pool.query(query)
    return rows
  }
}

module.exports = User