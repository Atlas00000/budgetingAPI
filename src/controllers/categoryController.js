import Category from '../models/Category.js';

const categoryController = {
    // Get all categories
    getAll: async (req, res, next) => {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    // Get category by ID
    getById: async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Category not found'
                    }
                });
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    },

    // Create new category
    create: async (req, res, next) => {
        try {
            const { name, isPredefined } = req.body;
            const category = await Category.create({ name, isPredefined });
            res.status(201).json(category);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Category with this name already exists'
                    }
                });
            }
            next(error);
        }
    },

    // Update category
    update: async (req, res, next) => {
        try {
            const { name, isPredefined } = req.body;
            const category = await Category.update(req.params.id, { name, isPredefined });
            if (!category) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Category not found'
                    }
                });
            }
            res.json(category);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Category with this name already exists'
                    }
                });
            }
            next(error);
        }
    },

    // Delete category
    delete: async (req, res, next) => {
        try {
            const result = await Category.delete(req.params.id);
            if (result.changes === 0) {
                return res.status(404).json({
                    error: {
                        status: 404,
                        message: 'Category not found or cannot be deleted'
                    }
                });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    // Get predefined categories
    getPredefined: async (req, res, next) => {
        try {
            const categories = await Category.findPredefined();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    // Get custom categories
    getCustom: async (req, res, next) => {
        try {
            const categories = await Category.findCustom();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }
};

export default categoryController; 