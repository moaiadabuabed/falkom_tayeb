const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');
const { authenticateToken } = require('../middleware/auth');

// جلب طلبات المستخدم المسجل فقط
router.get('/my-events', authenticateToken, eventController.getMyEvents);

// تقديم طلب جديد
router.post('/request-event', authenticateToken, eventController.requestEvent);

module.exports = router;