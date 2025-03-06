import { type ReactElement, useState, useEffect } from 'react';
import { createBook, type CreateBookInput, type Book } from '../api/books';
import { fetchAllAuthors, createAuthor, type Author, type CreateAuthorInput } from '../api/authors';
import { type BookInfo } from './book-card';

/**
 * Props for the AddBookModal component
 */
interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: (newBook: BookInfo) => void;
}

/**
 * AddBookModal component displays a modal form for adding a new book
 */
export const AddBookModal = ({ isOpen, onClose, onBookAdded }: AddBookModalProps): ReactElement | null => {
  const [title, setTitle] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [authorId, setAuthorId] = useState<string>('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // New author form state
  const [isAddingAuthor, setIsAddingAuthor] = useState<boolean>(false);
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [authorError, setAuthorError] = useState<string | null>(null);
  
  // Fetch authors for the dropdown
  const loadAuthors = async () => {
    try {
      const authorsList = await fetchAllAuthors();
      setAuthors(authorsList);
      if (authorsList.length > 0 && !authorId) {
        setAuthorId(authorsList[0].id.toString());
      }
    } catch (err) {
      console.error('Error loading authors:', err);
      setError('Failed to load authors. Please try again later.');
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      loadAuthors();
    }
  }, [isOpen]);
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setYear(new Date().getFullYear().toString());
      setAuthorId('');
      setError(null);
      setSuccess(false);
      setIsAddingAuthor(false);
      setNewAuthorName('');
      setAuthorError(null);
    }
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }
  
  /**
   * Handles adding a new author
   */
  const handleAddAuthor = async () => {
    if (!newAuthorName.trim()) {
      setAuthorError('Author name is required');
      return;
    }
    
    try {
      setLoading(true);
      setAuthorError(null);
      
      const authorData: CreateAuthorInput = {
        name: newAuthorName.trim()
      };
      
      const result = await createAuthor(authorData);
      
      if (result) {
        // Refresh authors list
        await loadAuthors();
        
        // Select the newly created author
        setAuthorId(result.id.toString());
        
        // Reset new author form
        setNewAuthorName('');
        setIsAddingAuthor(false);
      } else {
        setAuthorError('Failed to create author. Please try again.');
      }
    } catch (err) {
      console.error('Error creating author:', err);
      setAuthorError('An error occurred while creating the author. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
      setError('Year must be a valid 4-digit number');
      return;
    }
    
    if (!authorId) {
      setError('Author is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const bookData: CreateBookInput = {
        title: title.trim(),
        year: yearNum,
        authorId: parseInt(authorId, 10)
      };
      
      const result = await createBook(bookData);
      
      if (result) {
        setSuccess(true);
        // Reset form
        setTitle('');
        setYear(new Date().getFullYear().toString());
        setAuthorId(authors.length > 0 ? authors[0].id.toString() : '');
        
        // Find the author name for the new book
        const selectedAuthor = authors.find(author => author.id === parseInt(authorId, 10));
        
        // Create a BookInfo object from the result
        const newBookInfo: BookInfo = {
          id: result.id.toString(),
          title: result.title,
          author: selectedAuthor?.name || 'Unknown Author',
          year: result.year.toString(),
          coverImage: '', // This will be assigned by the Books component
          rating: '0' // Default rating
        };
        
        // Notify parent component with the new book
        onBookAdded(newBookInfo);
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Failed to create book. Please try again.');
      }
    } catch (err) {
      console.error('Error creating book:', err);
      setError('An error occurred while creating the book. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Book added successfully!
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter book title"
              disabled={loading || success}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1000"
              max="9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter publication year"
              disabled={loading || success}
            />
          </div>
          
          <div className="mb-6">
            {!isAddingAuthor ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingAuthor(true)}
                    className="text-sm text-orange-600 hover:text-orange-800 focus:outline-none"
                    disabled={loading || success}
                  >
                    + Add New Author
                  </button>
                </div>
                <select
                  id="author"
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading || success || authors.length === 0}
                >
                  {authors.length === 0 ? (
                    <option value="">Loading authors...</option>
                  ) : (
                    authors.map((author) => (
                      <option key={author.id} value={author.id.toString()}>
                        {author.name}
                      </option>
                    ))
                  )}
                </select>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="newAuthor" className="block text-sm font-medium text-gray-700">
                    New Author
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingAuthor(false)}
                    className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
                
                {authorError && (
                  <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-lg">
                    {authorError}
                  </div>
                )}
                
                <div className="flex">
                  <input
                    type="text"
                    id="newAuthor"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter author name"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 focus:outline-none"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none"
              disabled={loading || success || isAddingAuthor}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
