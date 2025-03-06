import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { SearchService } from '../../../src/modules/search/search-service';

// Create a mock Prisma client
const mockPrisma = mockDeep<PrismaClient>();

// Create a new instance of SearchService with the mock Prisma client
const searchService = new SearchService(mockPrisma as unknown as PrismaClient);

// Reset the mock Prisma client before each test
beforeEach(() => {
  mockReset(mockPrisma);
});

describe('SearchService', () => {
  describe('search', () => {
    it('should return empty arrays when query is empty', async () => {
      // Act
      const result = await searchService.search('');

      // Assert
      expect(result).toEqual({ books: [], authors: [] });
      // Verify no database calls were made
      expect(mockPrisma.book.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.author.findMany).not.toHaveBeenCalled();
    });

    it('should search for books and authors based on query', async () => {
      // Arrange
      const mockQuery = 'test';
      const mockBooks = [
        {
          id: 1,
          title: 'Test Book',
          year: 2023,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Test Author',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
      ];
      const mockAuthors = [
        {
          id: 1,
          name: 'Test Author',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockPrisma.book.findMany.mockResolvedValue(mockBooks);
      mockPrisma.author.findMany.mockResolvedValue(mockAuthors);

      // Act
      const result = await searchService.search(mockQuery);

      // Assert
      expect(result).toEqual({ books: mockBooks, authors: mockAuthors });
      
      // Verify database calls
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: mockQuery, mode: 'insensitive' } },
            { year: undefined }, // NaN check
            { author: { name: { contains: mockQuery, mode: 'insensitive' } } }
          ]
        },
        include: {
          author: true,
        }
      });
      
      expect(mockPrisma.author.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: mockQuery,
            mode: 'insensitive'
          }
        }
      });
    });

    it('should include year in search criteria when query is numeric', async () => {
      // Arrange
      const mockQuery = '2023';
      const mockBooks = [
        {
          id: 1,
          title: 'Book from 2023',
          year: 2023,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Some Author',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
      ];
      
      mockPrisma.book.findMany.mockResolvedValue(mockBooks);
      mockPrisma.author.findMany.mockResolvedValue([]);

      // Act
      const result = await searchService.search(mockQuery);

      // Assert
      expect(result).toEqual({ books: mockBooks, authors: [] });
      
      // Verify book search included the year
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: mockQuery, mode: 'insensitive' } },
            { year: 2023 }, // Should be converted to number
            { author: { name: { contains: mockQuery, mode: 'insensitive' } } }
          ]
        },
        include: {
          author: true,
        }
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.book.findMany.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert
      await expect(searchService.search('test')).rejects.toThrow('Database error');
    });
  });
});
