import React from 'react';
import { ArrowUpIcon } from './IconComponents';

interface BackToTopButtonProps {
  isVisible: boolean;
}

/**
 * A button that appears when the user scrolls down the page,
 * allowing them to smoothly scroll back to the top.
 */
const BackToTopButton: React.FC<BackToTopButtonProps> = ({ isVisible }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black backdrop-blur-sm shadow-lg transition-opacity duration-300 hover:bg-black dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};

export default BackToTopButton;