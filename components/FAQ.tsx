import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from './IconComponents';

interface FAQItemProps {
  question: string;
  answer: string;
  id: number;
}

interface FAQProps {
  title: string;
  subtitle: string;
  items: { question: string; answer: string }[];
}

/**
 * A single FAQ item component with accordion functionality.
 * Manages its own open/closed state and includes ARIA attributes for accessibility.
 */
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, id }) => {
  // State to manage the open/closed status of the accordion item.
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `faq-panel-${id}`;
  const headingId = `faq-heading-${id}`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 py-5">
      <h3 id={headingId} className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
        >
          <span>{question}</span>
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <PlusIcon className={`h-6 w-6 ${isOpen ? 'text-brand' : 'text-gray-500'}`} />
          </span>
        </button>
      </h3>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="mt-4 text-gray-600 dark:text-gray-400 animate-slide-down">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

/**
 * The FAQ section component.
 * It maps over the data passed via props and renders a list of FAQItem components.
 */
const FAQ: React.FC<FAQProps> = ({ title, subtitle, items }) => {
  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 lg:p-10 shadow-xl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-black dark:text-white text-center">
          {title}
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
          {subtitle}
        </p>
        <div className="mt-8">
          {items.map((item, index) => (
            <FAQItem key={index} id={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
