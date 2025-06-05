import Budget from '../models/Budget.js';

const budgetController = {
    // Get all budgets with optional filters
    getAll: async (req, res, next) => {
        try {
            const { month, year, categoryId } = req.query;
            console.log('Getting budgets with filters:', { month, year, categoryId });
            const budgets = await Budget.findAll({ month, year, categoryId });
            console.log('Found budgets:', budgets);
            res.json(budgets);
        } catch (error) {
            console.error('Error in getAll budgets:', error);
            next(error);
        }
    },

    // Get budget by ID
    getById: async (req, res, next) => {
        try {
            console.log('Getting budget by ID:', req.params.id);
            const budget = await Budget.findById(req.params.id);
            if (!budget) {
                console.log('Budget not found:', req.params.id);
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            console.log('Found budget:', budget);
            res.json(budget);
        } catch (error) {
            console.error('Error in getById budget:', error);
            next(error);
        }
    },

    // Create new budget
    create: async (req, res, next) => {
        try {
            const { categoryId, month, year, amount } = req.body;
            console.log('Creating budget:', { categoryId, month, year, amount });
            const budget = await Budget.create({ categoryId, month, year, amount });
            console.log('Created budget:', budget);
            res.status(201).json(budget);
        } catch (error) {
            console.error('Error in create budget:', error);
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
            console.log('Updating budget:', { id: req.params.id, categoryId, month, year, amount });
            const budget = await Budget.update(req.params.id, {
                categoryId,
                month,
                year,
                amount
            });
            if (!budget) {
                console.log('Budget not found for update:', req.params.id);
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            console.log('Updated budget:', budget);
            res.json(budget);
        } catch (error) {
            console.error('Error in update budget:', error);
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
            console.log('Deleting budget:', req.params.id);
            const result = await Budget.delete(req.params.id);
            if (result.changes === 0) {
                console.log('Budget not found for deletion:', req.params.id);
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Budget not found'
                    }
                });
            }
            console.log('Deleted budget:', req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error in delete budget:', error);
            next(error);
        }
    },

    // Get budget status
    getStatus: async (req, res, next) => {
        try {
            const { month, year, categoryId } = req.query;
            console.log('Getting budget status:', { month, year, categoryId });
            
            if (!month || !year) {
                console.log('Missing required parameters:', { month, year });
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
                console.log('No budget found for period:', { month, year, categoryId });
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'No budget found for this period'
                    }
                });
            }

            console.log('Found budget status:', status);
            res.json(status);
        } catch (error) {
            console.error('Error in getStatus budget:', error);
            next(error);
        }
    }
};

export default budgetController; 