import { useState, type JSX, type FormEvent } from 'react';
import { createAuthor, type Author } from '../api/authors';

/**
 * Props for the AddAuthorModal component
 */
interface AddAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorAdded: (newAuthor: Author) => void;
}

/**
 * Modal component for adding a new author
 */
export const AddAuthorModal = ({ isOpen, onClose, onAuthorAdded }: AddAuthorModalProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resets the form state
   */
  const resetForm = (): void => {
    setName('');
    setError(null);
    setIsSubmitting(false);
  };

  /**
   * Handles the form submission
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!name.trim()) {
      setError('Author name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createAuthor({ name: name.trim() });
      
      if (result) {
        onAuthorAdded(result);
        resetForm();
        onClose();
      } else {
        setError('Failed to create author. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the author.');
      console.error('Error creating author:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles closing the modal
   */
  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Author</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
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
              onClick={handleClose}
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
              {isSubmitting ? 'Adding...' : 'Add Author'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
