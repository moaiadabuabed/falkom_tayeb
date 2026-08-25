const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// حماية جميع مسارات الأدمن دفعة واحدة
router.use(authenticateToken, requireAdmin);

// Events
router.get('/events', adminController.getEvents);
router.patch('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Users
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

// Contact Messages
router.get('/contact-messages', adminController.getContactMessages);
router.delete('/contact-messages/:id', adminController.deleteContactMessage);

module.exports = router;