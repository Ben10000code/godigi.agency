# godigi.agency - Free Homepage Lead Generation Site

This project is a modern, high-converting lead generation landing page for godigi.agency. It's built with React and Tailwind CSS to be fast, responsive, and easy to maintain.

The primary strategy is to offer a high-value, risk-free "Free Homepage" to attract small business clients, build trust, and then upsell to full website packages.

The website content is managed entirely through **Airtable**, acting as a headless CMS. This allows for instant content updates without changing any code.

---

## 🚀 How to Deploy & Manage Content with Airtable

To get this site running, you need to set up an Airtable base and configure your deployment environment (e.g., Vercel) with the correct API keys.

### **Step 1: Set Up Your Airtable Base (The Easy Way)**

The fastest way to set up your base is to import the provided CSV files. This will automatically create all the necessary tables and fields for you.

1.  **Create an Airtable Account:** If you don't have one, sign up at [airtable.com](https://airtable.com).
2.  **Create a New Base:** From your dashboard, click "Add a base" and choose "Start from scratch".
3.  **Import CSV Files:**
    - In your new base, click the `+` icon next to your first table tab, then select "Import data".
    - Choose "CSV file".
    - Upload the `SiteSettings.csv` file from the `airtable_csv` directory in this project.
    - Airtable will preview the data. Click **"Import"**. This will create your first table.
    - **Repeat this process for all 7 CSV files** in the `airtable_csv` directory:
        - `PageContent.csv`
        - `PortfolioImages.csv`
        - `PricingPlans.csv`
        - `Testimonials.csv`
        - `FAQ.csv`
        - `Contact.csv`
4.  **Verify Field Types (Important!):** After importing, quickly check a few key fields to ensure Airtable assigned the correct type.
    - In `PricingPlans`, make sure the `isFeatured` field is a **Checkbox**.
    - In `SiteSettings`, make sure the `backgroundPattern` field is **Single select** (with options: `crosses`, `dots`, `none`).
    - If a type is wrong, click the dropdown arrow next to the field name, select "Edit field", and change its type.

Your base is now set up! Proceed to Step 2.

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

---

### **Important: Image Optimization for Speed**

Before adding images to Airtable, **compress them**. Large images are the biggest cause of slow websites.

1.  **Compress:** Use a free online tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to reduce file size.
2.  **Resize:** Resize images to be close to their final display size (e.g., 800px wide for portfolio images).

### **Dark Mode**

This website includes a full Dark Mode feature. It will respect the user's OS setting, and a toggle button is in the footer for manual control. The user's preference is saved in their browser.
