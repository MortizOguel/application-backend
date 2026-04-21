const {pool} = require('../config/db')

const Driver = {
    create: async (driverData) => {
        const { id_user, id_line, adress, admission_date, license_type, license_expiration_date } = driverData
        const query = `INSERT INTO drivers (id_user, id_line, adress, admission_date, license_type, license_expiration_date)VALUES ($1, $2, $3, $4, $5, $6)RETURNING *`

        const values = [id_user, id_line, adress, admission_date, license_type, license_expiration_date]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    update: async(id_user, data) => {
        const query = `UPDATE drivers SET id_line = $1, adress = $2, license_type = $3, license_expiration_date = $4 WHERE id_user = $5 RETURNING *`
        const values = [data.id_line, data.adress, data.license_type, data.license_expiration_date, id_user]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    getAllDetailed: async() => {
        const query = `SELECT d.*, u.first_name, u.last_name, l.name as line_nameFROM drivers dJOIN users u ON d.id_user = u.id_userJOIN lines l ON d.id_line = l.id_line`
        const { rows } = await pool.query(query)
        return rows
    }
}

module.exports = Driver