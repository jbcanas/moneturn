import { Book } from './books';
import { Author } from './authors';

/**
 * Search results interface
 */
export interface SearchResults {
  books: Book[];
  authors: Author[];
}

/**
 * Searches for books and authors based on a query string
 * @param query - The search query
 * @returns Promise with search results containing books and authors
 */
export const search = async (query: string): Promise<SearchResults> => {
  try {
    // In a real application, this would be a call to a search endpoint
    // For now, we'll fetch all books and authors and filter them client-side
    const booksResponse = await fetch('/api/books');
    const authorsResponse = await fetch('/api/authors');
    
    if (!booksResponse.ok || !authorsResponse.ok) {
      throw new Error('Error fetching search results');
    }
    
    const books: Book[] = await booksResponse.json();
    const authors: Author[] = await authorsResponse.json();
    
    // Filter books and authors based on the query
    const filteredBooks = books.filter((book) => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.name.toLowerCase().includes(query.toLowerCase()) ||
      book.year.toString().includes(query)
    );
    
    const filteredAuthors = authors.filter((author) => 
      author.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      books: filteredBooks,
      authors: filteredAuthors
    };
  } catch (error) {
    console.error('Failed to search:', error);
    return { books: [], authors: [] };
  }
};
