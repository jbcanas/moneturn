import { BookService } from '../../../src/modules/book/book-service';
import { prismaMock } from '../../helpers/singleton';

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService(prismaMock);
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      // Arrange
      const expectedBooks = [
        {
          id: 1,
          title: 'Book 1',
          authorId: 1,
          year: 2020,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 1,
            name: 'Author 1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          id: 2,
          title: 'Book 2',
          authorId: 2,
          year: 2021,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 2,
            name: 'Author 2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];
      
      prismaMock.book.findMany.mockResolvedValue(expectedBooks);

      // Act
      const actualBooks = await bookService.findAll();

      // Assert
      expect(actualBooks).toEqual(expectedBooks);
      expect(prismaMock.book.findMany).toHaveBeenCalledWith({
        include: {
          author: true,
        },
      });
    });
  });

  describe('findById', () => {
    it('should return a book by id', async () => {
      // Arrange
      const bookId = 1;
      const expectedBook = {
        id: bookId,
        title: 'Book 1',
        authorId: 1,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.findUnique.mockResolvedValue(expectedBook);

      // Act
      const actualBook = await bookService.findById(bookId);

      // Assert
      expect(actualBook).toEqual(expectedBook);
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: bookId },
        include: {
          author: true,
        },
      });
    });

    it('should return null if book not found', async () => {
      // Arrange
      const bookId = 999;
      prismaMock.book.findUnique.mockResolvedValue(null);

      // Act
      const actualBook = await bookService.findById(bookId);

      // Assert
      expect(actualBook).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      // Arrange
      const bookData = { title: 'New Book', authorId: 1, year: 2023 };
      const expectedBook = {
        id: 1,
        title: 'New Book',
        authorId: 1,
        year: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.create.mockResolvedValue(expectedBook);

      // Act
      const actualBook = await bookService.create(bookData);

      // Assert
      expect(actualBook).toEqual(expectedBook);
      expect(prismaMock.book.create).toHaveBeenCalledWith({
        data: bookData,
        include: {
          author: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      // Arrange
      const bookId = 1;
      const bookData = { title: 'Updated Book', year: 2024 };
      const expectedBook = {
        id: bookId,
        title: 'Updated Book',
        authorId: 1,
        year: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          name: 'Author 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      prismaMock.book.update.mockResolvedValue(expectedBook);

      // Act
      const actualBook = await bookService.update(bookId, bookData);

      // Assert
      expect(actualBook).toEqual(expectedBook);
      expect(prismaMock.book.update).toHaveBeenCalledWith({
        where: { id: bookId },
        data: bookData,
        include: {
          author: true,
        },
      });
    });

    it('should throw an error if book not found', async () => {
      // Arrange
      const bookId = 999;
      const bookData = { title: 'Updated Book' };
      
      prismaMock.book.update.mockRejectedValue(new Error('Book not found'));

      // Act & Assert
      await expect(bookService.update(bookId, bookData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      // Arrange
      const bookId = 1;
      const expectedBook = {
        id: bookId,
        title: 'Book to Delete',
        authorId: 1,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.book.delete.mockResolvedValue(expectedBook);

      // Act
      const actualBook = await bookService.delete(bookId);

      // Assert
      expect(actualBook).toEqual(expectedBook);
      expect(prismaMock.book.delete).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });

    it('should throw an error if book not found', async () => {
      // Arrange
      const bookId = 999;
      prismaMock.book.delete.mockRejectedValue(new Error('Book not found'));

      // Act & Assert
      await expect(bookService.delete(bookId)).rejects.toThrow();
    });
  });
});
