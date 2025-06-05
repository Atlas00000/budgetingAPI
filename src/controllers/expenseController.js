import Expense from '../models/Expense.js';

const expenseController = {
    // Get all expenses
    getAll: async (req, res, next) => {
        try {
            const expenses = await Expense.findAll(req.query);
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
            const { categoryId, amount, date, description, currencyCode } = req.body;
            const expense = await Expense.create({
                categoryId,
                amount,
                date,
                description,
                currencyCode
            });
            res.status(201).json(expense);
        } catch (error) {
            next(error);
        }
    },

    // Update expense
    update: async (req, res, next) => {
        try {
            const { categoryId, amount, date, description, currencyCode } = req.body;
            const expense = await Expense.update(req.params.id, {
                categoryId,
                amount,
                date,
                description,
                currencyCode
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
            const { categoryId } = req.params;
            const expenses = await Expense.findAll({
                ...req.query,
                categoryId: parseInt(categoryId)
            });
            res.json(expenses);
        } catch (error) {
            next(error);
        }
    },

    // Get total expenses
    getTotal: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const totals = await Expense.getTotalByCategory(startDate, endDate);
            res.json(totals);
        } catch (error) {
            next(error);
        }
    }
};

export default expenseController; 