import React from 'react';
import SpinningBadge from './SpinningBadge';

interface PortfolioMarqueeProps {
  title: string;
  images: string[];
}

/**
 * A component that displays a continuously scrolling marquee of portfolio images.
 * It provides a dynamic and engaging way to showcase a large number of projects.
 * This version features a modern, overlapping layout.
 */
const PortfolioMarquee: React.FC<PortfolioMarqueeProps> = ({ title, images }) => {
  // Duplicate the images array to create a seamless looping effect.
  const doubledImages = [...images, ...images];

  return (
    // The section is now relative to act as a positioning container for the overlapping badge.
    <section className="relative">
      
      {/* The badge is given a z-index to ensure it sits on top of the image marquee. */}
      <div className="relative z-10">
        <SpinningBadge text={title} />
      </div>

      {/* The marquee is pulled up with a negative margin to create the overlap effect. */}
      <div
        className="relative w-full overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_48px,_black_calc(100%-48px),transparent_100%)] -mt-20"
      >
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {doubledImages.map((src, index) => (
            <div key={index} className="w-[300px] sm:w-[400px] flex-shrink-0 mx-4">
              <div className="group aspect-[4/3] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <img
                  src={src}
                  alt={`Portfolio example ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioMarquee;