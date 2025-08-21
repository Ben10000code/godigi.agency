// This is a Vercel Edge Function that acts as a secure proxy to the Airtable API.
// It fetches all necessary data from multiple tables, transforms it, and sends it
// to the frontend in a single request. This keeps API keys off the client-side.

export const config = {
    runtime: 'edge',
};

// Helper to fetch and parse a single table from Airtable.
// Now includes optional sorting and improved error reporting.
const fetchAirtableTable = async (tableName: string, baseId: string, apiKey: string, sort: boolean = false) => {
    let url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    if (sort) {
        // Add sorting parameters to ensure content is ordered correctly based on the 'order' field in Airtable.
        url += '?sort%5B0%5D%5Bfield%5D=order&sort%5B0%5D%5Bdirection%5D=asc';
    }
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: { message: `Airtable returned a non-JSON error: ${res.statusText}` } }));
        const airtableErrorMessage = errorBody?.error?.message || errorBody?.error || `HTTP ${res.status} ${res.statusText}`;
        console.error(`Airtable fetch error for table ${tableName}: ${airtableErrorMessage}`);
        // This more detailed error message will be passed to the frontend.
        throw new Error(`Failed to fetch '${tableName}'. Reason: ${airtableErrorMessage}`);
    }
    const data = await res.json();
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
        // Fetch all tables in parallel, specifying which ones need to be sorted by the 'order' field.
        const [
            siteSettingsRecs, pageContentRecs, portfolioImagesRecs, pricingPlansRecs,
            testimonialsRecs, faqRecs, contactRecs
        ] = await Promise.all([
            fetchAirtableTable('SiteSettings', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, false),
            fetchAirtableTable('PageContent', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, false),
            fetchAirtableTable('PortfolioImages', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, true),
            fetchAirtableTable('PricingPlans', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, true),
            fetchAirtableTable('Testimonials', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, true),
            fetchAirtableTable('FAQ', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, true),
            fetchAirtableTable('Contact', AIRTABLE_BASE_ID, AIRTABLE_API_KEY, false),
        ]);

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
