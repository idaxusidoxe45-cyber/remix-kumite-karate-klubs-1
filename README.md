# Kumite Karate Klubs (Rīga)

Modern, fast, cross-platform web application for **Kumite Karate Klubs** in Riga, Latvia. Features pre-rendered SSG pages, dynamic training schedules, coach showcase, progressive photo gallery, online trial applications, review moderation, and a protected admin CMS (`/admin`).

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 6 (SSR / SSG prerendered routes)
- **Routing:** React Router DOM 7
- **Styling & Typography:** Tailwind CSS 4 + self-hosted Variable WOFF2 fonts (`Montserrat` & `Plus Jakarta Sans`)
- **Animations:** Pure GPU CSS Scroll-Driven Animations + `IntersectionObserver` / `rAF` fallbacks for iOS/Android
- **Icons:** Lucide React
- **Backend & APIs:** Vercel Serverless Functions + Upstash Redis KV + optional server-side notification hooks (Email / Bot)

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Typecheck:**
   ```bash
   npm run lint
   ```

4. **Production SSG build:**
   ```bash
   npm run build
   ```

## Admin Panel (`/admin`)

Configure `ADMIN_PASSWORD` and Upstash Redis (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) in Vercel Project Environment Variables (see `.env.example`).
