import { FastifyPluginAsync } from 'fastify';
import { BookService } from './book-service';

/**
 * Schema for book data validation
 */
const bookSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    authorId: { type: 'integer' },
    year: { type: 'integer', minimum: 1000, maximum: 9999 },
  },
  required: ['title', 'authorId', 'year'],
};

/**
 * Schema for book response
 */
const bookResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    authorId: { type: 'integer' },
    year: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    author: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
    },
  },
};

/**
 * Routes for book-related endpoints
 */
export const bookRoutes: FastifyPluginAsync = async (fastify) => {
  const bookService = new BookService(fastify.prisma);

  // Get all books
  fastify.get('/', {
    schema: {
      tags: ['books'],
      response: {
        200: {
          type: 'array',
          items: bookResponseSchema,
        },
      },
    },
    handler: async () => {
      return bookService.findAll();
    },
  });

  // Get book by ID
  fastify.get('/:id', {
    schema: {
      tags: ['books'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      response: {
        200: bookResponseSchema,
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const book = await bookService.findById(parseInt(id, 10));
      
      if (!book) {
        return reply.code(404).send({ message: 'Book not found' });
      }
      
      return book;
    },
  });

  // Create book
  fastify.post('/', {
    schema: {
      tags: ['books'],
      body: bookSchema,
      response: {
        201: bookResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const bookData = request.body as { title: string; authorId: number; year: number };
      
      try {
        const book = await bookService.create(bookData);
        return reply.code(201).send(book);
      } catch (error) {
        return reply.code(400).send({ 
          message: 'Failed to create book. Author might not exist.' 
        });
      }
    },
  });

  // Update book
  fastify.put('/:id', {
    schema: {
      tags: ['books'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          authorId: { type: 'integer' },
          year: { type: 'integer', minimum: 1000, maximum: 9999 },
        },
        anyOf: [
          { required: ['title'] },
          { required: ['authorId'] },
          { required: ['year'] },
        ],
      },
      response: {
        200: bookResponseSchema,
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const bookData = request.body as { title?: string; authorId?: number; year?: number };
      
      try {
        const book = await bookService.update(parseInt(id, 10), bookData);
        return book;
      } catch (error) {
        return reply.code(404).send({ message: 'Book not found or author does not exist' });
      }
    },
  });

  // Delete book
  fastify.delete('/:id', {
    schema: {
      tags: ['books'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      
      try {
        await bookService.delete(parseInt(id, 10));
        return { message: 'Book deleted successfully' };
      } catch (error) {
        return reply.code(404).send({ message: 'Book not found' });
      }
    },
  });
};
