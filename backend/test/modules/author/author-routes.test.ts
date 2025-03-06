import { FastifyInstance } from 'fastify';
import { createTestServer } from '../../helpers/test-server';
import { prismaMock } from '../../helpers/singleton';

describe('Author Routes', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = await createTestServer();
  });

  afterEach(async () => {
    await server.close();
  });

  describe('GET /api/authors', () => {
    it('should return all authors', async () => {
      // Arrange
      const mockAuthors = [
        { id: 1, name: 'Author 1', createdAt: new Date(), updatedAt: new Date(), _count: { books: 2 } },
        { id: 2, name: 'Author 2', createdAt: new Date(), updatedAt: new Date(), _count: { books: 0 } },
      ];
      
      prismaMock.author.findMany.mockResolvedValue(mockAuthors);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/api/authors',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Author 1' }),
        expect.objectContaining({ id: 2, name: 'Author 2' }),
      ]));
    });
  });

  describe('GET /api/authors/:id', () => {
    it('should return an author by id', async () => {
      // Arrange
      const authorId = 1;
      const mockAuthor = {
        id: authorId,
        name: 'Author 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(mockAuthor);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: `/api/authors/${authorId}`,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: authorId,
        name: 'Author 1',
      }));
    });

    it('should return 404 if author not found', async () => {
      // Arrange
      const authorId = 999;
      prismaMock.author.findUnique.mockResolvedValue(null);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: `/api/authors/${authorId}`,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Author not found',
      });
    });
  });

  describe('POST /api/authors', () => {
    it('should create a new author', async () => {
      // Arrange
      const authorData = { name: 'New Author' };
      const mockCreatedAuthor = {
        id: 1,
        name: 'New Author',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.author.create.mockResolvedValue(mockCreatedAuthor);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/authors',
        payload: authorData,
      });

      // Assert
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: 1,
        name: 'New Author',
      }));
    });

    it('should return 400 if name is missing', async () => {
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/authors',
        payload: {},
      });

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /api/authors/:id', () => {
    it('should update an existing author', async () => {
      // Arrange
      const authorId = 1;
      const updateData = { name: 'Updated Author' };
      const mockUpdatedAuthor = {
        id: authorId,
        name: 'Updated Author',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.author.update.mockResolvedValue(mockUpdatedAuthor);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: `/api/authors/${authorId}`,
        payload: updateData,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: authorId,
        name: 'Updated Author',
      }));
    });

    it('should return 404 if author not found', async () => {
      // Arrange
      const authorId = 999;
      const updateData = { name: 'Updated Author' };
      
      prismaMock.author.update.mockRejectedValue(new Error('Author not found'));

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: `/api/authors/${authorId}`,
        payload: updateData,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Author not found',
      });
    });
  });

  describe('DELETE /api/authors/:id', () => {
    it('should delete an author', async () => {
      // Arrange
      const authorId = 1;
      const mockAuthor = {
        id: authorId,
        name: 'Author to Delete',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(mockAuthor);
      prismaMock.author.delete.mockResolvedValue(mockAuthor);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/authors/${authorId}`,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Author deleted successfully',
      });
    });

    it('should return 400 if author has books', async () => {
      // Arrange
      const authorId = 1;
      
      // Mock the author with books
      const authorWithBooks = {
        id: authorId,
        name: 'Author with Books',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [{ id: 1 }],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(authorWithBooks);
      
      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/authors/${authorId}`,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        message: expect.stringContaining('Cannot delete author with books'),
      });
    });

    it('should return 404 if author not found', async () => {
      // Arrange
      const authorId = 999;
      prismaMock.author.findUnique.mockResolvedValue(null);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/authors/${authorId}`,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Author not found',
      });
    });
  });
});
