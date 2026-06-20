const express = require('express')
const router = express.Router()
const {
  getMyNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} = require('../controllers/notificationController')
const { VerifyToken } = require('../middleware/auth')

router.get('/', VerifyToken, getMyNotifications)
router.get('/unread-count', VerifyToken, getUnreadCount)
router.patch('/read-all', VerifyToken, markAllRead)
router.patch('/:id/read', VerifyToken, markRead)

module.exports = router
