const request = require('supertest');
const app = require('../server');
const mongodb = require('../db/connect');

jest.mock('../db/connect');

describe('Products GET Endpoints', () => {
  const sampleProduct = {
    _id: '6520a1b2c3d4e5f6a7b8c9d0',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry leading noise canceling headphones',
    price: 398.0,
    category: 'Electronics',
    stockQuantity: 25,
    brand: 'Sony',
    sku: 'SONY-WH1000XM5-BLK',
    rating: 4.8,
    imageUrl: 'https://m.media-amazon.com/images/I/61+elLndqVL._AC_SL1500_.jpg',
  };

  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([sampleProduct]),
      }),
      findOne: jest.fn().mockImplementation(({ _id }) => {
        if (_id && _id.toString() === '6520a1b2c3d4e5f6a7b8c9d0') {
          return Promise.resolve(sampleProduct);
        }
        return Promise.resolve(null);
      }),
    };

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
  });

  describe('GET /products (GetAll)', () => {
    it('should return 200 OK and an array of all products', async () => {
      const res = await request(app).get('/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Sony WH-1000XM5 Wireless Headphones');
    });

    it('should return 500 when database query fails', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      });

      const res = await request(app).get('/products');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /products/:id (GetSingle)', () => {
    it('should return 200 OK and the product for a valid existing ID', async () => {
      const res = await request(app).get('/products/6520a1b2c3d4e5f6a7b8c9d0');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Sony WH-1000XM5 Wireless Headphones');
      expect(res.body.sku).toBe('SONY-WH1000XM5-BLK');
    });

    it('should return 400 Bad Request for an invalid ObjectId format', async () => {
      const res = await request(app).get('/products/invalid-id-123');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid product ID format');
    });

    it('should return 404 Not Found when product does not exist', async () => {
      const res = await request(app).get('/products/6520a1b2c3d4e5f6a7b8c9d9');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });
});
