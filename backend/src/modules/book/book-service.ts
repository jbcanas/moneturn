import { PrismaClient } from '@prisma/client';

/**
 * Service for handling book-related operations
 */
export class BookService {
  private prisma: PrismaClient;

  /**
   * Creates a new BookService instance
   * @param prisma - The Prisma client instance
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Retrieves all books from the database
   * @returns A promise that resolves to an array of books
   */
  async findAll() {
    return this.prisma.book.findMany({
      include: {
        author: true,
      },
    });
  }

  /**
   * Retrieves a single book by ID
   * @param id - The ID of the book to retrieve
   * @returns A promise that resolves to the book or null if not found
   */
  async findById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  /**
   * Creates a new book
   * @param data - The book data to create
   * @returns A promise that resolves to the created book
   */
  async create(data: { title: string; authorId: number; year: number }) {
    return this.prisma.book.create({
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Updates an existing book
   * @param id - The ID of the book to update
   * @param data - The updated book data
   * @returns A promise that resolves to the updated book
   */
  async update(id: number, data: { title?: string; authorId?: number; year?: number }) {
    return this.prisma.book.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  /**
   * Deletes a book by ID
   * @param id - The ID of the book to delete
   * @returns A promise that resolves to the deleted book
   */
  async delete(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
