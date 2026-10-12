const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

// GET all products
router.get(
  '/',
  // #swagger.tags = ['Products']
  // #swagger.description = 'Retrieve all products from the catalog'
  // #swagger.responses[200] = { description: 'Successfully retrieved all products' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  productsController.getAll
);

// GET single product by ID
router.get(
  '/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'Retrieve a single product by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Product MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the product' }
  // #swagger.responses[400] = { description: 'Invalid product ID format' }
  // #swagger.responses[404] = { description: 'Product not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  productsController.getSingle
);

// POST create a new product
router.post(
  '/',
  // #swagger.tags = ['Products']
  // #swagger.description = 'Create a new product in the catalog'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Product object to add',
      required: true,
      schema: { $ref: '#/definitions/Product' }
  } */
  // #swagger.responses[201] = { description: 'Product created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  productsController.createProduct
);

// PUT update a product by ID
router.put(
  '/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'Update an existing product by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Product MongoDB ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated product object',
      required: true,
      schema: { $ref: '#/definitions/Product' }
  } */
  // #swagger.responses[204] = { description: 'Product updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[404] = { description: 'Product not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  productsController.updateProduct
);

// DELETE a product by ID
router.delete(
  '/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'Delete a product by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Product MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Product deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid product ID format' }
  // #swagger.responses[404] = { description: 'Product not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  productsController.deleteProduct
);

module.exports = router;
