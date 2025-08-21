// This is a Vercel Edge Function that acts as a secure proxy to the Airtable API.
// It fetches all necessary data from multiple tables, transforms it, and sends it
// to the frontend in a single request. This keeps API keys off the client-side.

export const config = {
    runtime: 'edge',
};

// Helper to fetch and parse a single table from Airtable.
// This runs on the server, not the browser.
const fetchAirtableTable = async (tableName: string, baseId: string, apiKey: string) => {
    // We add sorting parameters to ensure content is ordered correctly based on the 'order' field in Airtable.
    const sortParam = 'sort%5B0%5D%5Bfield%5D=order&sort%5B0%5D%5Bdirection%5D=asc';
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?${sortParam}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!res.ok) {
        // Log the detailed error from Airtable for better debugging
        const errorBody = await res.text();
        console.error(`Airtable fetch error for table ${tableName}: ${res.status} ${res.statusText}`, errorBody);
        throw new Error(`Failed to fetch ${tableName}`);
    }
    const data = await res.json();
    // We only need the 'fields' object from each record.
    return data.records.map((rec: any) => rec.fields);
};

export default async function handler(request: Request) {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    // A critical check to ensure the server environment is configured correctly.
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        return new Response(
            JSON.stringify({ error: "Server configuration error: Airtable environment variables not set." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    try {
        const tableNames = ['SiteSettings', 'PageContent', 'PortfolioImages', 'PricingPlans', 'Testimonials', 'FAQ', 'Contact'];
        
        // Fetch all tables in parallel for maximum efficiency.
        const [
            siteSettingsRecs, pageContentRecs, portfolioImagesRecs, pricingPlansRecs,
            testimonialsRecs, faqRecs, contactRecs
        ] = await Promise.all(tableNames.map(table => fetchAirtableTable(table, AIRTABLE_BASE_ID, AIRTABLE_API_KEY)));

        // Extract the single records from tables that are expected to have only one row.
        const siteSettings = siteSettingsRecs[0];
        const pageContent = pageContentRecs[0];
        const contactDetails = contactRecs[0];

        // This transformation logic mirrors the original client-side logic.
        // It prepares the data in the exact structure the frontend expects.
        const formattedContent = {
            siteSettings: {
                backgroundPattern: siteSettings.backgroundPattern,
                brandColor: siteSettings.brandColor,
            },
            portfolioMarquee: {
                title: pageContent.portfolioTitle,
                images: portfolioImagesRecs.map((rec: any) => rec.url),
            },
            pricing: {
                title: pageContent.pricingTitle,
                subtitle: pageContent.pricingSubtitle,
                plans: pricingPlansRecs.map((plan: any) => ({
                    ...plan,
                    features: plan.features ? plan.features.split('\n').filter(Boolean) : [],
                    notIncluded: plan.notIncluded ? plan.notIncluded.split('\n').filter(Boolean) : [],
                })),
                testimonials: {
                    title: pageContent.testimonialsTitle,
                    items: testimonialsRecs,
                },
            },
            faq: {
                title: pageContent.faqTitle,
                subtitle: pageContent.faqSubtitle,
                items: faqRecs,
            },
            contact: {
                title: contactDetails.title,
                subtitle: contactDetails.subtitle,
                email: contactDetails.email,
                secondaryEmail: contactDetails.secondaryEmail,
                phone: contactDetails.phone,
                whatsappNumber: contactDetails.whatsappNumber,
                whatsappPrefill: contactDetails.whatsappPrefill,
                hours: {
                    line1: contactDetails.hoursLine1,
                    line2: contactDetails.hoursLine2,
                    line3: contactDetails.hoursLine3,
                },
            },
        };

        // Send the complete, formatted content to the client.
        return new Response(JSON.stringify(formattedContent), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Add caching headers to improve performance and reduce Airtable API calls.
                // Vercel will cache this response at the edge for 60 seconds.
                'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            },
        });

    } catch (error) {
        console.error("Airtable proxy function error:", error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "An unknown internal server error occurred." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
