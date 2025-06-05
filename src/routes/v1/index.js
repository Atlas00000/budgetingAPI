const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/healthController');

// Health check routes
router.get('/health', healthController.check);
router.get('/health/detailed', healthController.detailed);

// Import and use other routes
router.use('/categories', require('./categories'));
router.use('/expenses', require('./expenses'));
router.use('/budgets', require('./budgets'));
router.use('/settings', require('./settings'));

// API information
router.get('/', (req, res) => {
    res.json({
        name: 'Budgeting API',
        version: '1.0.0',
        description: 'A simple, clean, and modular budgeting API',
        endpoints: {
            health: '/v1/health',
            categories: '/v1/categories',
            expenses: '/v1/expenses',
            budgets: '/v1/budgets',
            settings: '/v1/settings'
        }
    });
});

module.exports = router; 