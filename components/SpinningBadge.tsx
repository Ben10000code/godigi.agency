import React from 'react';
import { DownArrowIcon } from './IconComponents';

/**
 * A self-contained component that renders an SVG with text curved along a circular path.
 * This SVG is then animated to spin continuously, creating a modern, eye-catching badge.
 * @param {string} text - The text to display along the circular path.
 */
const SpinningBadge: React.FC<{ text: string }> = ({ text }) => {
  return (
    // The component now returns the spinning element directly, allowing the parent to control its position.
    <div className="relative w-36 h-36 animate-spin-slow" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text fill="currentColor" className="text-gray-900 dark:text-gray-200 text-[11px] font-bold tracking-wider uppercase">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DownArrowIcon className="h-6 w-6 text-gray-800 dark:text-gray-300 animate-bob" />
      </div>
    </div>
  );
};

export default SpinningBadge;