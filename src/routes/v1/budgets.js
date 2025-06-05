import express from 'express';
import budgetController from '../../controllers/budgetController.js';
import { validateRequest } from '../../middleware/validation.js';
import schemas from '../../validations/schemas.js';

const router = express.Router();

// Get all budgets
router.get('/', validateRequest(schemas.budget.query), budgetController.getAll);

// Get budget by ID
router.get('/:id', budgetController.getById);

// Create new budget
router.post('/', validateRequest(schemas.budget.create), budgetController.create);

// Update budget
router.put('/:id', validateRequest(schemas.budget.update), budgetController.update);

// Delete budget
router.delete('/:id', budgetController.delete);

// Get budget status
router.get('/status', validateRequest(schemas.budget.query), budgetController.getStatus);

export default router; 