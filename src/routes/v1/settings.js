const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const validate = require('../../middleware/validator');
const schemas = require('../../validations/schemas');

// Get all settings
router.get('/', settingsController.getAll);

// Get setting by key
router.get('/:key', settingsController.get);

// Set setting
router.post('/', validate(schemas.settings.set), settingsController.set);

// Delete setting
router.delete('/:key', settingsController.delete);

// Get base currency
router.get('/currency/base', settingsController.getBaseCurrency);

// Set base currency
router.post('/currency/base', validate(schemas.settings.baseCurrency), settingsController.setBaseCurrency);

// Get date format
router.get('/date/format', settingsController.getDateFormat);

// Set date format
router.post('/date/format', validate(schemas.settings.dateFormat), settingsController.setDateFormat);

module.exports = router; 