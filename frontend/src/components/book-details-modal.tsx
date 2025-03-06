import { type ReactElement, useState, useEffect } from 'react';
import { type BookInfo } from './book-card';
import { deleteBook, updateBook, type UpdateBookInput } from '../api/books';
import { fetchAllAuthors, type Author } from '../api/authors';

/**
 * Props for the BookDetailsModal component
 */
interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookInfo | null;
  onBookDeleted?: (deletedBookId: string) => void;
  onBookUpdated?: (updatedBook: BookInfo) => void;
  setSelectedBook?: (book: BookInfo) => void;
}

/**
 * BookDetailsModal component displays detailed information about a book
 */
export const BookDetailsModal = ({ isOpen, onClose, book, onBookDeleted, onBookUpdated, setSelectedBook }: BookDetailsModalProps): ReactElement | null => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  
  // Update form states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateBookInput>({
    title: '',
    year: 0,
    authorId: 0
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState<boolean>(false);
  
  /**
   * Initializes form data when book changes
   */
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        year: parseInt(book.year, 10),
      });
      
      // Load authors for the dropdown
      const loadAuthors = async (): Promise<void> => {
        setIsLoadingAuthors(true);
        try {
          const authorsList = await fetchAllAuthors();
          setAuthors(authorsList);
          
          // Try to find the current author in the list and set authorId
          const currentAuthor = authorsList.find(a => a.name === book.author);
          if (currentAuthor) {
            setFormData(prev => ({ ...prev, authorId: currentAuthor.id }));
          }
        } catch (error) {
          console.error('Error loading authors:', error);
        } finally {
          setIsLoadingAuthors(false);
        }
      };
      
      loadAuthors();
    }
  }, [book]);
  
  if (!isOpen || !book) {
    return null;
  }

  const { id, title, author, year } = book;
  
  /**
   * Handles the delete button click
   */
  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true);
  };
  
  /**
   * Handles the cancel delete action
   */
  const handleCancelDelete = (): void => {
    setShowDeleteConfirm(false);
  };
  
  /**
   * Handles the confirm delete action
   */
  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      const success = await deleteBook(parseInt(id, 10));
      
      if (success) {
        // Notify parent component with deleted book ID
        if (onBookDeleted) {
          onBookDeleted(id);
        }
        onClose();
      } else {
        setDeleteError('Failed to delete the book. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      setDeleteError('An error occurred while deleting the book. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  /**
   * Handles form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'authorId' ? parseInt(value, 10) : value
    }));
  };
  
  /**
   * Toggles edit mode
   */
  const toggleEditMode = (): void => {
    setIsEditing(!isEditing);
    setUpdateError(null);
    setUpdateSuccess(false);
  };
  
  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      const updatedBook = await updateBook(parseInt(id, 10), formData);
      
      if (updatedBook) {
        // Find the selected author
        const selectedAuthor = authors.find(a => a.id === formData.authorId);
        
        if (selectedAuthor && book) {
          // Create updated book info
          const updatedBookInfo: BookInfo = {
            ...book,
            title: formData.title || book.title,
            year: formData.year?.toString() || book.year,
            author: selectedAuthor.name
          };
          
          // Update the selected book in the parent component
          if (setSelectedBook) {
            setSelectedBook(updatedBookInfo);
          }
          
          // Notify parent component with updated book
          if (onBookUpdated) {
            onBookUpdated(updatedBookInfo);
          }
        }
        
        setUpdateSuccess(true);
        setIsEditing(false);
      } else {
        setUpdateError('Failed to update the book. Please try again.');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setUpdateError('An error occurred while updating the book. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Book Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            disabled={isDeleting || isUpdating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {deleteError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {deleteError}
            </div>
          )}
          
          {updateError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {updateError}
            </div>
          )}
          
          {updateSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Book updated successfully!
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book cover representation */}
            <div className="flex justify-center">
              <div className="h-[200px] w-[140px] flex items-center justify-center rounded p-3 text-center bg-gray-100">
                <span className="font-medium break-words text-gray-800">
                  {title}
                </span>
              </div>
            </div>
            
            {/* Book details */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Author</p>
                      <p className="text-base text-gray-800">{author}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Publication Year</p>
                      <p className="text-base text-gray-800">{year}</p>
                    </div>
                    
                    <div className="pt-2">
                      {!showDeleteConfirm ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={toggleEditMode}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none flex items-center"
                            disabled={isDeleting}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          
                          <button
                            onClick={handleDeleteClick}
                            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none flex items-center"
                            disabled={isDeleting}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm text-red-600 font-medium">Are you sure you want to delete this book?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleConfirmDelete}
                              className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none text-sm"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none text-sm"
                              disabled={isDeleting}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Publication Year</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">Author</label>
                    <select
                      id="authorId"
                      name="authorId"
                      value={formData.authorId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                      disabled={isLoadingAuthors}
                    >
                      <option value="">Select an author</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                    {isLoadingAuthors && (
                      <p className="mt-1 text-sm text-gray-500">Loading authors...</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={toggleEditMode}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none"
            disabled={isDeleting || isUpdating}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
