import { type ReactElement, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { BookCard, type BookInfo } from '../components/book-card';
import { search, type SearchResults } from '../api/search';
import book1 from '../assets/books/book1.svg';
import book2 from '../assets/books/book2.svg';
import book3 from '../assets/books/book3.svg';
import book4 from '../assets/books/book4.svg';
import book5 from '../assets/books/book5.svg';
import { BookDetailsModal } from '../components/book-details-modal';
import { AuthorDetailsModal } from '../components/author-details-modal';
import { type Author } from '../api/authors';

/**
 * Maps a backend book to the frontend BookInfo format
 * @param book - Backend book data
 * @param coverImage - Cover image to use
 * @returns BookInfo object for the frontend
 */
const mapBookToBookInfo = (book: any, coverImage: string): BookInfo => {
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
 * Search Results page component
 */
export const SearchResults = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<SearchResults>({ books: [], authors: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [isBookDetailsModalOpen, setIsBookDetailsModalOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isAuthorDetailsModalOpen, setIsAuthorDetailsModalOpen] = useState<boolean>(false);
  
  // Cover images to cycle through
  const coverImages = [book1, book2, book3, book4, book5];
  
  // Fetch search results on component mount or when query changes
  useEffect(() => {
    const fetchSearchResults = async (): Promise<void> => {
      if (!query) {
        setSearchResults({ books: [], authors: [] });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const results = await search(query);
        setSearchResults(results);
        setError(null);
      } catch (err) {
        console.error('Error searching:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  // Map books to BookInfo format with cover images
  const bookResults = searchResults.books.map((book, index) => 
    mapBookToBookInfo(book, coverImages[index % coverImages.length])
  );
  
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
    // Remove the deleted book from the search results
    setSearchResults(prev => ({
      ...prev,
      books: prev.books.filter(book => book.id.toString() !== deletedBookId)
    }));
    // Close the modal
    setIsBookDetailsModalOpen(false);
  };
  
  /**
   * Handles book updated event
   */
  const handleBookUpdated = (updatedBook: BookInfo): void => {
    // Update the book in the search results
    setSearchResults(prev => ({
      ...prev,
      books: prev.books.map(book => 
        book.id.toString() === updatedBook.id 
          ? { ...book, title: updatedBook.title, year: parseInt(updatedBook.year) } 
          : book
      )
    }));
  };
  
  /**
   * Handles author click
   */
  const handleAuthorClick = (author: Author): void => {
    setSelectedAuthor(author);
    setIsAuthorDetailsModalOpen(true);
  };
  
  /**
   * Handles author updated event
   */
  const handleAuthorUpdated = (updatedAuthor: Author): void => {
    // Update the author in the search results
    setSearchResults(prev => ({
      ...prev,
      authors: prev.authors.map(author => 
        author.id === updatedAuthor.id ? updatedAuthor : author
      )
    }));
    setSelectedAuthor(updatedAuthor);
  };
  
  /**
   * Handles author deleted event
   */
  const handleAuthorDeleted = (deletedAuthorId: number): void => {
    // Remove the deleted author from the search results
    setSearchResults(prev => ({
      ...prev,
      authors: prev.authors.filter(author => author.id !== deletedAuthorId)
    }));
    setSelectedAuthor(null);
    setIsAuthorDetailsModalOpen(false);
  };
  
  if (loading) {
    return (
      <Layout activeNavItem="search">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-xl text-gray-600">Searching...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout activeNavItem="search">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </Layout>
    );
  }
  
  const hasResults = bookResults.length > 0 || searchResults.authors.length > 0;
  
  return (
    <Layout activeNavItem="search">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results for "{query}"</h1>
          {hasResults ? (
            <p className="text-gray-600">
              Found {bookResults.length} book{bookResults.length !== 1 ? 's' : ''} and {searchResults.authors.length} author{searchResults.authors.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-gray-600">No results found. Try a different search term.</p>
          )}
        </div>
        
        {/* Books section */}
        {bookResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {bookResults.map((book) => (
                <div key={book.id}>
                  <BookCard 
                    book={book} 
                    onBookDetailsModalOpen={() => handleBookDetailsModalOpen(book)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Authors section */}
        {searchResults.authors.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.authors.map((author) => (
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
          </div>
        )}
        
        {/* Empty state */}
        {!hasResults && (
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">Try a different search term or browse all books and authors.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate('/books')}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Browse Books
              </button>
              <button
                onClick={() => navigate('/authors')}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Browse Authors
              </button>
            </div>
          </div>
        )}
        
        {/* Book Details Modal */}
        <BookDetailsModal 
          isOpen={isBookDetailsModalOpen}
          onClose={() => setIsBookDetailsModalOpen(false)}
          book={selectedBook}
          onBookDeleted={handleBookDeleted}
          onBookUpdated={handleBookUpdated}
          setSelectedBook={setSelectedBook}
        />
        
        {/* Author Details Modal */}
        <AuthorDetailsModal
          isOpen={isAuthorDetailsModalOpen}
          author={selectedAuthor}
          onClose={() => setIsAuthorDetailsModalOpen(false)}
          onAuthorUpdated={handleAuthorUpdated}
          onAuthorDeleted={handleAuthorDeleted}
        />
      </div>
    </Layout>
  );
};
