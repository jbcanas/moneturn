/**
 * API functions for author-related operations
 */

/**
 * Author interface matching the backend model
 */
export interface Author {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new author
 */
export interface CreateAuthorInput {
  name: string;
}

/**
 * Interface for updating an author
 */
export interface UpdateAuthorInput {
  name: string;
}

/**
 * Fetches all authors from the API
 * @returns Promise with array of authors
 */
export const fetchAllAuthors = async (): Promise<Author[]> => {
  try {
    const response = await fetch('/api/authors');
    
    if (!response.ok) {
      throw new Error(`Error fetching authors: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch authors:', error);
    return [];
  }
};

/**
 * Fetches an author by ID
 * @param id - The ID of the author to fetch
 * @returns Promise with the author data
 */
export const fetchAuthorById = async (id: number): Promise<Author | null> => {
  try {
    const response = await fetch(`/api/authors/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching author: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch author with ID ${id}:`, error);
    return null;
  }
};

/**
 * Creates a new author
 * @param authorData - The author data to create
 * @returns Promise with the created author
 */
export const createAuthor = async (authorData: CreateAuthorInput): Promise<Author | null> => {
  try {
    const response = await fetch('/api/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating author: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create author:', error);
    return null;
  }
};

/**
 * Updates an author by ID
 * @param id - The ID of the author to update
 * @param authorData - The author data to update
 * @returns Promise with the updated author
 */
export const updateAuthor = async (id: number, authorData: UpdateAuthorInput): Promise<Author | null> => {
  try {
    const response = await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating author: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update author with ID ${id}:`, error);
    return null;
  }
};

/**
 * Deletes an author by ID
 * @param id - The ID of the author to delete
 * @returns Promise with a success status and optional error message
 */
export const deleteAuthor = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`/api/authors/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || `Error deleting author: ${response.statusText}` 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete author with ID ${id}:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};
