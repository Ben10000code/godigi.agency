import React from 'react';
import { CheckCircleIcon, XCircleIcon, QuoteIcon } from './IconComponents';
import { Plan } from '../types';

interface Testimonial {
    quote: string;
    author: string;
    location: string;
}

interface PricingTierProps {
  plan: Plan;
  onPlanSelect: (plan: Plan) => void;
}

interface PricingStrategyProps {
  plans: Plan[];
  testimonials: {
      title: string;
      items: Testimonial[];
  };
  onPlanSelect: (plan: Plan) => void;
}


/**
 * A component that renders a single pricing plan card.
 * @param {Plan} plan - The plan data to display.
 * @param {(plan: Plan) => void} onPlanSelect - Callback function when the plan's CTA is clicked.
 */
const PricingTier: React.FC<PricingTierProps> = ({ plan, onPlanSelect }) => (
  <div className={`border rounded-xl p-6 transition-all duration-300 flex flex-col ${plan.isFeatured ? 'border-brand dark:border-brand bg-white dark:bg-gray-900 scale-105 shadow-2xl shadow-brand/20 dark:shadow-brand/10 z-10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600'}`}>
    <div className="flex justify-between items-center">
      <h3 className={`text-lg font-bold ${plan.isFeatured ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>{plan.name}</h3>
      {plan.isFeatured && <span className="bg-brand text-black text-xs font-semibold px-3 py-1 rounded-full">RECOMMENDED</span>}
    </div>
    <p className="text-3xl font-bold mt-2 text-black dark:text-white">{plan.price}</p>
    
    <div className="flex-grow">
        <ul className="space-y-3 mt-6 text-gray-600 dark:text-gray-400">
        {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-brand dark:text-brand mr-3 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
            </li>
        ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
             <p className="text-sm font-semibold text-gray-500 dark:text-gray-500 mb-3">What's not included:</p>
             <ul className="space-y-2.5 text-gray-500 dark:text-gray-500">
                {plan.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <XCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>

    <div className="mt-8">
      <button 
        onClick={() => onPlanSelect(plan)}
        className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ${
            plan.isFeatured ? 'bg-brand hover:brightness-90 text-black' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-700'
        }`}
      >
        {plan.value === 'free' ? 'Claim Free Homepage' : 'Choose This Plan'}
      </button>
    </div>
  </div>
);

/**
 * The main section that displays the pricing strategy, including the pricing grid and testimonials.
 * All content is passed in via props.
 */
const PricingStrategy: React.FC<PricingStrategyProps> = ({ plans, testimonials, onPlanSelect }) => {
  return (
    <section className="w-full">
       <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white">
                Simple, Transparent Pricing
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Start with a free homepage, then choose a plan that fits your business as you grow. No hidden fees, ever.
            </p>
        </div>

      {/* Renders the grid of pricing plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {plans.map(plan => (
           <PricingTier key={plan.name} plan={plan} onPlanSelect={onPlanSelect} />
        ))}
      </div>

       {/* Renders the scrolling testimonial marquee */}
       <div className="mt-20 w-full">
            <h3 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
                {testimonials.title}
            </h3>
            <div
                className="relative w-full overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
            >
                {/* The doubled array creates the seamless looping effect */}
                <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                    {[...testimonials.items, ...testimonials.items].map((testimonial, index) => (
                        <div key={index} className="w-[340px] sm:w-[420px] flex-shrink-0 mx-4">
                            <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 h-full flex flex-col">
                                <QuoteIcon className="h-8 w-8 text-brand/30 dark:text-brand/20 mb-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                <p className="text-gray-700 dark:text-gray-300 italic flex-grow">"{testimonial.quote}"</p>
                                <div className="mt-4 text-right">
                                    <p className="font-bold text-black dark:text-white">- {testimonial.author}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default PricingStrategy;