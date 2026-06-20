const { pool } = require('../config/db')

const Notification = {
  create: async (id_user, title, message, type) => {
    const query = `
      INSERT INTO notifications (id_user, title, message, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [id_user, title, message, type || 'info']
    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  getByUser: async (id_user, limit = 20) => {
    const query = `
      SELECT * FROM notifications
      WHERE id_user = $1
      ORDER BY created_at DESC
      LIMIT $2
    `
    const { rows } = await pool.query(query, [id_user, limit])
    return rows
  },

  getUnreadCount: async (id_user) => {
    const query = `
      SELECT COUNT(*) as count FROM notifications
      WHERE id_user = $1 AND is_read = false
    `
    const { rows } = await pool.query(query, [id_user])
    return parseInt(rows[0].count, 10)
  },

  markRead: async (id_notification) => {
    const query = `
      UPDATE notifications SET is_read = true
      WHERE id_notification = $1
      RETURNING *
    `
    const { rows } = await pool.query(query, [id_notification])
    return rows[0]
  },

  markAllRead: async (id_user) => {
    const query = `
      UPDATE notifications SET is_read = true
      WHERE id_user = $1 AND is_read = false
    `
    await pool.query(query, [id_user])
  },
}

module.exports = Notification
