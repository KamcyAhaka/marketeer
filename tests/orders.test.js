const request = require('supertest');
const app = require('../server');
const mongodb = require('../db/connect');

jest.mock('../db/connect');

describe('Orders GET Endpoints', () => {
  const sampleOrder = {
    _id: '6520a1b2c3d4e5f6a7b8c9d2',
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
  };

  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([sampleOrder]),
      }),
      findOne: jest.fn().mockImplementation(({ _id }) => {
        if (_id && _id.toString() === '6520a1b2c3d4e5f6a7b8c9d2') {
          return Promise.resolve(sampleOrder);
        }
        return Promise.resolve(null);
      }),
    };

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
  });

  describe('GET /orders (GetAll)', () => {
    it('should return 200 OK and an array of all customer orders', async () => {
      const res = await request(app).get('/orders');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].userId).toBe('gh-user-892147');
      expect(res.body[0].totalAmount).toBe(398.0);
    });

    it('should return 500 when database query fails', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Orders query failed')),
      });

      const res = await request(app).get('/orders');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /orders/:id (GetSingle)', () => {
    it('should return 200 OK and the order for a valid existing ID', async () => {
      const res = await request(app).get('/orders/6520a1b2c3d4e5f6a7b8c9d2');

      expect(res.status).toBe(200);
      expect(res.body.customerEmail).toBe('alex.shopper@example.com');
      expect(res.body.orderStatus).toBe('Pending');
    });

    it('should return 400 Bad Request for an invalid ObjectId format', async () => {
      const res = await request(app).get('/orders/invalid-order-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid order ID format');
    });

    it('should return 404 Not Found when order does not exist', async () => {
      const res = await request(app).get('/orders/6520a1b2c3d4e5f6a7b8c9d9');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });
  });
});
