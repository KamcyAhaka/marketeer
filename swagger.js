const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketeer E-Commerce REST API',
    description: 'CSE 341 Final Project - Catalog & Order Management API supporting full CRUD operations across 4 collections (Products, Categories, Orders, Reviews) with GitHub OAuth 2.0 and MongoDB Atlas',
    version: '2.0.0',
  },
  host: process.env.HOST || 'localhost:3000',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Home',
      description: 'API root and status endpoints',
    },
    {
      name: 'Authentication',
      description: 'GitHub OAuth 2.0 login, session status, profile, and logout',
    },
    {
      name: 'Products',
      description: 'Operations on the products collection (Protected write operations)',
    },
    {
      name: 'Categories',
      description: 'Operations on the categories collection (Protected write operations)',
    },
    {
      name: 'Orders',
      description: 'Operations on customer sales orders (Protected write operations)',
    },
    {
      name: 'Reviews',
      description: 'Operations on product customer reviews (Protected write operations)',
    },
  ],
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Cookie',
      description: 'Session cookie (connect.sid) established upon authentication via /login',
    },
  },
  definitions: {
    Product: {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry leading noise canceling headphones with two processors and 8 microphones.',
      price: 398.0,
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
    Order: {
      userId: 'gh-user-892147',
      customerEmail: 'alex.shopper@example.com',
      items: [
        {
          productId: '6520a1b2c3d4e5f6a7b8c9d0',
          title: 'Sony WH-1000XM5 Wireless Headphones',
          quantity: 1,
          unitPrice: 398.0,
        },
      ],
      totalAmount: 398.0,
      shippingAddress: {
        street: '123 University Blvd',
        city: 'Rexburg',
        state: 'ID',
        zipCode: '83440',
        country: 'USA',
      },
      orderStatus: 'Pending',
    },
    Review: {
      productId: '6520a1b2c3d4e5f6a7b8c9d0',
      reviewerName: 'Alex Johnson',
      rating: 5,
      comment: 'Superb noise cancellation and supreme all-day comfort. Highly recommended!',
      reviewDate: '2024-10-12',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
