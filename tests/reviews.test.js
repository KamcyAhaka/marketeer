const request = require('supertest');
const app = require('../server');
const mongodb = require('../db/connect');

jest.mock('../db/connect');

describe('Reviews GET Endpoints', () => {
  const sampleReview = {
    _id: '6520a1b2c3d4e5f6a7b8c9d3',
    productId: '6520a1b2c3d4e5f6a7b8c9d0',
    reviewerName: 'Alex Johnson',
    rating: 5,
    comment: 'Superb noise cancellation and supreme comfort.',
    reviewDate: '2024-10-12T00:00:00.000Z',
  };

  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([sampleReview]),
      }),
      findOne: jest.fn().mockImplementation(({ _id }) => {
        if (_id && _id.toString() === '6520a1b2c3d4e5f6a7b8c9d3') {
          return Promise.resolve(sampleReview);
        }
        return Promise.resolve(null);
      }),
    };

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
  });

  describe('GET /reviews (GetAll)', () => {
    it('should return 200 OK and an array of all reviews', async () => {
      const res = await request(app).get('/reviews');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].reviewerName).toBe('Alex Johnson');
      expect(res.body[0].rating).toBe(5);
    });

    it('should return 500 when database query fails', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Reviews query failure')),
      });

      const res = await request(app).get('/reviews');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /reviews/:id (GetSingle)', () => {
    it('should return 200 OK and review for a valid existing ID', async () => {
      const res = await request(app).get('/reviews/6520a1b2c3d4e5f6a7b8c9d3');

      expect(res.status).toBe(200);
      expect(res.body.reviewerName).toBe('Alex Johnson');
      expect(res.body.rating).toBe(5);
      expect(res.body.comment).toBe('Superb noise cancellation and supreme comfort.');
    });

    it('should return 400 Bad Request for an invalid ObjectId format', async () => {
      const res = await request(app).get('/reviews/invalid-review-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid review ID format');
    });

    it('should return 404 Not Found when review does not exist', async () => {
      const res = await request(app).get('/reviews/6520a1b2c3d4e5f6a7b8c9d9');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Review not found');
    });
  });
});
