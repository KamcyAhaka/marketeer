const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all reviews
router.get(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve all product customer reviews'
  // #swagger.responses[200] = { description: 'Successfully retrieved all reviews' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getAll
);

// GET single review by ID
router.get(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve a single customer review by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Review MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the review' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getSingle
);

// POST create a new review (Protected)
router.post(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Submit a new customer review with validated 5-field payload (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[201] = { description: 'Review created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.createReview
);

// PUT update a review by ID (Protected)
router.put(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Update an existing review by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Review MongoDB ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[204] = { description: 'Review updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.updateReview
);

// DELETE a review by ID (Protected)
router.delete(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Delete a review by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Review MongoDB ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Review deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.deleteReview
);

module.exports = router;
