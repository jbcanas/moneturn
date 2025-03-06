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
    // Use the dedicated search endpoint
    const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    
    if (!searchResponse.ok) {
      throw new Error('Error fetching search results');
    }
    
    const results: SearchResults = await searchResponse.json();
    return results;
  } catch (error) {
    console.error('Failed to search:', error);
    return { books: [], authors: [] };
  }
};
