import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PricingStrategy from './components/PricingStrategy';
import LeadForm from './components/LeadForm';
import PortfolioMarquee from './components/PortfolioMarquee';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import BackToTopButton from './components/BackToTopButton';
import { Plan, SiteSettings, ContactDetails } from './types';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './components/IconComponents';

// Define a type for the structure of the content fetched from our API.
interface AppContent {
  siteSettings: SiteSettings;
  portfolioMarquee: {
    title: string;
    images: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    plans: Plan[];
    testimonials: {
      title: string;
      items: any[];
    }
  };
  faq: {
    title: string;
    subtitle: string;
    items: any[];
  };
  contact: ContactDetails;
}


type Theme = 'light' | 'dark' | 'system';

// A reusable component to animate elements when they scroll into view.
const AnimateOnScroll: React.FC<{children: React.ReactNode, delay?: string}> = ({ children, delay = '0s' }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(ref.current!);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{transitionDelay: delay}}
        >
            {children}
        </div>
    );
};


/**
 * The main application component.
 * It now fetches content from a secure serverless proxy and includes a full Dark Mode implementation.
 */
const App: React.FC = () => {
  const [content, setContent] = useState<AppContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [theme, setTheme] = useState<Theme>('system');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  /**
   * Effect to set the initial theme from local storage or system preference.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
  }, []);

  /**
   * Effect to apply the theme class to the HTML element and listen for system changes.
   */
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'system') {
            root.classList.toggle('dark', mediaQuery.matches);
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/airtable');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Catch if JSON parsing fails
          throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
        }
        
        const formattedContent: AppContent = await response.json();

        setContent(formattedContent);
        if (formattedContent.pricing?.plans?.length > 0) {
            // Sort plans by order before setting the default
            const sortedPlans = [...formattedContent.pricing.plans].sort((a, b) => (a.order || 0) - (b.order || 0));
            setSelectedPlan(sortedPlans[0]);
            // update content with sorted plans
            setContent(prevContent => prevContent ? {...prevContent, pricing: {...prevContent.pricing, plans: sortedPlans}} : null);
        }

      } catch (err) {
        console.error("Failed to fetch and parse content:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching content.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  /**
   * Effect to apply dynamic site settings like background and brand color.
   */
  useEffect(() => {
    if (content?.siteSettings) {
        const { backgroundPattern, brandColor } = content.siteSettings;

        // Apply background pattern
        const patterns: { [key: string]: { light: string, dark: string } } = {
          crosses: {
            light: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M10 10 L12 12 M10 12 L12 10 M30 30 L32 32 M30 32 L32 30' stroke='%23e5e7eb' stroke-width='1' stroke-linecap='round'/%3e%3c/svg%3e")`,
            dark: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M10 10 L12 12 M10 12 L12 10 M30 30 L32 32 M30 32 L32 30' stroke='%23374151' stroke-width='1' stroke-linecap='round'/%3e%3c/svg%3e")`
          },
          dots: {
            light: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='10' cy='10' r='1' fill='%23e5e7eb'/%3e%3c/svg%3e")`,
            dark: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='10' cy='10' r='1' fill='%23374151'/%3e%3c/svg%3e")`
          },
          none: { light: '', dark: '' }
        };
        const currentPattern = patterns[backgroundPattern] || patterns.none;
        const isDark = document.documentElement.classList.contains('dark');
        document.body.style.backgroundImage = isDark ? currentPattern.dark : currentPattern.light;

        // Apply brand color as a CSS variable
        document.documentElement.style.setProperty('--brand-color', brandColor);

        // Dynamically update the favicon color
        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        if (favicon) {
            const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${brandColor}' d='M50 0a50 50 0 00-50 50 50 50 0 0050 50 50 50 0 0050-50A50 50 0 0050 0zm0 8.33a41.67 41.67 0 0141.67 41.67 41.67 41.67 0 01-41.67 41.67A41.67 41.67 0 018.33 50 41.67 41.67 0 0150 8.33z'/><path fill='%231F2937' d='M50 16.67a33.33 33.33 0 00-33.33 33.33 33.33 33.33 0 0033.33 33.33 33.33 33.33 0 0033.33-33.33A33.33 33.33 0 0050 16.67zm0 8.33a25 25 0 0125 25 25 25 0 01-25 25 25 25 0 01-25-25 25 25 0 0125-25z'/><path fill='%23F9FAFB' d='M50 33.33a16.67 16.67 0 00-16.67 16.67 16.67 16.67 0 0016.67 16.67 16.67 16.67 0 0016.67-16.67A16.67 16.67 0 0050 33.33z'/></svg>`;
            favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
        }
    }
  }, [content, theme]);

  /**
   * Effect to handle the visibility of the "Back to Top" button.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    const formElement = document.getElementById('lead-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleHeaderCtaClick = () => {
    if (content?.pricing?.plans) {
        handlePlanSelect(content.pricing.plans[0]);
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <svg className="animate-spin h-8 w-8 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
  }

  if (error || !content) {
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">Failed to load website content.</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Please ensure your deployment configuration is correct and try again later.</p>
                {error && <pre className="mt-4 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm text-red-500 overflow-auto">{error}</pre>}
            </div>
        </div>
    );
  }

  const { portfolioMarquee, pricing, faq, contact } = content;

  return (
    <div className="text-gray-800 dark:text-gray-300 font-sans leading-relaxed transition-colors duration-300">
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 lg:space-y-28">
        
          <Header onCtaClick={handleHeaderCtaClick} />

          <AnimateOnScroll>
            <div id="portfolio-section">
                <PortfolioMarquee title={portfolioMarquee.title} images={portfolioMarquee.images} />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div id="pricing-section" className="w-full max-w-7xl mx-auto">
                <PricingStrategy 
                title={pricing.title}
                subtitle={pricing.subtitle}
                plans={pricing.plans} 
                testimonials={pricing.testimonials} 
                onPlanSelect={handlePlanSelect} 
                />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div id="lead-form" className="w-full max-w-7xl mx-auto">
                <LeadForm selectedPlan={selectedPlan} />
            </div>
          </AnimateOnScroll>
          
           <AnimateOnScroll>
                <div id="contact-section" className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-2">
                    <FAQ title={faq.title} subtitle={faq.subtitle} items={faq.items} />
                    </div>
                    <div className="lg:col-span-1">
                    <Contact details={contact} />
                    </div>
                </div>
           </AnimateOnScroll>
        </div>
      </main>

      <footer className="text-center py-10 mt-20 lg:mt-28 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <a href="/" className="inline-block text-xl tracking-tight text-black dark:text-white mb-4">
                <span className="font-extrabold">godigi</span><span className="font-normal text-gray-500 dark:text-gray-400">.agency</span>
            </a>
            <p>&copy; {new Date().getFullYear()} godigi.agency. All Rights Reserved.</p>
            <p className="mt-2 text-sm">Delivering digital excellence, one pixel at a time.</p>
            <div className="mt-6 flex justify-center">
                <button 
                    onClick={cycleTheme}
                    className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
                >
                    {theme === 'light' && <SunIcon className="w-5 h-5" />}
                    {theme === 'dark' && <MoonIcon className="w-5 h-5" />}
                    {theme === 'system' && <ComputerDesktopIcon className="w-5 h-5" />}
                    <span className="text-xs font-semibold capitalize">{theme}</span>
                </button>
            </div>
        </div>
      </footer>
      <BackToTopButton isVisible={showBackToTop} />
    </div>
  );
};

export default App;
