// Simple error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    // Default error
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send error response
    res.status(status).json({
        error: {
            status,
            message,
            // Only include stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler; 