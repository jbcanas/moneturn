import { type ReactElement, useMemo } from 'react';

/**
 * Book information interface
 */
export interface BookInfo {
  id: string;
  title: string;
  author: string;
  year: string;
  coverImage: string;
  rating?: string; // Add rating field as optional
}

/**
 * Props for the BookCard component
 */
interface BookCardProps {
  book: BookInfo;
  onBookDetailsModalOpen?: () => void;
}

/**
 * Array of background color classes for book covers
 */
const BACKGROUND_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
];

export const BookCard = ({ book, onBookDetailsModalOpen }: BookCardProps): ReactElement => {
  const { title, author, year } = book;
  
  // Generate a random background color based on the book id to ensure consistency
  const backgroundColorClass = useMemo(() => {
    // Use the book id to create a deterministic but seemingly random color
    const colorIndex = book.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % BACKGROUND_COLORS.length;
    return BACKGROUND_COLORS[colorIndex];
  }, [book.id]);
  
  const handleCardClick = () => {
    if (onBookDetailsModalOpen) {
      onBookDetailsModalOpen();
    }
  };
  
  return (
    <div 
      className="w-40 h-65 bg-white rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-center mb-2">
          <div 
            className={`h-[170px] w-[123px] flex items-center justify-center rounded p-2 text-center ${backgroundColorClass}`}
          >
            <span className="font-medium break-words">
              {title}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-700 line-clamp-1" title={title}>
            {title}
          </h3>
          <p className="text-xs text-gray-700">
            {author}, {year}
          </p>
        </div>
      </div>
    </div>
  );
};
