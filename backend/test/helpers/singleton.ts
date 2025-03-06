import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create a mock PrismaClient with proper typing
const mockPrisma = mockDeep<PrismaClient>();

// Mock the module
jest.mock('../../src/client', () => ({
  __esModule: true,
  prisma: mockPrisma,
}));

// Import the mocked client
import { prisma } from '../../src/client';

// Reset the mock before each test
beforeEach(() => {
  mockReset(mockPrisma);
});

// Export the mocked client with proper typing
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
