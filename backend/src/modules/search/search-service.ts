import { PrismaClient } from '@prisma/client';

/**
 * Interface for search results
 */
export interface SearchResults {
  books: Array<{
    id: number;
    title: string;
    year: number;
    authorId: number;
    author: {
      id: number;
      name: string;
    };
  }>;
  authors: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * Service for handling search operations
 */
export class SearchService {
  private prisma: PrismaClient;

  /**
   * Creates a new SearchService instance
   * @param prisma - The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Searches for books and authors based on a query string
   * @param query - The search query
   * @returns Promise with search results containing books and authors
   */
  async search(query: string): Promise<SearchResults> {
    // Normalize the query for search
    const normalizedQuery = query.trim().toLowerCase();
    
    if (!normalizedQuery) {
      return { books: [], authors: [] };
    }

    // Search for books matching the query in title, author name, or year
    const books = await this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { year: isNaN(Number(normalizedQuery)) ? undefined : Number(normalizedQuery) },
          { author: { name: { contains: normalizedQuery, mode: 'insensitive' } } }
        ]
      },
      include: {
        author: true,
      }
    });

    // Search for authors matching the query in name
    const authors = await this.prisma.author.findMany({
      where: {
        name: {
          contains: normalizedQuery,
          mode: 'insensitive'
        }
      }
    });

    return {
      books,
      authors
    };
  }
}
