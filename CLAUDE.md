# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint checks
npm start        # Start production server
```

No test suite is configured — verify changes by running the dev server.

## Architecture

**Swyze** is an AI-powered carousel generator SaaS built with Next.js 16 (App Router), TypeScript, Supabase, and Groq AI.

### Core Data Flow

1. User submits a topic prompt on the dashboard or landing page
2. Request hits `/api/carousel/generate/route.ts` — calls Groq (LLaMA 3.1 8B) with a structured system prompt
3. AI returns JSON array of slides; the response is parsed and stored in Supabase via `lib/supabase/carousels.ts`
4. `/dashboard/editor/[id]/page.tsx` loads the carousel for editing — renders slides using `components/swyze/slide-layouts.tsx`
5. User exports slides as PNG (via `html-to-image`) or ZIP (via `jszip` + `file-saver`)

### Key Directories

- `app/api/carousel/generate/` — AI generation endpoint (Groq integration)
- `app/dashboard/editor/[id]/` — The main carousel editor (most complex page; handles slide editing, layout selection, color/font customization, undo/redo, and export)
- `app/auth/` — Login, signup, forgot-password, OAuth callback
- `app/onboarding/` — Brand color and brand import onboarding steps
- `lib/supabase/` — All database access: `carousels.ts`, `profiles.ts`, `brand-kits.ts`
- `lib/ai-provider.ts` — Groq client initialization
- `components/swyze/` — App-specific components (slide renderer, sidebar, feedback modal)
- `components/ui/` — ~60 Shadcn/ui components (Radix UI + Tailwind)

### Slide Layouts

`components/swyze/slide-layouts.tsx` renders all slides. There are 6 layout types: `hero`, `centered`, `split`, `quote`, `stats`, `cta`. Each layout accepts a slide data object with `headline`, `body`, `icon`, colors, font, and aspect ratio.

### Auth & Middleware

`middleware.ts` protects routes using Supabase Auth. Unauthenticated users hitting `/dashboard/*` or `/onboarding/*` are redirected to `/auth/login`. After login, users are redirected back via the `next` query param.

### Supabase Usage

- Browser client: `lib/supabase/client.ts`
- Server client (for Server Components / API routes): `lib/supabase/server.ts`
- All DB operations are in `lib/supabase/*.ts` — import from there, not inline

### Environment Variables

Required in `.env.local`:
- `GROQ_API_KEY` — Groq AI for carousel generation
- `GOOGLE_GENERATIVE_AI_API_KEY` — Google AI (configured but secondary)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side Supabase admin access

## Tech Stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript 5.7
- **Styling:** Tailwind CSS v4 + Shadcn/ui (style: `new-york`) + Radix UI
- **Database/Auth:** Supabase (PostgreSQL + Supabase Auth with Google OAuth)
- **AI:** Groq API (primary), Google Generative AI (secondary)
- **Export:** `html-to-image`, `jszip`, `file-saver`
- **Analytics:** Vercel Analytics

## Design System

CSS variables are defined in `app/globals.css`. Key tokens:
- Primary: Cyan `#00D4FF`
- Background surfaces: `#131313`, `#262626`
- Accent: Gold `#FEB528`
- Heading font: Sora; Body font: Plus Jakarta Sans
- Path alias: `@/*` resolves to the repo root
