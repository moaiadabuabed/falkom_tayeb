const express = require('express');
const router = express.Router();
const publicController = require('../controller/publicController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Contact Us
router.post('/contact', publicController.submitContact);

// Gallery
router.get('/gallery', publicController.getGallery);
router.post('/gallery', authenticateToken, requireAdmin, publicController.addGalleryImage);
router.delete('/gallery/:id', authenticateToken, requireAdmin, publicController.deleteGalleryImage);

// Services
router.get('/services', publicController.getServices);
router.post('/services', authenticateToken, requireAdmin, publicController.addService);
router.delete('/services/:id', authenticateToken, requireAdmin, publicController.deleteService);

// Package Requirements
router.get('/packages/requirements', publicController.getPackageRequirements);
router.post('/packages/requirements', authenticateToken, requireAdmin, publicController.addPackageRequirement);

module.exports = router;