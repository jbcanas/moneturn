import { useState, useEffect, type JSX } from 'react';
import { Layout } from '../components/layout';
import { AddAuthorModal } from '../components/add-author-modal';
import { AuthorDetailsModal } from '../components/author-details-modal';
import { fetchAllAuthors, type Author } from '../api/authors';

/**
 * Authors page component
 */
export const Authors = (): JSX.Element => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Fetch authors on component mount
  useEffect(() => {
    const loadAuthors = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchAllAuthors();
        setAuthors(data);
      } catch (err) {
        setError('Failed to load authors. Please try again later.');
        console.error('Error loading authors:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthors();
  }, []);

  /**
   * Handles adding a new author to the state
   */
  const handleAuthorAdded = (newAuthor: Author): void => {
    setAuthors((prevAuthors) => [...prevAuthors, newAuthor]);
  };

  /**
   * Handles updating an author in the state
   */
  const handleAuthorUpdated = (updatedAuthor: Author): void => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === updatedAuthor.id ? updatedAuthor : author
      )
    );
    setSelectedAuthor(updatedAuthor);
  };

  /**
   * Handles deleting an author from the state
   */
  const handleAuthorDeleted = (deletedAuthorId: number): void => {
    setAuthors((prevAuthors) =>
      prevAuthors.filter((author) => author.id !== deletedAuthorId)
    );
    setSelectedAuthor(null);
    setIsDetailsModalOpen(false);
  };

  /**
   * Opens the details modal for an author
   */
  const handleAuthorClick = (author: Author): void => {
    setSelectedAuthor(author);
    setIsDetailsModalOpen(true);
  };

  /**
   * Renders the authors list
   */
  const renderAuthorsList = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      );
    }
    
    if (authors.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">No authors found.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Add Your First Author
          </button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleAuthorClick(author)}
          >
            <h3 className="text-lg font-medium text-gray-800 mb-2">{author.name}</h3>
            <p className="text-sm text-gray-500">
              Added on {new Date(author.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout activeNavItem="authors">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Author
          </button>
        </div>
        
        {renderAuthorsList()}
        
        <AddAuthorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAuthorAdded={handleAuthorAdded}
        />
        
        <AuthorDetailsModal
          isOpen={isDetailsModalOpen}
          author={selectedAuthor}
          onClose={() => setIsDetailsModalOpen(false)}
          onAuthorUpdated={handleAuthorUpdated}
          onAuthorDeleted={handleAuthorDeleted}
        />
      </div>
    </Layout>
  );
};
