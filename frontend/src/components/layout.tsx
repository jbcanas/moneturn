import { type JSX, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

/**
 * Props for the Layout component
 */
interface LayoutProps {
  children: ReactNode;
  activeNavItem?: string;
  username?: string;
}

/**
 * Layout component that provides consistent page structure
 * Can be used to wrap any page content
 */
export const Layout = ({
  children,
  activeNavItem = 'home',
  username = 'John Doe'
}: LayoutProps): JSX.Element => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeNavItem} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username={username} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
