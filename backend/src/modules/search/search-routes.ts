import { FastifyPluginAsync } from 'fastify';
import { SearchService } from './search-service';

/**
 * Routes for search-related endpoints
 */
export const searchRoutes: FastifyPluginAsync = async (fastify) => {
  const searchService = new SearchService(fastify.prisma);

  // Search for books and authors
  fastify.get('/', {
    schema: {
      tags: ['search'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' }
        },
        required: ['q']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            books: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  title: { type: 'string' },
                  year: { type: 'integer' },
                  authorId: { type: 'integer' },
                  author: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                    }
                  }
                }
              }
            },
            authors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                }
              }
            }
          }
        }
      }
    },
    handler: async (request) => {
      const { q } = request.query as { q: string };
      return searchService.search(q);
    }
  });
};
