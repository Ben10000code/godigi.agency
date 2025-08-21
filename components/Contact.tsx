import React, { useState } from 'react';
import { EnvelopeIcon, WhatsAppIcon } from './IconComponents';
import { ContactDetails } from '../types';

interface ContactProps {
    details: ContactDetails;
}

/**
 * A component that displays contact information in a card format.
 * It now includes an interactive widget for sending a WhatsApp message.
 */
const Contact: React.FC<ContactProps> = ({ details }) => {
  // State to manage the user-editable WhatsApp message.
  const [whatsappMessage, setWhatsappMessage] = useState(details.whatsappPrefill || '');

  // Function to open the WhatsApp chat link with the current message.
  const handleSendWhatsApp = () => {
    const url = `https://wa.me/${details.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 lg:p-10 shadow-xl h-full">
      <h2 className="text-3xl font-extrabold text-black dark:text-white">
        {details.title}
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {details.subtitle}
      </p>

      <div className="mt-8 space-y-6">
        <a href={`mailto:${details.email}`} className="group flex items-start">
          <EnvelopeIcon className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Email Me</h3>
            <p className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:underline break-all">
              {details.email}
            </p>
            {/* Conditionally render the secondary email if it exists */}
            {details.secondaryEmail && (
               <p className="mt-1 block text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:underline break-all">
                {details.secondaryEmail}
               </p>
            )}
          </div>
        </a>

        {/* This section is now an interactive WhatsApp widget */}
        {details.whatsappNumber && (
            <div className="flex items-start">
              <WhatsAppIcon className="h-6 w-6 text-brand mr-4 mt-1 flex-shrink-0" />
              <div className="w-full">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">WhatsApp Me</h3>
                <div className="mt-2">
                    <textarea
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition"
                        placeholder="Your message..."
                    />
                    <button
                        onClick={handleSendWhatsApp}
                        className="mt-2 w-full font-bold py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-700 transition-colors text-sm"
                    >
                        Send on WhatsApp
                    </button>
                </div>
              </div>
            </div>
        )}

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
           <h3 className="font-semibold text-gray-800 dark:text-gray-200">Business Hours</h3>
            <div className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <p dangerouslySetInnerHTML={{ __html: details.hours.line1 }} />
                <p dangerouslySetInnerHTML={{ __html: details.hours.line2 }} />
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: details.hours.line3 }} />
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Contact;
