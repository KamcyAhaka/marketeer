const express = require('express');
const router = express.Router();

// Root route
router.get(
  '/',
  // #swagger.tags = ['Home']
  // #swagger.description = 'Welcome endpoint with API information and documentation link'
  (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Marketeer E-Commerce REST API',
      documentation: '/api-docs',
      endpoints: {
        products: '/products',
        categories: '/categories',
      },
    });
  }
);

// Mount resource routes
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));

module.exports = router;
