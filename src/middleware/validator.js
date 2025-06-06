import Joi from 'joi';

// Simple request validation middleware
const validate = (schema, options = {}) => {
    return (req, res, next) => {
        const { error } = schema.validate(
            options.query ? req.query : req.body,
            { abortEarly: false }
        );

        if (error) {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'Validation failed',
                    details: error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }))
                }
            });
        }

        next();
    };
};

export default validate; 