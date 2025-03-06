import { useState, useEffect, type JSX, type FormEvent } from 'react';
import { updateAuthor, deleteAuthor, type Author } from '../api/authors';

/**
 * Props for the AuthorDetailsModal component
 */
interface AuthorDetailsModalProps {
  isOpen: boolean;
  author: Author | null;
  onClose: () => void;
  onAuthorUpdated: (updatedAuthor: Author) => void;
  onAuthorDeleted: (deletedAuthorId: number) => void;
}

/**
 * Modal component for viewing, editing, and deleting author details
 */
export const AuthorDetailsModal = ({
  isOpen,
  author,
  onClose,
  onAuthorUpdated,
  onAuthorDeleted
}: AuthorDetailsModalProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Update form when author changes
  useEffect(() => {
    if (author) {
      setName(author.name);
    }
    setIsEditing(false);
    setError(null);
    setShowDeleteConfirm(false);
  }, [author]);

  /**
   * Handles the form submission for updating an author
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    if (!author) return;
    
    // Validate form
    if (!name.trim()) {
      setError('Author name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateAuthor(author.id, { name: name.trim() });
      
      if (result) {
        onAuthorUpdated(result);
        setIsEditing(false);
      } else {
        setError('Failed to update author. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the author.');
      console.error('Error updating author:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles the deletion of an author
   */
  const handleConfirmDelete = async (): Promise<void> => {
    if (!author) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await deleteAuthor(author.id);
      
      if (result.success) {
        onAuthorDeleted(author.id);
        onClose();
      } else {
        setError(result.message || 'Failed to delete author. Please try again.');
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      setError('An error occurred while deleting the author.');
      console.error('Error deleting author:', err);
      setShowDeleteConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Formats a date string to a readable format
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || !author) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Author' : 'Author Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {showDeleteConfirm ? (
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this author? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Author'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter author name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Author Name</h3>
                  <p className="text-gray-900">{author.name}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="text-gray-900">{formatDate(author.createdAt)}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-gray-900">{formatDate(author.updatedAt)}</p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
