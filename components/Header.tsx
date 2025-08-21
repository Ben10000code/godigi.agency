import React from 'react';

/**
 * Props for the Header component.
 * @property {() => void} onCtaClick - A callback function to be executed when the main call-to-action button is clicked.
 */
interface HeaderProps {
  onCtaClick: () => void;
}

/**
 * The main hero section of the landing page.
 * It contains the logo, tagline, primary heading, and the main call-to-action button.
 */
const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  return (
    <section className="text-center pt-20">
      {/* Logo */}
      <div className="opacity-0 animate-fade-in-up">
        <a href="/" className="inline-block text-2xl tracking-tight text-black dark:text-white">
          <span className="font-extrabold">godigi</span><span className="font-normal text-gray-500 dark:text-gray-400">.agency</span>
        </a>
      </div>

      {/* Content Wrapper */}
      <div className="max-w-4xl mx-auto">
        {/* Tagline Pill */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="inline-block bg-brand text-black text-sm font-semibold px-4 py-2 rounded-full mt-20">
            The perfect, risk-free start for your business.
          </p>
        </div>
        
        {/* Main Heading */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
            Get a Stunning Homepage, Absolutely Free.
          </h1>
        </div>
        
        {/* Subheading / Description */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            I build your high-converting homepage in hours to prove my value. Love it? Let's build the rest.
          </p>
        </div>
        
        {/* Reassuring Sub-line */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            No risk. No credit card required. Just a beautiful, functional homepage to prove my value.
          </p>
        </div>

        {/* Call-to-Action Button */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="mt-8">
            <button 
              onClick={onCtaClick}
              className="group inline-block bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-4 px-10 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">🚀</span>
              <span className="ml-2">Claim My Free Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;