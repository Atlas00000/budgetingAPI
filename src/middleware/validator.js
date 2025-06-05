const Joi = require('joi');

// Simple request validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body against schema
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                // Format validation errors
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Validation failed',
                        details: errors
                    }
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = validate; 