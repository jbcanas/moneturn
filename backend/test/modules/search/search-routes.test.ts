import { FastifyInstance } from 'fastify';
import { createTestServer } from '../../helpers/test-server';
import { prismaMock } from '../../helpers/singleton';

describe('Search Routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestServer();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/search', () => {
    it('should return search results', async () => {
      // Arrange
      // Create Date objects for Prisma mock
      const dateNow = new Date();
      const createdAt = dateNow;
      const updatedAt = dateNow;
      
      const mockResults = {
        books: [
          {
            id: 1,
            title: 'Test Book',
            year: 2023,
            authorId: 1,
            createdAt,
            updatedAt,
            author: {
              id: 1,
              name: 'Test Author',
              createdAt,
              updatedAt,
            }
          }
        ],
        authors: [
          {
            id: 1,
            name: 'Test Author',
            createdAt,
            updatedAt,
          }
        ]
      };

      // Mock the Prisma client to return our mock results that match the expected types
      // When using the direct mock of Prisma, we need to follow its data structure exactly
      prismaMock.book.findMany.mockResolvedValue([
        {
          id: 1,
          title: 'Test Book',
          year: 2023,
          authorId: 1,
          createdAt,
          updatedAt
        }
      ]);
      
      // SearchService includes the author relation in its response by using Prisma include
      // But when we mock the Prisma client directly, we don't need to provide this include relation
      prismaMock.author.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'Test Author',
          createdAt,
          updatedAt
        }
      ]);
      
      // For the test, we need to mock this separately to be included in the response
      prismaMock.author.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test Author',
        createdAt,
        updatedAt
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=test',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      // Parse the response and compare with expected results
      // Note: We need to handle the fact that dates are serialized to strings in the response
      const parsedResponse = JSON.parse(response.body);
      expect(parsedResponse).toHaveProperty('books');
      expect(parsedResponse).toHaveProperty('authors');
      expect(parsedResponse.books.length).toBe(1);
      expect(parsedResponse.authors.length).toBe(1);
      expect(parsedResponse.books[0].title).toBe('Test Book');
      expect(parsedResponse.authors[0].name).toBe('Test Author');
      // Verify that Prisma queries were called (don't need to test exact parameters as that's covered in service tests)
      expect(prismaMock.book.findMany).toHaveBeenCalled();
      expect(prismaMock.author.findMany).toHaveBeenCalled();
    });

    it('should return empty results for empty query', async () => {
      // Our SearchService logic returns empty arrays without querying the database for empty queries
      // So we're testing the endpoint behavior here, not the mock calls

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ books: [], authors: [] });
    });

    it('should require query parameter', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/api/search',
      });

      // Assert
      expect(response.statusCode).toBe(400);
      // The error message here depends on how Fastify validates query parameters
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      prismaMock.book.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=test',
      });

      // Assert
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });
  });
});
