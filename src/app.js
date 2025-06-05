const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const v1Routes = require('./routes/v1');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/v1', v1Routes);

// Root route redirect to index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            status: 404,
            message: 'Not Found'
        }
    });
});

module.exports = app; 