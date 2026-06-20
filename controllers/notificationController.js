const Notification = require('../models/notificationModel')

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getByUser(req.user.id_user)
    res.status(200).json(notifications)
  } catch (error) {
    console.error('Error en getMyNotifications:', error)
    res.status(500).json({ message: 'Error al obtener notificaciones' })
  }
}

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id_user)
    res.status(200).json({ count })
  } catch (error) {
    console.error('Error en getUnreadCount:', error)
    res.status(500).json({ message: 'Error al obtener conteo' })
  }
}

const markRead = async (req, res) => {
  try {
    const { id } = req.params
    const notification = await Notification.markRead(id)
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' })
    }
    res.status(200).json({ message: 'Notificación marcada como leída', data: notification })
  } catch (error) {
    console.error('Error en markRead:', error)
    res.status(500).json({ message: 'Error al marcar notificación' })
  }
}

const markAllRead = async (req, res) => {
  try {
    await Notification.markAllRead(req.user.id_user)
    res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' })
  } catch (error) {
    console.error('Error en markAllRead:', error)
    res.status(500).json({ message: 'Error al marcar notificaciones' })
  }
}

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
}
