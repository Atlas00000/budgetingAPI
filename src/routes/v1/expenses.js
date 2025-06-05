import express from 'express';
import expenseController from '../../controllers/expenseController.js';
import { validateRequest } from '../../middleware/validation.js';
import schemas from '../../validations/schemas.js';

const router = express.Router();

// Get all expenses
router.get('/', validateRequest(schemas.expense.query), expenseController.getAll);

// Get expense by ID
router.get('/:id', expenseController.getById);

// Create new expense
router.post('/', validateRequest(schemas.expense.create), expenseController.create);

// Update expense
router.put('/:id', validateRequest(schemas.expense.update), expenseController.update);

// Delete expense
router.delete('/:id', expenseController.delete);

// Get expenses by category
router.get('/category/:categoryId', validateRequest(schemas.expense.query), expenseController.getByCategory);

// Get total expenses
router.get('/total', validateRequest(schemas.expense.query), expenseController.getTotal);

export default router; 