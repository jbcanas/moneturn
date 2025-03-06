import { AuthorService } from '../../../src/modules/author/author-service';
import { prismaMock } from '../../helpers/singleton';

describe('AuthorService', () => {
  let authorService: AuthorService;

  beforeEach(() => {
    authorService = new AuthorService(prismaMock);
  });

  describe('findAll', () => {
    it('should return all authors', async () => {
      // Arrange
      const expectedAuthors = [
        { id: 1, name: 'Author 1', createdAt: new Date(), updatedAt: new Date(), _count: { books: 2 } },
        { id: 2, name: 'Author 2', createdAt: new Date(), updatedAt: new Date(), _count: { books: 0 } },
      ];
      
      prismaMock.author.findMany.mockResolvedValue(expectedAuthors);

      // Act
      const actualAuthors = await authorService.findAll();

      // Assert
      expect(actualAuthors).toEqual(expectedAuthors);
      expect(prismaMock.author.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              books: true,
            },
          },
        },
      });
    });
  });

  describe('findById', () => {
    it('should return an author by id', async () => {
      // Arrange
      const authorId = 1;
      const expectedAuthor = {
        id: authorId,
        name: 'Author 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(expectedAuthor);

      // Act
      const actualAuthor = await authorService.findById(authorId);

      // Assert
      expect(actualAuthor).toEqual(expectedAuthor);
      expect(prismaMock.author.findUnique).toHaveBeenCalledWith({
        where: { id: authorId },
        include: {
          books: true,
        },
      });
    });

    it('should return null if author not found', async () => {
      // Arrange
      const authorId = 999;
      prismaMock.author.findUnique.mockResolvedValue(null);

      // Act
      const actualAuthor = await authorService.findById(authorId);

      // Assert
      expect(actualAuthor).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new author', async () => {
      // Arrange
      const authorData = { name: 'New Author' };
      const expectedAuthor = {
        id: 1,
        name: 'New Author',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.author.create.mockResolvedValue(expectedAuthor);

      // Act
      const actualAuthor = await authorService.create(authorData);

      // Assert
      expect(actualAuthor).toEqual(expectedAuthor);
      expect(prismaMock.author.create).toHaveBeenCalledWith({
        data: authorData,
      });
    });
  });

  describe('update', () => {
    it('should update an existing author', async () => {
      // Arrange
      const authorId = 1;
      const authorData = { name: 'Updated Author' };
      const expectedAuthor = {
        id: authorId,
        name: 'Updated Author',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaMock.author.update.mockResolvedValue(expectedAuthor);

      // Act
      const actualAuthor = await authorService.update(authorId, authorData);

      // Assert
      expect(actualAuthor).toEqual(expectedAuthor);
      expect(prismaMock.author.update).toHaveBeenCalledWith({
        where: { id: authorId },
        data: authorData,
      });
    });

    it('should throw an error if author not found', async () => {
      // Arrange
      const authorId = 999;
      const authorData = { name: 'Updated Author' };
      
      prismaMock.author.update.mockRejectedValue(new Error('Author not found'));

      // Act & Assert
      await expect(authorService.update(authorId, authorData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete an author without books', async () => {
      // Arrange
      const authorId = 1;
      const authorWithNoBooks = {
        id: authorId,
        name: 'Author to Delete',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(authorWithNoBooks);
      prismaMock.author.delete.mockResolvedValue(authorWithNoBooks);

      // Act
      await authorService.delete(authorId);

      // Assert
      expect(prismaMock.author.findUnique).toHaveBeenCalledWith({
        where: { id: authorId },
        include: {
          books: {
            select: {
              id: true,
            },
          },
        },
      });
      expect(prismaMock.author.delete).toHaveBeenCalledWith({
        where: { id: authorId },
      });
    });

    it('should throw an error if author has books', async () => {
      // Arrange
      const authorId = 1;
      const authorWithBooks = {
        id: authorId,
        name: 'Author with Books',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [{ id: 1 }],
      };
      
      prismaMock.author.findUnique.mockResolvedValue(authorWithBooks);

      // Act & Assert
      await expect(authorService.delete(authorId)).rejects.toThrow('Cannot delete author with books');
    });

    it('should throw an error if author not found', async () => {
      // Arrange
      const authorId = 999;
      prismaMock.author.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(authorService.delete(authorId)).rejects.toThrow('Author not found');
    });
  });
});
