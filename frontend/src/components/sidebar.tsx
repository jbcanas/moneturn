import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  activeItem: string;
}

/**
 * Sidebar component for navigation
 */
export const Sidebar = ({ activeItem }: SidebarProps): JSX.Element => {
  const navItems = [
    { id: 'books', label: 'Books', icon: 'book', path: '/books' },
    { id: 'authors', label: 'Authors', icon: 'author', path: '/authors' },
  ];

  /**
   * Renders the appropriate icon for a navigation item
   */
  const renderIcon = (iconName: string): JSX.Element => {
    switch (iconName) {
      case 'book':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'author':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
    }
  };

  return (
    <div className="h-screen w-64 bg-[#F9FAFB] shadow-md flex flex-col">
      <div className="p-4 flex justify-center">
        <img src={logo} alt="Moneturn Logo" className="h-16" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-8">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2 ${
                    activeItem === item.id ? 'bg-orange-50 text-orange-600' : ''
                  }`}
                >
                  <span className={`${activeItem === item.id ? 'text-orange-500' : 'text-gray-500'}`}>
                    {renderIcon(item.icon)}
                  </span>
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};
