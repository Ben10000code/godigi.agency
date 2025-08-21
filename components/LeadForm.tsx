import React, { useState, ChangeEvent, FormEvent, useCallback, useEffect } from 'react';
import { CheckCircleIcon } from './IconComponents';
import { Plan } from '../types';

// Type definition for the form's state. Allows for string or string array values.
type FormState = {
  [key: string]: string | string[];
};

// Initial state for the form, ensuring all fields are controlled components from the start.
const initialFormState: FormState = {
    businessName: '', ownerName: '', phone: '', email: '', businessType: '',
    businessDescription: '', address: '', currentWebsite: 'no', features: [],
    contactInfo: '', openingHours: '', servicesList: '', aboutContent: '',
    ownerPhoto: 'no', photoInfo: '', customerTestimonials: '', exactAddress: '',
    parkingInfo: '', socialLinks: '', colors: '', urgency: 'asap', budget: '',
    additionalInfo: '', otherBusinessType: '', desiredPages: '',
    heroSectionInfo: '', featuresBenefitsInfo: '', inspirationLinks: '',
    oldWebsiteLink: '', anyRelevantInfo: '',
};

/**
 * A container component that conditionally renders its children based on the `isVisible` prop.
 * Used for the pop-out detail sections in the form.
 */
const DetailSection: React.FC<{ isVisible: boolean; children: React.ReactNode }> = ({ isVisible, children }) => {
    if (!isVisible) return null;
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg p-5 mt-4 animate-slide-down">
            {children}
        </div>
    );
};

/** Reusable Form Input Component with validation feedback */
const FormInput: React.FC<{id: string, name: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, required?: boolean, placeholder?: string, type?: string}> = 
    ({ id, name, label, value, onChange, required=false, placeholder='', type='text'}) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={id} name={name} value={value as string} onChange={onChange} required={required} placeholder={placeholder} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition group-[.was-validated]:invalid:border-red-500 dark:group-[.was-validated]:invalid:border-red-500 focus:invalid:ring-red-500 dark:focus:invalid:ring-red-500"/>
        {required && <p className="mt-1 text-sm text-red-600 dark:text-red-400 invisible group-[.was-validated]:peer-invalid:visible">This field is required.</p>}
    </div>
);

/** Reusable Form Textarea Component with validation feedback */
const FormTextarea: React.FC<{id: string, name: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean, placeholder?: string, rows?: number}> =
    ({ id, name, label, value, onChange, required = false, placeholder = '', rows = 3 }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <textarea id={id} name={name} value={value as string} onChange={onChange} required={required} placeholder={placeholder} rows={rows} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition group-[.was-validated]:invalid:border-red-500 dark:group-[.was-validated]:invalid:border-red-500 focus:invalid:ring-red-500 dark:focus:invalid:ring-red-500"></textarea>
        {required && <p className="mt-1 text-sm text-red-600 dark:text-red-400 invisible group-[.was-validated]:peer-invalid:visible">This field is required.</p>}
    </div>
);

/** Reusable Form Select Component with validation feedback */
const FormSelect: React.FC<{id: string, name: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode}> =
    ({ id, name, label, value, onChange, required = false, children }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <select id={id} name={name} value={value as string} onChange={onChange} required={required} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition appearance-none bg-no-repeat bg-right pr-8 group-[.was-validated]:invalid:border-red-500 dark:group-[.was-validated]:invalid:border-red-500 focus:invalid:ring-red-500 dark:focus:invalid:ring-red-500" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
            {children}
        </select>
        {required && <p className="mt-1 text-sm text-red-600 dark:text-red-400 invisible group-[.was-validated]:peer-invalid:visible">This field is required.</p>}
    </div>
);

/**
 * The main lead generation form component.
 * Manages its own state for all form fields and handles submission via Web3Forms.
 */
const LeadForm: React.FC<{ selectedPlan: Plan | null }> = ({ selectedPlan }) => {
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasValidated, setWasValidated] = useState(false);
    
    // Your public access key for Web3Forms
    const WEB3FORMS_ACCESS_KEY = "edbef36a-00d3-4219-b17b-37cac72b033b";

    /**
     * Effect to synchronize the form with the selected plan.
     * - Sets the budget dropdown.
     * - Pre-selects required features for the "Free Homepage" plan.
     * - Clears multi-page info if switching back to the free plan.
     */
    useEffect(() => {
        if (selectedPlan) {
            setFormData(prev => {
                let newFeatures = prev.features as string[];
                let newDesiredPages = prev.desiredPages as string;

                // Pre-select required features for the Free plan
                if (selectedPlan.value === 'free') {
                    const defaultFeatures = ['contactinfo', 'servicesproducts', 'aboutsection'];
                    const currentFeatures = new Set(newFeatures);
                    defaultFeatures.forEach(f => currentFeatures.add(f));
                    newFeatures = Array.from(currentFeatures);
                    newDesiredPages = ''; // Clear pages field for free plan
                }
                
                return {
                    ...prev,
                    budget: selectedPlan.value,
                    features: newFeatures,
                    desiredPages: newDesiredPages,
                };
            });
        }
    }, [selectedPlan]);
    
    // Memoized handler for input changes to prevent re-renders.
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Memoized handler for checkbox changes.
    const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentFeatures = (prev.features as string[]) || [];
            if (checked) {
                return { ...prev, features: [...currentFeatures, value] };
            } else {
                return { ...prev, features: currentFeatures.filter(f => f !== value) };
            }
        });
    }, []);
    
    // Generates a clean, readable text summary of the form data for the email.
    const generateFormattedSummary = (data: FormState, plan: Plan | null) => {
        let summary = `🚀 NEW WEBSITE REQUEST\n`;
        summary += `===================================\n\n`;
        
        summary += `**SELECTED PACKAGE:**\n`;
        summary += `${plan ? plan.name : 'Not Specified'}\n\n`;

        summary += `**BUSINESS INFO:**\n`;
        summary += `- Business: ${data.businessName}\n`;
        summary += `- Owner: ${data.ownerName}\n`;
        summary += `- Phone: ${data.phone}\n`;
        summary += `- Email: ${data.email}\n`;
        summary += `- Type: ${data.businessType === 'other' ? data.otherBusinessType : data.businessType}\n`;
        summary += `- Location: ${data.address}\n`;
        summary += `- Description: ${data.businessDescription}\n\n`;
        
        summary += `**CURRENT SITUATION:**\n`;
        summary += `- Current website: ${data.currentWebsite}\n`;
        summary += `- Urgency: ${data.urgency}\n`;
        summary += `- Budget: ${data.budget}\n\n`;

        if (data.desiredPages) {
            summary += `**DESIRED PAGES:**\n${data.desiredPages}\n\n`;
        }
        
        const selectedFeatures = data.features as string[];
        summary += `**HOMEPAGE FEATURES REQUESTED:**\n`;
        summary += `${selectedFeatures.length > 0 ? selectedFeatures.map(f => f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(', ') : 'None selected'}\n\n`;
        
        summary += `**DETAILED INFO:**\n`;
        if (selectedFeatures.includes('herosection')) summary += `- Hero Section Info:\n${data.heroSectionInfo}\n\n`;
        if (selectedFeatures.includes('featuresbenefits')) summary += `- Features & Benefits Info:\n${data.featuresBenefitsInfo}\n\n`;
        if (selectedFeatures.includes('inspirationlinks')) summary += `- Inspiration Links:\n${data.inspirationLinks}\n\n`;
        if (selectedFeatures.includes('oldwebsitelink')) summary += `- Old Website Link:\n${data.oldWebsiteLink}\n\n`;
        if (selectedFeatures.includes('anyrelevantinfo')) summary += `- Any Relevant Info:\n${data.anyRelevantInfo}\n\n`;
        if (selectedFeatures.includes('contactinfo')) summary += `- Contact Details:\n${data.contactInfo}\n\n`;
        if (selectedFeatures.includes('openinghours')) summary += `- Opening Hours:\n${data.openingHours}\n\n`;
        if (selectedFeatures.includes('servicesproducts')) summary += `- Services/Products:\n${data.servicesList}\n\n`;
        if (selectedFeatures.includes('aboutsection')) summary += `- About Business:\n${data.aboutContent}\n\n`;
        if (selectedFeatures.includes('photogallery')) summary += `- Photo/Video Gallery Info:\n${data.photoInfo}\n\n`;
        if (selectedFeatures.includes('testimonials')) summary += `- Testimonials:\n${data.customerTestimonials}\n\n`;
        if (selectedFeatures.includes('locationmap')) summary += `- Map Address:\n${data.exactAddress}\n\n`;
        if (selectedFeatures.includes('sociallinks')) summary += `- Social Links:\n${data.socialLinks}\n\n`;

        return summary;
    };


    // Handles the form submission event.
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setWasValidated(true);

        const form = e.target as HTMLFormElement;
        if (!form.checkValidity()) {
            return;
        }

        setIsSubmitting(true);
        
        const formattedSummary = generateFormattedSummary(formData, selectedPlan);
        const submissionData = {
            ...formData,
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New Website Request from ${formData.businessName}`,
            summary: formattedSummary,
        };
        
        // Also send data to the Make.com webhook
        const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/uaheo9q734vh6r1mh96demjc8v37wbpl";
        const makeWebhookData = {
            ...formData,
            selectedPlan: selectedPlan,
            subject: `New Website Request from ${formData.businessName}`,
            summary: formattedSummary,
        };

        try {
            // Send to Make.com webhook (fire-and-forget, non-blocking)
            fetch(MAKE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(makeWebhookData),
            }).catch(error => {
                // Log the error but don't block the primary form submission success
                console.error("Error sending data to Make.com webhook:", error);
            });

            // Primary submission to Web3Forms
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(submissionData),
            });
            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
            } else {
                console.error("Submission failed:", result);
                alert("Sorry, there was an error submitting your form. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Sorry, there was an error submitting your form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Scrolls the user back up to the pricing section.
    const scrollToPricing = () => {
        document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
    }

    // Renders the success message after the form is submitted.
    if (submitted) {
        return (
            <div id="lead-form" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 lg:p-10 text-center animate-fade-in-up shadow-xl">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-black dark:text-white mt-4">Success! Your Request is In.</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    I've received your details and am excited to get started. A confirmation has been sent to <strong>{formData.email}</strong>.
                </p>

                <div className="text-left mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
                    <h4 className="font-bold text-lg text-black dark:text-white mb-3">What Happens Next?</h4>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        <li>
                            <strong>Design in Progress:</strong> I am now crafting your professional, high-converting homepage.
                        </li>
                        <li>
                            <strong>Check Your Email:</strong> Within the next <strong>4-8 hours</strong>, you will receive an email with a private link to preview your new homepage.
                        </li>
                        <li>
                            <strong>Prepare Your Assets:</strong> To speed things up, please gather any logos, specific brand colors, or photos you'd like to use. You can send them to me by replying to my email.
                        </li>
                    </ol>
                    <p className="text-xs text-gray-500 mt-4">
                        P.S. If you don't see my email, please check your spam or junk folder!
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setSubmitted(false);
                        setWasValidated(false);
                        const currentBudget = formData.budget; // Keep the selected budget
                        setFormData({...initialFormState, budget: currentBudget, features: selectedPlan?.value === 'free' ? ['contactinfo', 'servicesproducts', 'aboutsection'] : []});
                    }}
                    className="mt-8 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-2 px-6 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    Submit Another Request
                </button>
            </div>
        )
    }

    const features = formData.features as string[];

  return (
    <section id="lead-form" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 lg:p-10 shadow-xl">
      <h2 className="text-3xl font-extrabold text-black dark:text-white">📋 Let's Build Your Website</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Fill out the details below. For the free homepage, I'll build it in 4-8 hours with no cost or obligation.</p>
      
      {/* Displays the currently selected package */}
      {selectedPlan && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Selected Package:</p>
            <div className="flex justify-between items-center mt-1">
                <p className="text-lg font-bold text-black dark:text-white">{selectedPlan.name} - {selectedPlan.price}</p>
                <button type="button" onClick={scrollToPricing} className="text-sm font-semibold text-black dark:text-white hover:underline">Change Plan</button>
            </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={`mt-8 group ${wasValidated ? 'was-validated' : ''}`}>
        <FormInput id="businessName" name="businessName" label="Business Name" value={formData.businessName as string} onChange={handleInputChange} required />
        <FormInput id="ownerName" name="ownerName" label="Owner/Contact Name" value={formData.ownerName as string} onChange={handleInputChange} required />
        <div className="grid sm:grid-cols-2 gap-x-6">
            <FormInput id="phone" name="phone" label="Phone Number" type="tel" value={formData.phone as string} onChange={handleInputChange} required />
            <FormInput id="email" name="email" label="Email Address" type="email" value={formData.email as string} onChange={handleInputChange} required />
        </div>
        <FormSelect id="businessType" name="businessType" label="Type of Business" value={formData.businessType as string} onChange={handleInputChange} required>
            <option value="">Select your business type...</option>
            <optgroup label="Food & Hospitality">
                <option value="restaurant">Restaurant / Cafe</option>
                <option value="bar">Bar / Pub</option>
                <option value="food_truck">Food Truck</option>
                <option value="catering">Catering Service</option>
                <option value="guesthouse">Guesthouse / B&B</option>
            </optgroup>
            <optgroup label="Retail & E-commerce">
                <option value="fashion">Fashion / Clothing</option>
                <option value="electronics">Electronics Store</option>
                <option value="homeware">Homeware / Decor</option>
                <option value="specialty">Specialty Goods</option>
                <option value="online_store">Online Store (E-commerce)</option>
            </optgroup>
             <optgroup label="Health, Wellness & Beauty">
                <option value="salon">Hair / Beauty Salon</option>
                <option value="spa">Spa / Wellness Center</option>
                <option value="fitness">Gym / Fitness Studio</option>
                <option value="therapist">Therapist / Counselor</option>
                <option value="healthcare">Healthcare Practitioner</option>
            </optgroup>
            <optgroup label="Home & Trade Services">
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="construction">Construction / Building</option>
                <option value="gardening">Gardening / Landscaping</option>
                <option value="cleaning">Cleaning Services</option>
                <option value="real_estate">Real Estate Agent</option>
            </optgroup>
            <optgroup label="Professional Services">
                <option value="consulting">Consulting</option>
                <option value="finance">Financial / Accounting</option>
                <option value="legal">Legal Services</option>
                <option value="marketing">Marketing / Creative Agency</option>
                <option value="it_services">IT Services</option>
            </optgroup>
            <optgroup label="Other">
                <option value="automotive">Automotive</option>
                <option value="events">Events / Entertainment</option>
                <option value="education">Education / Tutoring</option>
                <option value="non_profit">Non-Profit</option>
                <option value="other">Other</option>
            </optgroup>
        </FormSelect>

        {/* Conditionally render the 'Other' business type input */}
        {formData.businessType === 'other' && (
            <div className="pl-4 -mt-4 animate-slide-down">
                <FormInput
                    id="otherBusinessType"
                    name="otherBusinessType"
                    label="Please specify"
                    value={formData.otherBusinessType as string}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Photographer, Music Tutor"
                />
            </div>
        )}

        <FormTextarea id="businessDescription" name="businessDescription" label="Brief Business Description (2-3 sentences)" value={formData.businessDescription as string} onChange={handleInputChange} required placeholder="What does your business do? What makes you special?" />
        
        <div className="grid sm:grid-cols-2 gap-x-6">
             <FormSelect id="currentWebsite" name="currentWebsite" label="Do you have a current website?" value={formData.currentWebsite as string} onChange={handleInputChange}>
                <option value="no">No, I'm just starting out</option>
                <option value="outdated">Yes, but it's old/outdated</option>
                <option value="social">I only have social media pages</option>
                <option value="basic">Yes, but it needs improvement</option>
            </FormSelect>
             <FormSelect id="urgency" name="urgency" label="How quickly do you need this?" value={formData.urgency as string} onChange={handleInputChange}>
                <option value="asap">ASAP - I need customers now!</option>
                <option value="week">Within a week or two</option>
                <option value="month">Within the next month</option>
                <option value="exploring">Just exploring my options</option>
            </FormSelect>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What features do you need on your homepage?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Contact Info', 'Opening Hours', 'Services/Products', 'About Section', 'Photo Gallery', 'Testimonials', 'Location/Map', 'Social Links', 'Hero Section', 'Features & Benefits', 'Inspiration Link(s)', 'Old Website Link', 'Any Relevant Info'].map(feature => {
                    const featureId = feature.toLowerCase().replace(/[\s\/\(\)]/g, '');
                    const isChecked = features.includes(featureId);
                    return (
                         <label key={featureId} htmlFor={featureId} className={`group flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${isChecked ? 'bg-gray-900 dark:bg-white border-black dark:border-white' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                            <input type="checkbox" id={featureId} name="features" value={featureId} checked={isChecked} onChange={handleCheckboxChange} className="sr-only" />
                            <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${isChecked ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-500 group-hover:border-gray-500 dark:group-hover:border-gray-400'}`}>
                                {isChecked && (
                                    <svg className="w-4 h-4 text-white dark:text-black transform transition-transform duration-200 scale-0 group-[]:scale-100" style={{ transform: isChecked ? 'scale(1)' : 'scale(0)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${isChecked ? 'text-white dark:text-black' : 'text-gray-800 dark:text-gray-300'}`}>{feature}</span>
                        </label>
                    )
                })}
            </div>
        </div>

        {/* Conditionally rendered detail sections based on checkbox selection */}
        <DetailSection isVisible={features.includes('herosection')}>
            <FormTextarea id="heroSectionInfo" name="heroSectionInfo" label="Hero Section Details" value={formData.heroSectionInfo as string} onChange={handleInputChange} placeholder="What is the main headline or message you want to convey? e.g., 'Artisanal Coffee in the Heart of Sandton'" />
        </DetailSection>

        <DetailSection isVisible={features.includes('featuresbenefits')}>
            <FormTextarea id="featuresBenefitsInfo" name="featuresBenefitsInfo" label="Features & Benefits" value={formData.featuresBenefitsInfo as string} onChange={handleInputChange} rows={4} placeholder="List 3-4 key features or benefits of your product/service. e.g., '✓ Ethically Sourced Beans, ✓ Expert Baristas, ✓ Free Wi-Fi'" />
        </DetailSection>

        <DetailSection isVisible={features.includes('inspirationlinks')}>
            <FormTextarea id="inspirationLinks" name="inspirationLinks" label="Inspiration Link(s)" value={formData.inspirationLinks as string} onChange={handleInputChange} placeholder="Please provide links to 1-3 websites you like the look and feel of." />
        </DetailSection>

        <DetailSection isVisible={features.includes('oldwebsitelink')}>
            <FormInput id="oldWebsiteLink" name="oldWebsiteLink" label="Old Website Link" value={formData.oldWebsiteLink as string} onChange={handleInputChange} placeholder="https://www.myoldsite.co.za" />
        </DetailSection>
        
        <DetailSection isVisible={features.includes('contactinfo')}>
            <FormTextarea id="contactInfo" name="contactInfo" label="Contact Details" value={formData.contactInfo as string} onChange={handleInputChange} placeholder="Phone: 011 123 4567&#10;Email: info@yourbusiness.com&#10;Address: 123 Main Road, Sandton" />
        </DetailSection>

        <DetailSection isVisible={features.includes('openinghours')}>
            <FormTextarea id="openingHours" name="openingHours" label="Opening Hours" value={formData.openingHours as string} onChange={handleInputChange} placeholder="Mon - Fri: 9AM - 6PM&#10;Saturday: 9AM - 2PM" />
        </DetailSection>

        <DetailSection isVisible={features.includes('servicesproducts')}>
            <FormTextarea id="servicesList" name="servicesList" label="Your Services/Products" value={formData.servicesList as string} onChange={handleInputChange} rows={5} placeholder="• Website Design - R2,500&#10;• Logo Design - R800" />
        </DetailSection>

        <DetailSection isVisible={features.includes('aboutsection')}>
            <FormTextarea id="aboutContent" name="aboutContent" label="About Your Business" value={formData.aboutContent as string} onChange={handleInputChange} rows={4} placeholder="Tell your story: How long in business, what makes you special, your mission, etc." />
        </DetailSection>

        <DetailSection isVisible={features.includes('photogallery')}>
            <FormTextarea id="photoInfo" name="photoInfo" label="Photo/Video Gallery Details" value={formData.photoInfo as string} onChange={handleInputChange} placeholder="Do you have photos/videos? Describe them or provide a link (e.g., Google Drive, Dropbox)." />
        </DetailSection>

        <DetailSection isVisible={features.includes('testimonials')}>
            <FormTextarea id="customerTestimonials" name="customerTestimonials" label="Customer Testimonials" value={formData.customerTestimonials as string} onChange={handleInputChange} rows={4} placeholder="Please provide 1-3 customer testimonials, including their name. e.g., 'Great service!' - John D." />
        </DetailSection>

        <DetailSection isVisible={features.includes('locationmap')}>
            <FormInput id="exactAddress" name="exactAddress" label="Exact Address for Map" value={formData.exactAddress as string} onChange={handleInputChange} placeholder="123 Main Street, Sandton, Johannesburg, 2196" />
        </DetailSection>

        <DetailSection isVisible={features.includes('sociallinks')}>
            <FormTextarea id="socialLinks" name="socialLinks" label="Social Media Links" value={formData.socialLinks as string} onChange={handleInputChange} placeholder="Facebook: https://facebook.com/yourpage&#10;Instagram: @yourhandle" />
        </DetailSection>

        <DetailSection isVisible={features.includes('anyrelevantinfo')}>
            <FormTextarea id="anyRelevantInfo" name="anyRelevantInfo" label="Any Other Relevant Information" value={formData.anyRelevantInfo as string} onChange={handleInputChange} placeholder="Is there anything else I should know? Specific colors, fonts, logos, target audience, etc." />
        </DetailSection>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full group inline-block bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold py-4 px-10 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                    </>
                ) : (
                    <>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">🚀</span>
                        <span className="ml-2">Get My Free Homepage</span>
                    </>
                )}
            </button>
        </div>
      </form>
    </section>
  );
};

export default LeadForm;