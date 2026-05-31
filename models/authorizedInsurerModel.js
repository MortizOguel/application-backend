const { pool } = require('../config/db')

const AuthorizedInsurer = {
  create: async (data) => {
    const { name_authorized_insurer, credential_insurer, insurer_rif } = data
    const query = `INSERT INTO authorized_insurer (name_authorized_insurer, credential_insurer, insurer_rif) VALUES ($1, $2, $3) RETURNING *`
    const { rows } = await pool.query(query, [name_authorized_insurer, credential_insurer, insurer_rif])
    return rows[0]
  },

  getAll: async () => {
    const query = `SELECT * FROM authorized_insurer ORDER BY name_authorized_insurer ASC`
    const { rows } = await pool.query(query)
    return rows
  },

  getById: async (id) => {
    const query = `SELECT * FROM authorized_insurer WHERE id_authorized_insurer = $1`
    const { rows } = await pool.query(query, [id])
    return rows[0]
  },

  update: async (id, data) => {
    const updates = []
    const values = []
    let paramIndex = 1

    const isValidValue = (val) => val !== undefined && val !== null

    if (isValidValue(data.name_authorized_insurer)) {
      updates.push(`name_authorized_insurer = $${paramIndex++}`)
      values.push(data.name_authorized_insurer)
    }
    if (isValidValue(data.credential_insurer)) {
      updates.push(`credential_insurer = $${paramIndex++}`)
      values.push(data.credential_insurer)
    }

    if (updates.length === 0) return null

    values.push(id)
    const query = `UPDATE authorized_insurer SET ${updates.join(', ')} WHERE id_authorized_insurer = $${paramIndex} RETURNING *`
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  findByRif: async (rif) => {
    const query = `SELECT id_authorized_insurer FROM authorized_insurer WHERE insurer_rif = $1`
    const { rows } = await pool.query(query, [rif])
    return rows[0] || null
  },

  findByName: async (name, excludeId = null) => {
    let query = `SELECT id_authorized_insurer FROM authorized_insurer WHERE name_authorized_insurer = $1`
    const params = [name]
    if (excludeId) {
      query += ` AND id_authorized_insurer != $2`
      params.push(excludeId)
    }
    const { rows } = await pool.query(query, params)
    return rows[0] || null
  },

  findByCredential: async (credential, excludeId = null) => {
    let query = `SELECT id_authorized_insurer FROM authorized_insurer WHERE credential_insurer = $1`
    const params = [credential]
    if (excludeId) {
      query += ` AND id_authorized_insurer != $2`
      params.push(excludeId)
    }
    const { rows } = await pool.query(query, params)
    return rows[0] || null
  },

  delete: async (id) => {
    const query = `DELETE FROM authorized_insurer WHERE id_authorized_insurer = $1 RETURNING *`
    const { rows } = await pool.query(query, [id])
    return rows[0] || null
  },

  hasUnits: async (id) => {
    const query = `SELECT COUNT(*) as count FROM units WHERE id_authorized_insurer_rcv = $1 OR id_authorized_insurer_personal = $1`
    const { rows } = await pool.query(query, [id])
    return parseInt(rows[0].count, 10) > 0
  },
}

module.exports = AuthorizedInsurer
