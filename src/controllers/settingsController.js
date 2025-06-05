const Settings = require('../models/Settings');

const settingsController = {
    // Get all settings
    getAll: async (req, res, next) => {
        try {
            const settings = await Settings.getAll();
            res.json(settings);
        } catch (error) {
            next(error);
        }
    },

    // Get setting by key
    get: async (req, res, next) => {
        try {
            const value = await Settings.get(req.params.key);
            if (value === null) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Setting not found'
                    }
                });
            }
            res.json({ key: req.params.key, value });
        } catch (error) {
            next(error);
        }
    },

    // Set setting
    set: async (req, res, next) => {
        try {
            const { key, value } = req.body;
            if (!key || value === undefined) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Key and value are required'
                    }
                });
            }
            const result = await Settings.set(key, value);
            res.json({ key, value: result });
        } catch (error) {
            next(error);
        }
    },

    // Delete setting
    delete: async (req, res, next) => {
        try {
            await Settings.delete(req.params.key);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    // Get base currency
    getBaseCurrency: async (req, res, next) => {
        try {
            const currency = await Settings.getBaseCurrency();
            res.json({ baseCurrency: currency });
        } catch (error) {
            next(error);
        }
    },

    // Set base currency
    setBaseCurrency: async (req, res, next) => {
        try {
            const { currencyCode } = req.body;
            if (!currencyCode) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Currency code is required'
                    }
                });
            }
            const result = await Settings.setBaseCurrency(currencyCode);
            res.json({ baseCurrency: result });
        } catch (error) {
            next(error);
        }
    },

    // Get date format
    getDateFormat: async (req, res, next) => {
        try {
            const format = await Settings.getDateFormat();
            res.json({ dateFormat: format });
        } catch (error) {
            next(error);
        }
    },

    // Set date format
    setDateFormat: async (req, res, next) => {
        try {
            const { format } = req.body;
            if (!format) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Format is required'
                    }
                });
            }
            const result = await Settings.setDateFormat(format);
            res.json({ dateFormat: result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = settingsController; 