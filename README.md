# godigi.agency - Free Homepage Lead Generation Site

This project is a modern, high-converting lead generation landing page for godigi.agency. It's built with React and Tailwind CSS to be fast, responsive, and easy to maintain.

The primary strategy is to offer a high-value, risk-free "Free Homepage" to attract small business clients, build trust, and then upsell to full website packages.

## How to Update Website Content (The Easy Way)

This site is designed for incredibly simple updates. **Almost all website text, images, and settings are managed from a single file: `content.json`**.

To change any content on the website, you only need to open and edit `content.json`.

---

### **1. Updating Global Site Settings**

This section controls the overall look and feel of your site.

#### **Updating Your Brand Color**
- Find the `siteSettings` section at the top of `content.json`.
- Edit the value of the `brandColor` property.
- You can use any valid CSS hex color (e.g., `"#8AF003"`, `"#4F46E5"`, `"#ff5733"`).
- This one setting will change the color of the favicon, header pill, featured plan, loading spinner, and all accent icons.

#### **Changing the Background Pattern**
- Find the `siteSettings` section at the top of `content.json`.
- Edit the value of the `backgroundPattern` property.
- **Available Options:**
  - `"crosses"`: A subtle pattern of small 'x' marks.
  - `"dots"`: A subtle pattern of small dots.
  - `"none"`: A clean, solid background.

---

### **2. Updating Page Content**

The `content.json` file is organized into sections that match the sections of the website. Here's how to edit each part:

#### **Updating the Portfolio Images (Scrolling Section)**
- Find the `portfolioMarquee` section in `content.json`.
- Edit the `images` array. Each item in the array is a URL for an image that will appear in the scrolling showcase.
- You can add, remove, or change the image URLs in this list.

#### **Updating Pricing Plans**
- Find the `pricing` section, then the `plans` array.
- Each object is a pricing card. You can edit the `name`, `price`, `features`, and `notIncluded` lists.
- **Important:** The `value` property (e.g., "1500-2500") links the plan to the form's budget dropdown. It should match an option in the form.

#### **Updating Client Testimonials (Scrolling Section)**
- Find the `pricing` section, then the `testimonials` array.
- Each object is a quote in the scrolling marquee. Add, edit, or remove objects here.

#### **Updating the FAQ Section**
- Find the `faq` section, then the `items` array.
- Each object has a `question` and `answer`. Edit them here.

#### **Updating Contact Information**
- Find the `contact` section.
- You can directly edit the `title`, `subtitle`, `email`, and `phone` text.
- To update the **WhatsApp** button, edit the `whatsappNumber` and `whatsappPrefill` fields. The number should not contain spaces or symbols (e.g., `27734422054`).
- There is also an optional `secondaryEmail` field. If you add it, it will appear on the site. If you remove it, it will disappear automatically.
- The `hours` can also be edited here. You can use `<strong>` tags for bold text.

---

### **Dark Mode**

This website includes a full Dark Mode feature.
- It will automatically respect the user's operating system setting (Light or Dark).
- A toggle button is available in the footer for users to manually switch between Light, Dark, and System modes.
- The user's preference is saved in their browser, so it will be remembered on their next visit.

---

### **Important: Image Optimization for Speed**

Before adding images to `content.json`, it is **highly recommended** to optimize them. Large images are the biggest cause of slow websites.

1.  **Compress Your Images:** Use a free online tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to dramatically reduce the file size of your images without losing quality.
2.  **Use the Right Format:** Use `.jpg` for photographs and `.png` for graphics with transparency. Consider modern formats like `.webp` if you are comfortable with them.
3.  **Resize Your Images:** Don't upload a 4000px wide photo if it will only be displayed at 400px wide. Resize images to be close to their final display size.

This simple step will ensure your website remains fast and provides a great user experience.

---

## File Structure

Here is a brief overview of the key files in the project:

- `index.html`: The main HTML file and entry point for the app.
- `content.json`: **Your main content control panel.** All user-facing text and images are here.
- `index.tsx`: Mounts the React application.
- `App.tsx`: The main component that structures the page layout and passes content from `content.json` to other components.
- `types.ts`: Contains shared TypeScript type definitions for clean code.
- `/components`: This directory contains all the React components that make up the website. They are "presentational," meaning they just display the data they are given.
  - `Header.tsx`: The main hero section.
  - `PortfolioMarquee.tsx`: The scrolling portfolio image showcase.
  - `PricingStrategy.tsx`: The pricing grid and scrolling testimonials.
  - `LeadForm.tsx`: The main contact and lead generation form.
  - `FAQ.tsx`: The frequently asked questions section.
  - `Contact.tsx`: The "Get in Touch" card.
  - `IconComponents.tsx`: A library of SVG icons.
  - `BackToTopButton.tsx`: A button that appears on scroll to return the user to the top.

**Note on Accessibility:** This project includes accessibility enhancements, such as pausing animations for users who have `prefers-reduced-motion` enabled in their system settings.