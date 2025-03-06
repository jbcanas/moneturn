/**
 * API functions for book-related operations
 */

/**
 * Book interface matching the backend model
 */
export interface Book {
  id: number;
  title: string;
  year: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
  };
}

/**
 * Interface for creating a new book
 */
export interface CreateBookInput {
  title: string;
  year: number;
  authorId: number;
}

/**
 * Interface for updating a book
 */
export interface UpdateBookInput {
  title?: string;
  year?: number;
  authorId?: number;
}

/**
 * Fetches all books from the API
 * @returns Promise with array of books
 */
export const fetchAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch('/api/books');
    
    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
};

/**
 * Fetches a book by its ID
 * @param id - The ID of the book to fetch
 * @returns Promise with the book data
 */
export const fetchBookById = async (id: number): Promise<Book | null> => {
  try {
    const response = await fetch(`/api/books/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch book with ID ${id}:`, error);
    return null;
  }
};

/**
 * Creates a new book
 * @param bookData - The book data to create
 * @returns Promise with the created book
 */
export const createBook = async (bookData: CreateBookInput): Promise<Book | null> => {
  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create book:', error);
    return null;
  }
};

/**
 * Updates a book by its ID
 * @param id - The ID of the book to update
 * @param bookData - The book data to update
 * @returns Promise with the updated book
 */
export const updateBook = async (id: number, bookData: UpdateBookInput): Promise<Book | null> => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating book: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update book with ID ${id}:`, error);
    return null;
  }
};

/**
 * Deletes a book by its ID
 * @param id - The ID of the book to delete
 * @returns Promise with a boolean indicating success
 */
export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting book: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete book with ID ${id}:`, error);
    return false;
  }
};
