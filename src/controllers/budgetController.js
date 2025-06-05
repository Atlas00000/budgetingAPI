const Budget = require('../models/Budget');

const budgetController = {
    // Get all budgets with optional filters
    getAll: async (req, res, next) => {
        try {
            const { month, year, categoryId } = req.query;
            const budgets = await Budget.findAll({ month, year, categoryId });
            res.json(budgets);
        } catch (error) {
            next(error);
        }
    },

    // Get budget by ID
    getById: async (req, res, next) => {
        try {
            const budget = await Budget.findById(req.params.id);
            if (!budget) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            res.json(budget);
        } catch (error) {
            next(error);
        }
    },

    // Create new budget
    create: async (req, res, next) => {
        try {
            const { categoryId, month, year, amount } = req.body;
            const budget = await Budget.create({ categoryId, month, year, amount });
            res.status(201).json(budget);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Budget already exists for this category and period'
                    }
                });
            }
            next(error);
        }
    },

    // Update budget
    update: async (req, res, next) => {
        try {
            const { categoryId, month, year, amount } = req.body;
            const budget = await Budget.update(req.params.id, {
                categoryId,
                month,
                year,
                amount
            });
            if (!budget) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            res.json(budget);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Budget already exists for this category and period'
                    }
                });
            }
            next(error);
        }
    },

    // Delete budget
    delete: async (req, res, next) => {
        try {
            const result = await Budget.delete(req.params.id);
            if (result.changes === 0) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    // Get budget status
    getStatus: async (req, res, next) => {
        try {
            const { month, year, categoryId } = req.query;
            if (!month || !year) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Month and year are required'
                    }
                });
            }
            const status = await Budget.getBudgetStatus(
                parseInt(month),
                parseInt(year),
                categoryId ? parseInt(categoryId) : null
            );
            if (!status) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'No budget found for this period'
                    }
                });
            }
            res.json(status);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = budgetController; 