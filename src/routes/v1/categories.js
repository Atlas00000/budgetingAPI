import express from 'express';
import categoryController from '../../controllers/categoryController.js';
import { validateRequest } from '../../middleware/validation.js';
import schemas from '../../validations/schemas.js';

const router = express.Router();

// Get all categories
router.get('/', categoryController.getAll);

// Get category by ID
router.get('/:id', categoryController.getById);

// Create new category
router.post('/', validateRequest(schemas.category.create), categoryController.create);

// Update category
router.put('/:id', validateRequest(schemas.category.update), categoryController.update);

// Delete category
router.delete('/:id', categoryController.delete);

// Get predefined categories
router.get('/predefined', categoryController.getPredefined);

// Get custom categories
router.get('/custom', categoryController.getCustom);

export default router; 