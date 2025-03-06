import { FastifyPluginAsync } from 'fastify';
import { AuthorService } from './author-service';

/**
 * Schema for author data validation
 */
const authorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
  },
  required: ['name'],
};

/**
 * Schema for author response
 */
const authorResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

/**
 * Routes for author-related endpoints
 */
export const authorRoutes: FastifyPluginAsync = async (fastify) => {
  const authorService = new AuthorService(fastify.prisma);

  // Get all authors
  fastify.get('/', {
    schema: {
      tags: ['authors'],
      response: {
        200: {
          type: 'array',
          items: authorResponseSchema,
        },
      },
    },
    handler: async () => {
      return authorService.findAll();
    },
  });

  // Get author by ID
  fastify.get('/:id', {
    schema: {
      tags: ['authors'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      response: {
        200: authorResponseSchema,
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
      const author = await authorService.findById(parseInt(id, 10));
      
      if (!author) {
        return reply.code(404).send({ message: 'Author not found' });
      }
      
      return author;
    },
  });

  // Create author
  fastify.post('/', {
    schema: {
      tags: ['authors'],
      body: authorSchema,
      response: {
        201: authorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const authorData = request.body as { name: string };
      const author = await authorService.create(authorData);
      return reply.code(201).send(author);
    },
  });

  // Update author
  fastify.put('/:id', {
    schema: {
      tags: ['authors'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      body: authorSchema,
      response: {
        200: authorResponseSchema,
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
      const authorData = request.body as { name: string };
      
      try {
        return await authorService.update(parseInt(id, 10), authorData);
      } catch (error) {
        return reply.code(404).send({ message: 'Author not found' });
      }
    },
  });

  // Delete author
  fastify.delete('/:id', {
    schema: {
      tags: ['authors'],
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
        400: {
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
        await authorService.delete(parseInt(id, 10));
        return { message: 'Author deleted successfully' };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Author not found';
        
        if (errorMessage.includes('Cannot delete author with books')) {
          return reply.code(400).send({ message: errorMessage });
        }
        
        return reply.code(404).send({ message: errorMessage });
      }
    },
  });
};
