const { pool } = require('../config/db')

const Unit = {
    create: async(unitData) => {
    const { id_line, id_model, plate, status, foto, id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal, serial_chasis } = unitData
    const query = `INSERT INTO units (id_line, id_model, plate, status, foto, id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal, serial_chasis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

    const values = [id_line, id_model, plate, status, foto, id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal, serial_chasis]
    const { rows } = await pool.query(query, values)
    return rows[0]
    },
    findByPlate: async (plate) => {
    const query = 'SELECT * FROM units WHERE plate = $1'
    const { rows } = await pool.query(query, [plate])
    return rows[0]
  },
    findBySerialChasis: async (serial, excludeId = null) => {
    let query = 'SELECT id_unit FROM units WHERE serial_chasis = $1'
    const params = [serial]
    if (excludeId) {
      query += ' AND id_unit != $2'
      params.push(excludeId)
    }
    const { rows } = await pool.query(query, params)
    return rows[0] || null
  },
    update: async(id, unitData) => {
    const updates = []
    const values = []
    let paramIndex = 1

    const isValidValue = (val) => val !== undefined && val !== null

    if (isValidValue(unitData.id_line)) {
        updates.push(`id_line = $${paramIndex++}`)
        values.push(unitData.id_line)
    }
    if (isValidValue(unitData.id_model)) {
        updates.push(`id_model = $${paramIndex++}`)
        values.push(unitData.id_model)
    }
    if (isValidValue(unitData.plate)) {
        updates.push(`plate = $${paramIndex++}`)
        values.push(unitData.plate)
    }
    if (isValidValue(unitData.status)) {
        updates.push(`status = $${paramIndex++}`)
        values.push(unitData.status)
    }
    if (isValidValue(unitData.foto)) {
        updates.push(`foto = $${paramIndex++}`)
        values.push(unitData.foto)
    }
    if (isValidValue(unitData.id_driver)) {
        updates.push(`id_driver = $${paramIndex++}`)
        values.push(unitData.id_driver)
    }
    if (isValidValue(unitData.id_authorized_insurer_rcv)) {
        updates.push(`id_authorized_insurer_rcv = $${paramIndex++}`)
        values.push(unitData.id_authorized_insurer_rcv)
    }
    if (isValidValue(unitData.id_authorized_insurer_personal)) {
        updates.push(`id_authorized_insurer_personal = $${paramIndex++}`)
        values.push(unitData.id_authorized_insurer_personal)
    }
    if (isValidValue(unitData.policy_number_rcv)) {
        updates.push(`policy_number_rcv = $${paramIndex++}`)
        values.push(unitData.policy_number_rcv)
    }
    if (isValidValue(unitData.policy_number_personal)) {
        updates.push(`policy_number_personal = $${paramIndex++}`)
        values.push(unitData.policy_number_personal)
    }
    if (isValidValue(unitData.serial_chasis)) {
        updates.push(`serial_chasis = $${paramIndex++}`)
        values.push(unitData.serial_chasis)
    }

    if (updates.length === 0) {
        return null
    }

    values.push(id)
    const query = `UPDATE units SET ${updates.join(', ')} WHERE id_unit = $${paramIndex} RETURNING *`
    const { rows } = await pool.query(query, values)
    return rows[0]
  },
delete: async (id) => {
    try {
        const numericId = parseInt(id, 10)
        if (isNaN(numericId)) {
            throw new Error('ID de unidad inválido: debe ser un número')
        }
        const checkQuery = `SELECT id_driver, plate FROM units WHERE id_unit = $1 AND status != 'deleted'`
        const { rows } = await pool.query(checkQuery, [numericId])
        if (rows.length === 0) {
            return false
        }
        const unit = rows[0]
        if (unit.id_driver) {
            const driverQuery = `SELECT u.first_name, u.last_name FROM drivers d JOIN users u ON d.id_user = u.id_user WHERE d.id_driver = $1`
            const { rows: driverRows } = await pool.query(driverQuery, [unit.id_driver])
            const driverName = driverRows.length > 0
                ? `${driverRows[0].first_name} ${driverRows[0].last_name}`.trim()
                : 'un conductor'
            const error = new Error(`No se puede eliminar la unidad ${unit.plate} porque tiene asignado el conductor ${driverName}. Desasigne el conductor primero.`)
            error.code = 'DRIVER_ASSIGNED'
            throw error
        }
        const query = `UPDATE units SET status = 'deleted' WHERE id_unit = $1 AND status != 'deleted' RETURNING *`
        const { rows: updatedRows } = await pool.query(query, [numericId])
        return updatedRows.length > 0
    } catch (error) {
        if (error.code === 'DRIVER_ASSIGNED') {
            throw error
        }
        console.error('Error en delete de unidad:', error.message)
        throw error
    }
},
    getAll: async () => {
    const query = `
      SELECT u.*, m.id_brand, b.brand_name as marca, m.model as modelo, l.name as line_name,
        air.name_authorized_insurer as insurer_rcv_name,
        aip.name_authorized_insurer as insurer_personal_name,
        du.first_name as driver_first_name, du.last_name as driver_last_name,
        du.dni as driver_dni
      FROM units u 
      LEFT JOIN models m ON u.id_model = m.id_model
      LEFT JOIN brands b ON m.id_brand = b.id_brand
      LEFT JOIN lines l ON u.id_line = l.id_line
      LEFT JOIN authorized_insurer air ON u.id_authorized_insurer_rcv = air.id_authorized_insurer
      LEFT JOIN authorized_insurer aip ON u.id_authorized_insurer_personal = aip.id_authorized_insurer
      LEFT JOIN drivers d ON u.id_driver = d.id_driver
      LEFT JOIN users du ON d.id_user = du.id_user
      WHERE u.status != 'deleted'
      ORDER BY u.id_unit ASC
    `
    const { rows } = await pool.query(query)
    return rows
    },

    getById: async (id) => {
        const query = `
          SELECT u.*, m.id_brand, b.brand_name as marca, m.model as modelo,
            air.name_authorized_insurer as insurer_rcv_name,
            aip.name_authorized_insurer as insurer_personal_name
          FROM units u 
          LEFT JOIN models m ON u.id_model = m.id_model 
          LEFT JOIN brands b ON m.id_brand = b.id_brand
          LEFT JOIN authorized_insurer air ON u.id_authorized_insurer_rcv = air.id_authorized_insurer
          LEFT JOIN authorized_insurer aip ON u.id_authorized_insurer_personal = aip.id_authorized_insurer
          WHERE u.id_unit = $1 AND u.status != 'deleted'
        `
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    assignDriver: async (id_unit, id_driver) => {
        const query = `UPDATE units SET id_driver = $1 WHERE id_unit = $2 RETURNING *`
        const { rows } = await pool.query(query, [id_driver, id_unit])
        return rows[0]
    },

    getByDriverId: async (id_driver) => {
        const query = `
          SELECT u.*, m.id_brand, b.brand_name as marca, m.model as modelo, l.name as line_name,
            air.name_authorized_insurer as insurer_rcv_name,
            aip.name_authorized_insurer as insurer_personal_name
          FROM units u
          LEFT JOIN models m ON u.id_model = m.id_model
          LEFT JOIN brands b ON m.id_brand = b.id_brand
          LEFT JOIN lines l ON u.id_line = l.id_line
          LEFT JOIN authorized_insurer air ON u.id_authorized_insurer_rcv = air.id_authorized_insurer
          LEFT JOIN authorized_insurer aip ON u.id_authorized_insurer_personal = aip.id_authorized_insurer
          WHERE u.id_driver = $1
          ORDER BY u.id_unit ASC
        `
        const { rows } = await pool.query(query, [id_driver])
        return rows
    },

    getUnassignedUnits: async () => {
        const query = `
          SELECT u.*, m.id_brand, b.brand_name as marca, m.model as modelo, l.name as line_name,
            air.name_authorized_insurer as insurer_rcv_name,
            aip.name_authorized_insurer as insurer_personal_name
          FROM units u
          LEFT JOIN models m ON u.id_model = m.id_model
          LEFT JOIN brands b ON m.id_brand = b.id_brand
          LEFT JOIN lines l ON u.id_line = l.id_line
          LEFT JOIN authorized_insurer air ON u.id_authorized_insurer_rcv = air.id_authorized_insurer
          LEFT JOIN authorized_insurer aip ON u.id_authorized_insurer_personal = aip.id_authorized_insurer
          WHERE u.id_driver IS NULL
          ORDER BY u.id_unit ASC
        `
        const { rows } = await pool.query(query)
        return rows
    },
}

module.exports = Unit