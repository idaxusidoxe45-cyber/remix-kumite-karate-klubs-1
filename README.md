# Kumite Karate Klubs (Rīga)

Modern, fast, interactive web application for **Kumite Karate Klubs** in Riga, Latvia. Features dynamic schedules, coaches showcase, photo gallery, online trial applications, review moderation system, and password-protected admin CMS.

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript + Vite 6
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS 4 + Custom Japanese Sumi-e design system
- **Animations:** Motion (Framer Motion) + Anime.js
- **Icons:** Lucide React
- **Backend & APIs:** Vercel Serverless Functions + Cloud DB (Upstash Redis) + Resend / Web3Forms email dispatcher
- **Content Management:** Decap CMS + Built-in React Admin Panel (`/admin`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Check TypeScript:**
   ```bash
   npm run lint
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

## Admin Panel Access

Access the admin dashboard directly on the website at `/admin`:
- **Default Username:** `admin`
- **Default Password:** `kumite2026` (configurable in settings)
