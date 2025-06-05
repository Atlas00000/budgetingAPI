const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const validate = require('../../middleware/validator');
const schemas = require('../../validations/schemas');

// Get all categories
router.get('/', categoryController.getAll);

// Get category by ID
router.get('/:id', categoryController.getById);

// Create new category
router.post('/', validate(schemas.category.create), categoryController.create);

// Update category
router.put('/:id', validate(schemas.category.update), categoryController.update);

// Delete category
router.delete('/:id', categoryController.delete);

// Get predefined categories
router.get('/predefined', categoryController.getPredefined);

// Get custom categories
router.get('/custom', categoryController.getCustom);

module.exports = router; 