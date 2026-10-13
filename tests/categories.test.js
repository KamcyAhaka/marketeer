const request = require('supertest');
const app = require('../server');
const mongodb = require('../db/connect');

jest.mock('../db/connect');

describe('Categories GET Endpoints', () => {
  const sampleCategory = {
    _id: '6520a1b2c3d4e5f6a7b8c9d1',
    name: 'Electronics',
    description: 'Smartphones, audio gear, and computers',
    slug: 'electronics',
    isActive: true,
  };

  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([sampleCategory]),
      }),
      findOne: jest.fn().mockImplementation(({ _id }) => {
        if (_id && _id.toString() === '6520a1b2c3d4e5f6a7b8c9d1') {
          return Promise.resolve(sampleCategory);
        }
        return Promise.resolve(null);
      }),
    };

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
  });

  describe('GET /categories (GetAll)', () => {
    it('should return 200 OK and an array of all categories', async () => {
      const res = await request(app).get('/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Electronics');
      expect(res.body[0].slug).toBe('electronics');
    });

    it('should return 500 when database query fails', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Database query failure')),
      });

      const res = await request(app).get('/categories');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /categories/:id (GetSingle)', () => {
    it('should return 200 OK and category for a valid existing ID', async () => {
      const res = await request(app).get('/categories/6520a1b2c3d4e5f6a7b8c9d1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Electronics');
      expect(res.body.slug).toBe('electronics');
      expect(res.body.isActive).toBe(true);
    });

    it('should return 400 Bad Request for an invalid ObjectId format', async () => {
      const res = await request(app).get('/categories/invalid-category-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid category ID format');
    });

    it('should return 404 Not Found when category does not exist', async () => {
      const res = await request(app).get('/categories/6520a1b2c3d4e5f6a7b8c9d9');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Category not found');
    });
  });
});
