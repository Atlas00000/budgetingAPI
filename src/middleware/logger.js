// Simple logging middleware
const logger = (req, res, next) => {
    const start = Date.now();

    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
        );
    });

    next();
};

module.exports = logger; 