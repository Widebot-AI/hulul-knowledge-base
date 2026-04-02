# Hulul Knowledge Base

Interactive wireframe/prototype for the Knowledge Base feature within the Hulul platform. Built with Lovable. No backend — all data is mock/simulated.

## Commands

```bash
npm run dev        # Dev server on http://localhost:8080
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest (watch mode)
npm run preview    # Preview production build
```

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5** (SWC plugin)
- **Tailwind CSS 3** with CSS variables for theming
- **shadcn/ui** (default style, `@/components/ui/`) + Radix primitives
- **React Router v6** (single route at `/`, catch-all `*` for 404)
- **TanStack React Query** (configured but unused — no real API calls)
- **Lucide React** for icons
- Font: **Rubik** (loaded via Google Fonts in `index.html`)

## Architecture

```
src/
  pages/Index.tsx              # Entry — KBProvider + screen routing
  components/
    wireframes/                # All app screens and logic
      KBContext.tsx             # Central state (React Context) — sources, chat, modals, theme, language
      translations.ts          # i18n — bilingual EN/AR translation map + t() helper
      AppShell.tsx             # Layout shell — header, sidebar, bottom nav, dev drawer
      KBMainInterface.tsx      # Split layout: SourcePanel (30%) + ChatPanel
      ChatPanel.tsx            # Chat UI with simulated streaming responses
      SourcePanel.tsx          # Source list with status badges, selection, actions
      ActivationScreen.tsx     # First-time activation with drag-and-drop
      AddSourceModal.tsx       # File upload / URL add dialog
      DeleteConfirmDialog.tsx  # Source deletion confirmation
      SourcePreviewPanel.tsx   # Source preview sheet
      StackSettingsScreen.tsx  # AI stack config screen
      TokenReportingScreen.tsx # Usage/billing screen
      RetentionWarningScreen.tsx # Data retention warnings
      WireframeNav.tsx         # Dev navigation
    search/                    # Global search overlay components
    ui/                        # shadcn/ui primitives (do not edit manually)
  hooks/
    useSearch.ts               # Search state: filtering, prefix modes (>, @, #), presets
    use-mobile.tsx             # Mobile breakpoint hook
  lib/
    search-data.ts             # Mock search data (contacts, conversations, actions)
    utils.ts                   # cn() helper (clsx + tailwind-merge)
  assets/                      # SVG logos (hulul-logo-en, hulul-logo-ar, hulul-logo-icon)
```

## Key Patterns

- **State**: All app state lives in `KBContext` (React Context). No Redux/Zustand. Access via `useKB()` hook.
- **Translations**: Custom `t(key, lang)` function in `translations.ts`. Two languages: `"en"` | `"ar"`. Arabic triggers RTL via `document.documentElement.dir`.
- **Theming**: Light/dark via `.dark` class on `<html>`. CSS variables defined in `src/index.css` under `:root` and `.dark`. Hulul brand colors: indigo primary, green accent.
- **Mock AI chat**: `sendMessage()` in KBContext cycles through hardcoded responses with simulated character-by-character streaming.
- **Source pipeline**: Sources go through simulated status transitions: `uploading -> pending -> indexing -> ready` (or `failed`). Timers in `KBProvider` useEffect.
- **Dev drawer**: Code2 icon in header opens a sheet to switch between wireframe screens (activation, no-access, settings, token reporting, retention variants). This is for design review, not user-facing.
- **Path alias**: `@` maps to `src/` (configured in vite.config.ts, tsconfig.json, and components.json).
- **Mobile responsive**: `useIsMobile()` hook. Mobile shows bottom nav + bottom sheets instead of sidebar.

## Gotchas

- `components/ui/` contains auto-generated shadcn components — add new ones via `npx shadcn-ui@latest add <component>`, don't manually create files there.
- `lovable-tagger` plugin runs only in dev mode for Lovable's component tagging — safe to ignore.
- TypeScript is lenient: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedVars: off` in ESLint.
- `bun.lock` and `bun.lockb` exist alongside `package-lock.json` — project supports both npm and bun.
- The `Screen` type in `pages/Index.tsx` controls which wireframe screens are available. Phase casting (`as any`, `as string`) is used intentionally for dev-only screen routing.
- No backend, no API calls, no environment variables needed. Everything is client-side mock data.

## Code Style

- Functional components only, no class components
- shadcn/ui conventions: `cn()` for conditional classes, `variant` props
- Tailwind utility classes inline (no CSS modules)
- Translation keys follow dot notation: `"section.action"` (e.g., `"sources.add"`, `"chat.reset"`)
