const express = require('express');
const router = express.Router();
const budgetController = require('../../controllers/budgetController');
const validate = require('../../middleware/validator');
const schemas = require('../../validations/schemas');

// Get all budgets with optional filters
router.get('/', validate(schemas.budget.query, { query: true }), budgetController.getAll);

// Get budget by ID
router.get('/:id', budgetController.getById);

// Create new budget
router.post('/', validate(schemas.budget.create), budgetController.create);

// Update budget
router.put('/:id', validate(schemas.budget.update), budgetController.update);

// Delete budget
router.delete('/:id', budgetController.delete);

// Get budget status
router.get('/status', validate(schemas.budget.query, { query: true }), budgetController.getStatus);

module.exports = router; 