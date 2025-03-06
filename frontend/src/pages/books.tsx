import { type ReactElement, useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { BookCard, type BookInfo } from '../components/book-card';
import book1 from '../assets/books/book1.svg';
import book2 from '../assets/books/book2.svg';
import book3 from '../assets/books/book3.svg';
import book4 from '../assets/books/book4.svg';
import book5 from '../assets/books/book5.svg';
import { fetchAllBooks, type Book } from '../api/books';
import { AddBookModal } from '../components/add-book-modal';
import { BookDetailsModal } from '../components/book-details-modal';

/**
 * Maps a backend book to the frontend BookInfo format
 * @param book - Backend book data
 * @param coverImage - Cover image to use
 * @returns BookInfo object for the frontend
 */
const mapBookToBookInfo = (book: Book, coverImage: string): BookInfo => {
  return {
    id: book.id.toString(),
    title: book.title,
    author: book.author.name,
    year: book.year.toString(),
    coverImage,
    // Add a random rating between 1-5 for demonstration purposes
    rating: (Math.floor(Math.random() * 5) + 1).toString()
  };
};

/**
 * Books page component
 */
export const Books = (): ReactElement => {
  const [allBooks, setAllBooks] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [isBookDetailsModalOpen, setIsBookDetailsModalOpen] = useState<boolean>(false);

  // Cover images to cycle through
  const coverImages = [book1, book2, book3, book4, book5];

  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'year'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch books from API
  const loadBooks = async (): Promise<void> => {
    try {
      setLoading(true);
      const books = await fetchAllBooks();
      
      // Map backend books to frontend format with rotating cover images
      const mappedBooks = books.map((book, index) => 
        mapBookToBookInfo(book, coverImages[index % coverImages.length])
      );
      
      setAllBooks(mappedBooks);
      setError(null);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Filters books based on search query
   */
  const filteredBooks = allBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.year.toString().includes(query)
    );
  });

  /**
   * Sorts books based on selected criteria
   */
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'author') {
      comparison = a.author.localeCompare(b.author);
    } else if (sortBy === 'year') {
      comparison = parseInt(a.year) - parseInt(b.year);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  /**
   * Handles sort selection change
   */
  const handleSortChange = (newSortBy: 'title' | 'author' | 'year'): void => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same sort option
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  /**
   * Handles book added event
   */
  const handleBookAdded = (newBook: BookInfo): void => {
    // Assign a cover image to the new book
    const coverImage = coverImages[allBooks.length % coverImages.length];
    const bookWithCover = { ...newBook, coverImage };
    
    // Add the new book to the allBooks array
    setAllBooks(prevBooks => [...prevBooks, bookWithCover]);
  };

  /**
   * Handles book details modal open
   */
  const handleBookDetailsModalOpen = (book: BookInfo): void => {
    setSelectedBook(book);
    setIsBookDetailsModalOpen(true);
  };
  
  /**
   * Handles book deleted event
   */
  const handleBookDeleted = (deletedBookId: string): void => {
    // Remove the deleted book from the allBooks array
    setAllBooks(prevBooks => prevBooks.filter(book => book.id !== deletedBookId));
    // Close the modal
    setIsBookDetailsModalOpen(false);
  };
  
  /**
   * Handles book updated event
   */
  const handleBookUpdated = (updatedBook: BookInfo): void => {
    setAllBooks(prevBooks =>
      prevBooks.map(book => 
        book.id === updatedBook.id ? { ...updatedBook, coverImage: book.coverImage } : book
      )
    );
  };

  if (loading) {
    return (
      <Layout activeNavItem="books">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-xl text-gray-600">Loading books...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout activeNavItem="books">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNavItem="books">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Books Collection</h1>
          <p className="text-gray-600">Browse through our extensive collection of books.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Book
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleSortChange('title')}
              className={`px-3 py-2 rounded-lg ${
                sortBy === 'title' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('author')}
              className={`px-3 py-2 rounded-lg ${
                sortBy === 'author' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('year')}
              className={`px-3 py-2 rounded-lg ${
                sortBy === 'year' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sortedBooks.map((book) => (
          <div key={book.id}>
            <BookCard 
              book={book} 
              onBookDetailsModalOpen={() => handleBookDetailsModalOpen(book)} 
            />
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {sortedBooks.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      
      {/* Add Book Modal */}
      <AddBookModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
      
      {/* Book Details Modal */}
      <BookDetailsModal 
        isOpen={isBookDetailsModalOpen}
        onClose={() => setIsBookDetailsModalOpen(false)}
        book={selectedBook}
        onBookDeleted={handleBookDeleted}
        onBookUpdated={handleBookUpdated}
        setSelectedBook={setSelectedBook}
      />
    </Layout>
  );
};
