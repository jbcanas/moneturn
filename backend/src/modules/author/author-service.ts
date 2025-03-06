import { PrismaClient } from '@prisma/client';

/**
 * Service for handling author-related operations
 */
export class AuthorService {
  private prisma: PrismaClient;

  /**
   * Creates a new AuthorService instance
   * @param prisma - The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Retrieves all authors from the database
   * @returns A promise that resolves to an array of authors
   */
  async findAll() {
    return this.prisma.author.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves a single author by ID
   * @param id - The ID of the author to retrieve
   * @returns A promise that resolves to the author or null if not found
   */
  async findById(id: number) {
    return this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
  }

  /**
   * Creates a new author
   * @param data - The author data to create
   * @returns A promise that resolves to the created author
   */
  async create(data: { name: string }) {
    return this.prisma.author.create({
      data,
    });
  }

  /**
   * Updates an existing author
   * @param id - The ID of the author to update
   * @param data - The updated author data
   * @returns A promise that resolves to the updated author
   */
  async update(id: number, data: { name: string }) {
    return this.prisma.author.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes an author by ID
   * @param id - The ID of the author to delete
   * @returns A promise that resolves to the deleted author
   * @throws Error if the author has books or doesn't exist
   */
  async delete(id: number) {
    // First check if the author exists and if they have any books
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    if (author.books.length > 0) {
      // Option 1: Throw an error if the author has books
      throw new Error('Cannot delete author with books. Delete the books first.');
      
      // Option 2: Delete the books first, then the author (uncomment to use this approach)
      // await this.prisma.book.deleteMany({
      //   where: {
      //     authorId: id,
      //   },
      // });
    }

    // Delete the author
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
