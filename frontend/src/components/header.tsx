import { type ReactElement } from 'react';
import { SearchBar } from './search-bar';

/**
 * Props for the Header component
 */
interface HeaderProps {
  username: string;
}

/**
 * Header component for the application
 */
export const Header = ({ username }: HeaderProps): ReactElement => {
  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">{username}</span>
        </div>
      </div>
    </header>
  );
};
