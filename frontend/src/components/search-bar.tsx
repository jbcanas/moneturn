import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component for searching content
 */
export const SearchBar = ({ onSearch, placeholder = 'Search for books or authors' }: SearchBarProps): ReactElement => {
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Handles the search submission
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim()) {
      // If onSearch prop is provided, call it
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Otherwise, navigate to the search results page
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          className="w-full p-4 pl-12 text-sm text-gray-900 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2.5 bottom-2.5 text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm px-5 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};
