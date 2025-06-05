import Joi from 'joi';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(
            req.method === 'GET' ? req.query : req.body,
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