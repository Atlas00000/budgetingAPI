const Expense = require('../models/Expense');
const Currency = require('../models/Currency');

const expenseController = {
    // Get all expenses with optional filters
    getAll: async (req, res, next) => {
        try {
            const { startDate, endDate, categoryId } = req.query;
            const expenses = await Expense.findAll({ startDate, endDate, categoryId });
            res.json(expenses);
        } catch (error) {
            next(error);
        }
    },

    // Get expense by ID
    getById: async (req, res, next) => {
        try {
            const expense = await Expense.findById(req.params.id);
            if (!expense) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Expense not found'
                    }
                });
            }
            res.json(expense);
        } catch (error) {
            next(error);
        }
    },

    // Create new expense
    create: async (req, res, next) => {
        try {
            const { date, amount, currencyCode, categoryId, description } = req.body;
            const expense = await Expense.create({
                date,
                amount,
                currencyCode,
                categoryId,
                description
            });
            res.status(201).json(expense);
        } catch (error) {
            next(error);
        }
    },

    // Update expense
    update: async (req, res, next) => {
        try {
            const { date, amount, currencyCode, categoryId, description } = req.body;
            const expense = await Expense.update(req.params.id, {
                date,
                amount,
                currencyCode,
                categoryId,
                description
            });
            if (!expense) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Expense not found'
                    }
                });
            }
            res.json(expense);
        } catch (error) {
            next(error);
        }
    },

    // Delete expense
    delete: async (req, res, next) => {
        try {
            const result = await Expense.delete(req.params.id);
            if (result.changes === 0) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Expense not found'
                    }
                });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    // Get expenses by category
    getByCategory: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Start date and end date are required'
                    }
                });
            }
            const expenses = await Expense.getTotalByCategory(startDate, endDate);
            res.json(expenses);
        } catch (error) {
            next(error);
        }
    },

    // Get total expenses for date range
    getTotal: async (req, res, next) => {
        try {
            const { startDate, endDate, currencyCode } = req.query;
            if (!startDate || !endDate || !currencyCode) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Start date, end date, and currency code are required'
                    }
                });
            }
            const total = await Expense.getTotalByDateRange(startDate, endDate, currencyCode);
            res.json({ total });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = expenseController; 