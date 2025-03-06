import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authorRoutes } from './modules/author/author-routes';
import { bookRoutes } from './modules/book/book-routes';
import { searchRoutes } from './modules/search/search-routes';
import { prismaPlugin } from './plugins/prisma-plugin';

/**
 * Creates and configures the Fastify server instance
 */
const createServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: true,
  });

  // Register plugins
  await server.register(cors, {
    origin: true,
  });

  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Moneturn Book Library API',
        description: 'API for managing books and authors',
        version: '1.0.0',
      },
      tags: [
        { name: 'books', description: 'Book related endpoints' },
        { name: 'authors', description: 'Author related endpoints' },
        { name: 'search', description: 'Search related endpoints' },
      ],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation',
  });

  // Register database plugin
  await server.register(prismaPlugin);

  // Register route modules
  await server.register(authorRoutes, { prefix: '/api/authors' });
  await server.register(bookRoutes, { prefix: '/api/books' });
  await server.register(searchRoutes, { prefix: '/api/search' });

  // Health check route
  server.get('/health', async () => {
    return { status: 'ok' };
  });

  return server;
};

/**
 * Starts the server and handles errors
 */
const startServer = async (): Promise<void> => {
  try {
    const server = await createServer();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    
    await server.listen({ port, host: '127.0.0.1' });
    
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { createServer };
