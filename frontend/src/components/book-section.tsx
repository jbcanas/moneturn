import { type ReactElement } from 'react';
import { BookCard, type BookInfo } from './book-card';

/**
 * Props for the BookSection component
 */
interface BookSectionProps {
  title: string;
  books: BookInfo[];
  showAllLink?: string;
}

/**
 * BookSection component displays a section of books with a title and optional "Show All" link
 */
export const BookSection = ({ title, books, showAllLink }: BookSectionProps): ReactElement => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium text-gray-700">{title}</h2>
        {showAllLink && (
          <a href={showAllLink} className="text-gray-500 hover:text-gray-700 text-lg">
            Show All
          </a>
        )}
      </div>
      <div className="flex space-x-10 overflow-x-auto pb-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
