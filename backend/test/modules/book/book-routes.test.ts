import { FastifyInstance } from 'fastify';
import { createTestServer } from '../../helpers/test-server';
import { prismaMock } from '../../helpers/singleton';

describe('Book Routes', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = await createTestServer();
  });

  afterEach(async () => {
    await server.close();
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      // Arrange
      const mockBooks = [
        {
          id: 1,
          title: 'Book 1',
          authorId: 1,
          year: 2020,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Author 1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          id: 2,
          title: 'Book 2',
          authorId: 2,
          year: 2021,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 2,
            name: 'Author 2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];
      
      prismaMock.book.findMany.mockResolvedValue(mockBooks);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/api/books',
      });

      // Log the response for debugging
      console.log('GET /api/books response:', {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 1, title: 'Book 1' }),
        expect.objectContaining({ id: 2, title: 'Book 2' }),
      ]));
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return a book by id', async () => {
      // Arrange
      const bookId = 1;
      const mockBook = {
        id: bookId,
        title: 'Book 1',
        authorId: 1,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.findUnique.mockResolvedValue(mockBook);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: `/api/books/${bookId}`,
      });

      // Log the response for debugging
      console.log(`GET /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: bookId,
        title: 'Book 1',
        year: 2020,
        author: expect.objectContaining({
          id: 1,
          name: 'Author 1',
        }),
      }));
    });

    it('should return 404 if book not found', async () => {
      // Arrange
      const bookId = 999;
      prismaMock.book.findUnique.mockResolvedValue(null);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: `/api/books/${bookId}`,
      });

      // Log the response for debugging
      console.log(`GET /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Book not found',
      });
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      // Arrange
      const bookData = { title: 'New Book', authorId: 1, year: 2023 };
      const mockCreatedBook = {
        id: 1,
        title: 'New Book',
        authorId: 1,
        year: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.create.mockResolvedValue(mockCreatedBook);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/books',
        payload: bookData,
      });

      // Log the response for debugging
      console.log('POST /api/books response:', {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: 1,
        title: 'New Book',
        year: 2023,
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/books',
        payload: { title: 'Missing Fields Book' },
      });

      // Log the response for debugging
      console.log('POST /api/books response:', {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 if author does not exist', async () => {
      // Arrange
      const bookData = { title: 'New Book', authorId: 999, year: 2023 };
      prismaMock.book.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/books',
        payload: bookData,
      });

      // Log the response for debugging
      console.log('POST /api/books response:', {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        message: expect.stringContaining('Failed to create book'),
      });
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update an existing book', async () => {
      // Arrange
      const bookId = 1;
      const updateData = { title: 'Updated Book', year: 2024 };
      const mockUpdatedBook = {
        id: bookId,
        title: 'Updated Book',
        authorId: 1,
        year: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.update.mockResolvedValue(mockUpdatedBook);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: `/api/books/${bookId}`,
        payload: updateData,
      });

      // Log the response for debugging
      console.log(`PUT /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(expect.objectContaining({
        id: bookId,
        title: 'Updated Book',
        year: 2024,
      }));
    });

    it('should return 404 if book not found', async () => {
      // Arrange
      const bookId = 999;
      const updateData = { title: 'Updated Book' };
      
      prismaMock.book.update.mockRejectedValue(new Error('Book not found'));

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: `/api/books/${bookId}`,
        payload: updateData,
      });

      // Log the response for debugging
      console.log(`PUT /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: expect.stringContaining('Book not found'),
      });
    });

    it('should return 404 if updated author does not exist', async () => {
      // Arrange
      const bookId = 1;
      const updateData = { authorId: 999 };
      
      prismaMock.book.update.mockRejectedValue(new Error('Foreign key constraint failed'));

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: `/api/books/${bookId}`,
        payload: updateData,
      });

      // Log the response for debugging
      console.log(`PUT /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: expect.stringContaining('Book not found or author does not exist'),
      });
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      // Arrange
      const bookId = 1;
      const mockBook = {
        id: bookId,
        title: 'Book to Delete',
        authorId: 1,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.book.delete.mockResolvedValue(mockBook);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/books/${bookId}`,
      });

      // Log the response for debugging
      console.log(`DELETE /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        message: 'Book deleted successfully',
      });
    });

    it('should return 404 if book not found', async () => {
      // Arrange
      const bookId = 999;
      prismaMock.book.delete.mockRejectedValue(new Error('Book not found'));

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/books/${bookId}`,
      });

      // Log the response for debugging
      console.log(`DELETE /api/books/${bookId} response:`, {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({
        message: expect.stringContaining('Book not found'),
      });
    });
  });

  describe('Health check route', () => {
    it('should return 200 OK for health check', async () => {
      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/health',
      });

      // Log the response for debugging
      console.log('GET /health response:', {
        statusCode: response.statusCode,
        body: response.body,
      });

      // Assert
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        status: 'ok',
      });
    });
  });
});
