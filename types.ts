/**
 * Defines the structure for a pricing plan object.
 */
export interface Plan {
  name: string;
  price: string;
  features: string[];
  notIncluded: string[];
  isFeatured?: boolean;
  value: string; // This should match a value in the form's budget dropdown
}

/**
 * Defines the structure for the contact details object.
 */
export interface ContactDetails {
    title: string;
    subtitle: string;
    email: string;
    secondaryEmail?: string; // Optional secondary email address
    phone: string;
    whatsappNumber?: string; // e.g., 27734422054
    whatsappPrefill?: string; // URL-encoded pre-filled message
    hours: {
        line1: string;
        line2: string;
        line3: string;
    };
}

/**
 * Defines the structure for the global site settings object.
 */
export interface SiteSettings {
    backgroundPattern: 'crosses' | 'dots' | 'none';
    brandColor: string; // Accepts any valid CSS hex color
}
