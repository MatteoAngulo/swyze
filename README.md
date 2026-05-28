# Swyze

**Carruseles con tu marca, en minutos.**

Swyze es un generador de carruseles para redes sociales impulsado por IA. Describe el tema, elige el número de slides y la plataforma, y Swyze genera un carrusel completo con tus colores y tipografías listo para publicar.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 + Shadcn/ui (Radix UI) |
| Base de datos / Auth | Supabase (PostgreSQL + Auth con Google OAuth) |
| IA | Groq API — LLaMA 3.1 8B |
| Exportación | html-to-image, JSZip, file-saver |
| Analytics | Vercel Analytics |

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- API key de [Groq](https://console.groq.com)

## Configuración local

1. Clona el repositorio e instala dependencias:

```bash
git clone <repo-url>
cd swyze
npm install
```

2. Crea `.env.local` en la raíz con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=   # opcional
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm start        # Servidor de producción
npm run lint     # Linting con ESLint
```

## Cómo funciona

1. El usuario describe el tema del carrusel y selecciona número de slides (3, 5, 7 o 10) y plataforma (Instagram, LinkedIn, TikTok).
2. La petición llega a `/api/carousel/generate` → se llama a Groq con un prompt de sistema estructurado.
3. El modelo devuelve un JSON con los slides; se guarda en Supabase y se redirige al editor.
4. En el editor (`/dashboard/editor/[id]`) el usuario puede editar textos, cambiar layout (hero, centered, split, quote, stats, cta), colores, tipografía y relación de aspecto (1:1 o 4:5).
5. Exporta los slides como PNG individuales o como archivo ZIP.

## Estructura del proyecto

```
app/
  api/carousel/generate/   # Endpoint de generación IA
  auth/                    # Login, signup, OAuth callback
  dashboard/
    editor/[id]/           # Editor de carruseles (página principal)
    brand-kit/             # Gestión del kit de marca
  onboarding/              # Flujo de onboarding (colores, importación)
  page.tsx                 # Landing page

components/
  swyze/                   # Componentes propios (slide-layouts, sidebar)
  ui/                      # Componentes Shadcn/ui

lib/
  ai-provider.ts           # Cliente Groq
  supabase/                # Clientes y operaciones CRUD (carousels, profiles, brand-kits)
```

## Autenticación

Las rutas `/dashboard/*` y `/onboarding/*` están protegidas por `middleware.ts` usando Supabase Auth. Los usuarios no autenticados son redirigidos a `/auth/login` con el parámetro `?next=` para retornarlos a su destino original.
