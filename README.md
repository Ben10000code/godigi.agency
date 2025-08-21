# godigi.agency - Free Homepage Lead Generation Site

This project is a modern, high-converting lead generation landing page for godigi.agency. It's built with React and Tailwind CSS to be fast, responsive, and easy to maintain.

The primary strategy is to offer a high-value, risk-free "Free Homepage" to attract small business clients, build trust, and then upsell to full website packages.

The website content is managed entirely through **Airtable**, acting as a headless CMS. This allows for instant content updates without changing any code.

---

## 🚀 How to Deploy & Manage Content with Airtable

To get this site running, you need to set up an Airtable base and configure your deployment environment (e.g., Vercel) with the correct API keys.

### **Step 1: Set Up Your Airtable Base**

1.  **Create an Airtable Account:** If you don't have one, sign up at [airtable.com](https://airtable.com).
2.  **Create a New Base:** Start a new base from scratch.
3.  **Create the Required Tables:** You must create the following tables with the exact names and fields specified below. The field type in Airtable is shown in parentheses.

---

#### **Table 1: `SiteSettings`**
*This table should have exactly one record.*
- `key` (Single line text) - The primary field. Enter `settings`.
- `backgroundPattern` (Single select) - Options: `crosses`, `dots`, `none`.
- `brandColor` (Single line text) - Enter a hex color code, e.g., `#8AF003`.

---

#### **Table 2: `PageContent`**
*This table should have exactly one record.*
- `key` (Single line text) - The primary field. Enter `main`.
- `portfolioTitle` (Single line text) - e.g., `A Glimpse of My Work`
- `pricingTitle` (Single line text) - e.g., `Simple, Transparent Pricing`
- `pricingSubtitle` (Long text) - e.g., `Start with a free homepage, then choose a plan...`
- `testimonialsTitle` (Single line text) - e.g., `Hear From My Happy Clients`
- `faqTitle` (Single line text) - e.g., `Frequently Asked Questions`
- `faqSubtitle` (Long text) - e.g., `Have questions? I've got answers...`

---

#### **Table 3: `PortfolioImages`**
*Each record is one image in the portfolio marquee.*
- `url` (URL) - The primary field. Paste the direct URL to your image.
- `order` (Number) - A number to set the display order (e.g., 1, 2, 3...).

---

#### **Table 4: `PricingPlans`**
*Each record is a pricing card.*
- `name` (Single line text) - The primary field (e.g., `🚀 STARTER SITE`).
- `price` (Single line text) - e.g., `R1,500 - R2,500`.
- `features` (Long text) - List each feature on a new line.
- `notIncluded` (Long text) - List each item on a new line.
- `isFeatured` (Checkbox) - Check this for the recommended plan.
- `value` (Single line text) - A value for the form (e.g., `free`, `1500-2500`).
- `order` (Number) - The display order for the plans.

---

#### **Table 5: `Testimonials`**
*Each record is a client testimonial.*
- `author` (Single line text) - The primary field. The person's name.
- `quote` (Long text) - The full quote.
- `location` (Single line text) - e.g., `Ndlovu's Fine Meats, Soweto`.
- `order` (Number) - The display order.

---

#### **Table 6: `FAQ`**
*Each record is one question-and-answer pair.*
- `question` (Single line text) - The primary field. The full question.
- `answer` (Long text) - The full answer.
- `order` (Number) - The display order.

---

#### **Table 7: `Contact`**
*This table should have exactly one record.*
- `key` (Single line text) - The primary field. Enter `contactInfo`.
- `title` (Single line text) - e.g., `Get in Touch`.
- `subtitle` (Long text)
- `email` (Email)
- `secondaryEmail` (Email) - *Optional*.
- `phone` (Phone number)
- `whatsappNumber` (Single line text) - Numbers only, with country code. e.g., `27734422054`.
- `whatsappPrefill` (Single line text) - The default message for WhatsApp.
- `hoursLine1` (Single line text) - Supports `<strong>` tags for bold text.
- `hoursLine2` (Single line text)
- `hoursLine3` (Single line text)

---

### **Step 2: Get Your Airtable Credentials**

1.  **Find your Base ID:**
    - Go to [airtable.com/api](https://airtable.com/api).
    - Select the base you just created.
    - The Base ID starts with `app...` and is shown in the introduction section.

2.  **Generate a Personal Access Token (API Key):**
    - Go to your Airtable [developer hub](https://airtable.com/create/tokens).
    - Click "Create new token".
    - **Name:** Give it a name like "Godigi Agency Website".
    - **Scopes:** Add the `data.records:read` scope. This is crucial for security, as it only allows reading data.
    - **Access:** Select the base you created.
    - Click "Create token" and copy the key. **Save it somewhere safe.**

### **Step 3: Deploy to Vercel (or similar)**

1.  Push the project code to a GitHub/GitLab repository.
2.  Create a new project on Vercel and import the repository.
3.  **Add Environment Variables:**
    - In your Vercel project settings, go to "Environment Variables".
    - Add two variables:
      - `AIRTABLE_BASE_ID`: Paste the Base ID you copied.
      - `AIRTABLE_API_KEY`: Paste the Personal Access Token you created.
4.  Deploy! Your website should now be live and fetching content directly from your Airtable base.

### **Important: Image Optimization for Speed**

Before adding images to Airtable, **compress them**. Large images are the biggest cause of slow websites.

1.  **Compress:** Use a free online tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to reduce file size.
2.  **Resize:** Resize images to be close to their final display size (e.g., 800px wide for portfolio images).

---

### **Dark Mode**

This website includes a full Dark Mode feature. It will respect the user's OS setting, and a toggle button is in the footer for manual control. The user's preference is saved in their browser.
