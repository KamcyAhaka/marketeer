const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');

// GET all categories
router.get(
  '/',
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Retrieve all product categories'
  // #swagger.responses[200] = { description: 'Successfully retrieved all categories' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  categoriesController.getAll
);

// GET single category by ID
router.get(
  '/:id',
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Retrieve a single category by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Category MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the category' }
  // #swagger.responses[400] = { description: 'Invalid category ID format' }
  // #swagger.responses[404] = { description: 'Category not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  categoriesController.getSingle
);

// POST create a new category
router.post(
  '/',
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Create a new category in the catalog'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Category object to create',
      required: true,
      schema: { $ref: '#/definitions/Category' }
  } */
  // #swagger.responses[201] = { description: 'Category created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  categoriesController.createCategory
);

// PUT update a category by ID
router.put(
  '/:id',
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Update an existing category by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Category MongoDB ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated category object',
      required: true,
      schema: { $ref: '#/definitions/Category' }
  } */
  // #swagger.responses[204] = { description: 'Category updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[404] = { description: 'Category not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  categoriesController.updateCategory
);

// DELETE a category by ID
router.delete(
  '/:id',
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Delete a category by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Category MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Category deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid category ID format' }
  // #swagger.responses[404] = { description: 'Category not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  categoriesController.deleteCategory
);

module.exports = router;
