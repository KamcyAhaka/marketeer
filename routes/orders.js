const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all orders
router.get(
  '/',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Retrieve all sales orders from the database'
  // #swagger.responses[200] = { description: 'Successfully retrieved all orders' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  ordersController.getAll
);

// GET single order by ID
router.get(
  '/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Retrieve a single sales order by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Order MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the order' }
  // #swagger.responses[400] = { description: 'Invalid order ID format' }
  // #swagger.responses[404] = { description: 'Order not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  ordersController.getSingle
);

// POST create a new order (Protected)
router.post(
  '/',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Create a new customer order with validated 6-field payload (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Order payload',
      required: true,
      schema: { $ref: '#/definitions/Order' }
  } */
  // #swagger.responses[201] = { description: 'Order created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  ordersController.createOrder
);

// PUT update an order by ID (Protected)
router.put(
  '/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Update an existing order document by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Order MongoDB ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated order payload',
      required: true,
      schema: { $ref: '#/definitions/Order' }
  } */
  // #swagger.responses[204] = { description: 'Order updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Order not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  ordersController.updateOrder
);

// DELETE an order by ID (Protected)
router.delete(
  '/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Delete an order by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Order MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Order deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid order ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Order not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  ordersController.deleteOrder
);

module.exports = router;
