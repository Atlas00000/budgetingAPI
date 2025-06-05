import Settings from '../models/Settings.js';

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
            await Settings.set(key, value);
            res.json({ key, value });
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
            const value = await Settings.get('base_currency');
            res.json({ key: 'base_currency', value });
        } catch (error) {
            next(error);
        }
    },

    // Set base currency
    setBaseCurrency: async (req, res, next) => {
        try {
            const { currencyCode } = req.body;
            await Settings.set('base_currency', currencyCode);
            res.json({ key: 'base_currency', value: currencyCode });
        } catch (error) {
            next(error);
        }
    },

    // Get date format
    getDateFormat: async (req, res, next) => {
        try {
            const value = await Settings.get('date_format');
            res.json({ key: 'date_format', value });
        } catch (error) {
            next(error);
        }
    },

    // Set date format
    setDateFormat: async (req, res, next) => {
        try {
            const { format } = req.body;
            await Settings.set('date_format', format);
            res.json({ key: 'date_format', value: format });
        } catch (error) {
            next(error);
        }
    }
};

export default settingsController; 