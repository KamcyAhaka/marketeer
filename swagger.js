const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketeer E-Commerce REST API',
    description: 'CSE 341 Final Project - Catalog management API supporting full CRUD operations for Products and Categories with MongoDB',
    version: '1.0.0',
  },
  host: process.env.HOST || 'localhost:3000',
  schemes: ['https', 'http'],
  tags: [
    {
      name: 'Home',
      description: 'API root and status',
    },
    {
      name: 'Products',
      description: 'CRUD operations on the products collection',
    },
    {
      name: 'Categories',
      description: 'CRUD operations on the categories collection',
    },
  ],
  definitions: {
    Product: {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry leading noise canceling headphones with two processors and 8 microphones.',
      price: 398.00,
      category: 'Electronics',
      stockQuantity: 25,
      brand: 'Sony',
      sku: 'SONY-WH1000XM5-BLK',
      rating: 4.8,
      imageUrl: 'https://m.media-amazon.com/images/I/61+elLndqVL._AC_SL1500_.jpg',
    },
    Category: {
      name: 'Electronics',
      description: 'Smartphones, audio gear, computing accessories, and personal electronics.',
      slug: 'electronics',
      isActive: true,
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
