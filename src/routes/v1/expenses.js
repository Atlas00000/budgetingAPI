const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/expenseController');
const validate = require('../../middleware/validator');
const schemas = require('../../validations/schemas');

// Get all expenses with optional filters
router.get('/', validate(schemas.expense.query, { query: true }), expenseController.getAll);

// Get expense by ID
router.get('/:id', expenseController.getById);

// Create new expense
router.post('/', validate(schemas.expense.create), expenseController.create);

// Update expense
router.put('/:id', validate(schemas.expense.update), expenseController.update);

// Delete expense
router.delete('/:id', expenseController.delete);

// Get expenses by category
router.get('/category/:categoryId', validate(schemas.expense.query, { query: true }), expenseController.getByCategory);

// Get total expenses
router.get('/total', validate(schemas.expense.query, { query: true }), expenseController.getTotal);

module.exports = router; 