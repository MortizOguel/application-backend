const pool = require('../config/db')

const User = {
    create: async (userData) => {
        const {dni, first_name, last_name, email, password, status, id_rol} = UserData
        const query = `INSERT INTO users (DNI, first_name, last_name, email, password, status, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING id_user, email, first_name`

        const values = [dni, first_name, last_name, email, password, status, id_rol]
        const {rows} = await pool.query(query, values)
        return rows[0]
    },

    findByemail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1'
        const {rows} = await pool.query(query, [email])
        return rows[0]
    },

    getProfile: async (id_user) => {
        const query = `SELECT u.id_user, u.DNI, u.first_name, u.last_name, u.email, u.status, r.rol_nameFROM users uJOIN roles r ON u.id_rol = r.id_rolWHERE u.id_user = $1`
        const { rows } = await pool.query(query, [id_user])
        return rows[0]
    }
}

module.exports = User