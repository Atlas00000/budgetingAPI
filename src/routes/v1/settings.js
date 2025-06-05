import express from 'express';
import settingsController from '../../controllers/settingsController.js';
import { validateRequest } from '../../middleware/validation.js';
import schemas from '../../validations/schemas.js';

const router = express.Router();

// Get all settings
router.get('/', settingsController.getAll);

// Get setting by key
router.get('/:key', settingsController.get);

// Set setting
router.post('/', validateRequest(schemas.settings.set), settingsController.set);

// Update setting
router.put('/:key', validateRequest(schemas.settings.set), settingsController.set);

// Delete setting
router.delete('/:key', settingsController.delete);

// Get base currency
router.get('/currency/base', settingsController.getBaseCurrency);

// Set base currency
router.post('/base-currency', validateRequest(schemas.settings.baseCurrency), settingsController.setBaseCurrency);

// Get date format
router.get('/date/format', settingsController.getDateFormat);

// Set date format
router.post('/date-format', validateRequest(schemas.settings.dateFormat), settingsController.setDateFormat);

export default router; 