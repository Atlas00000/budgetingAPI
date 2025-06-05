import express from 'express';
import budgetRoutes from './budgets.js';
import categoryRoutes from './categories.js';
import expenseRoutes from './expenses.js';
import settingsRoutes from './settings.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// API routes
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/settings', settingsRoutes);

export default router; 