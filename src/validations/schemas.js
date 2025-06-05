import Joi from 'joi';

const schemas = {
    // Category schemas
    category: {
        create: Joi.object({
            name: Joi.string().required().min(2).max(50),
            isPredefined: Joi.boolean().default(false)
        }),
        update: Joi.object({
            name: Joi.string().min(2).max(50),
            isPredefined: Joi.boolean()
        })
    },

    // Expense schemas
    expense: {
        create: Joi.object({
            categoryId: Joi.number().integer().required(),
            amount: Joi.number().precision(2).required().min(0),
            date: Joi.date().iso().required(),
            description: Joi.string().max(255),
            currencyCode: Joi.string().length(3).default('USD')
        }),
        update: Joi.object({
            categoryId: Joi.number().integer(),
            amount: Joi.number().precision(2).min(0),
            date: Joi.date().iso(),
            description: Joi.string().max(255),
            currencyCode: Joi.string().length(3)
        }),
        query: Joi.object({
            startDate: Joi.date().iso(),
            endDate: Joi.date().iso().min(Joi.ref('startDate')),
            categoryId: Joi.number().integer()
        })
    },

    // Budget schemas
    budget: {
        create: Joi.object({
            categoryId: Joi.number().integer().allow(null),
            month: Joi.number().integer().min(1).max(12).required(),
            year: Joi.number().integer().min(2000).max(2100).required(),
            amount: Joi.number().precision(2).required().min(0)
        }),
        update: Joi.object({
            categoryId: Joi.number().integer().allow(null),
            month: Joi.number().integer().min(1).max(12),
            year: Joi.number().integer().min(2000).max(2100),
            amount: Joi.number().precision(2).min(0)
        }),
        query: Joi.object({
            month: Joi.number().integer().min(1).max(12),
            year: Joi.number().integer().min(2000).max(2100),
            categoryId: Joi.number().integer().allow(null)
        })
    },

    // Settings schemas
    settings: {
        set: Joi.object({
            key: Joi.string().required(),
            value: Joi.alternatives().try(
                Joi.string(),
                Joi.number(),
                Joi.boolean()
            ).required()
        }),
        baseCurrency: Joi.object({
            currencyCode: Joi.string().length(3).required()
        }),
        dateFormat: Joi.object({
            format: Joi.string().required().max(50)
        })
    }
};

export default schemas; 