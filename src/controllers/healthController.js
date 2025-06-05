// Simple health check controller
const healthController = {
    // Basic health check
    check: (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    },

    // Detailed health check
    detailed: async (req, res) => {
        try {
            // Check database connection
            const db = require('../config/database');
            await db.initialize();

            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                services: {
                    database: 'connected'
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                services: {
                    database: 'disconnected'
                },
                error: error.message
            });
        }
    }
};

module.exports = healthController; 