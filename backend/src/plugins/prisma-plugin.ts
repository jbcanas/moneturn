import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '../client';

/**
 * Type declaration for the Prisma client to be available in Fastify instance
 */
declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

/**
 * Plugin that adds Prisma client to the Fastify instance
 */
const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await prisma.$connect();

  // Make Prisma client available through the fastify instance
  fastify.decorate('prisma', prisma);

  // Close Prisma client when Fastify server is shutting down
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});

export { prismaPlugin };
