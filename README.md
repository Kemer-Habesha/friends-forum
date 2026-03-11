## Friends Forum Frontend

A Next.js 15 (App Router) frontend for the FRIENDS Forum platform, powered by Sanity CMS and Tailwind CSS.

### Getting started

```bash
cd friends-forum
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Available scripts

- **dev**: start the local development server.
- **build**: create a production build.
- **start**: run the production build.
- **lint**: run the linter.

### Tech stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, Radix UI primitives, shadcn-style components
- **Data**: Sanity CMS (`lib/sanity.ts`) with GROQ queries and in-memory caching
- **State / data fetching**: React Query (`@tanstack/react-query`)
- **Auth & UI**: Custom `AuthProvider`, auth modals, and various UI components in `components/`

### Project structure (frontend)

- **`app/`**: Next.js routes, layouts, and pages.
- **`components/`**: Shared UI and layout components (header, footer, modals, etc.).
- **`components/ui/`**: Reusable UI elements (cards, buttons, sections).
- **`lib/`**: Sanity client, GROQ queries, and prefetch helpers.
- **`public/`**: Static assets (favicons, placeholders, service worker).

### Environment variables

Create a `.env.local` in `friends-forum` and configure your Sanity project:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

Adjust keys to match your existing `sanity/env` setup if it differs.

### Production build

```bash
npm run build
npm start
```

Deploy the `friends-forum` directory to your preferred Next.js host (e.g. Vercel), ensuring all required environment variables are set there as well.

FRIENDS-Forum Website
