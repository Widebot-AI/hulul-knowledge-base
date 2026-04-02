# Hulul Knowledge Base

Interactive wireframe/prototype for the Knowledge Base feature within the Hulul platform. Built with Lovable. No backend — all data is mock/simulated. Covers all scenarios from US-001 through US-012.

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
  pages/Index.tsx              # Entry — KBProvider + screen routing + dev drawer wiring
  components/
    wireframes/                # All app screens and logic
      KBContext.tsx             # State machine — phases, overlay flags, counters, scripted sequences
      translations.ts          # i18n — bilingual EN/AR, ~360 translation keys
      AppShell.tsx             # Layout shell — header, sidebar, bottom nav, dev drawer, retention sim
      KBMainInterface.tsx      # 3-column layout: SourcePanel | ChatPanel | CitationPanel
      ChatPanel.tsx            # Chat UI — streaming, error states, session warnings, reset
      CitationPanel.tsx        # Citation detail panel (3rd column, no overlap)
      SourcePanel.tsx          # Source list — status badges, selection, deletion states, tags
      WarningBanner.tsx        # Workspace warning banners — quota, storage, filecount, retention
      ActivationScreen.tsx     # Activation gate with CTA button (variant: default | error)
      AddSourceModal.tsx       # File upload / URL add with tag input + validation
      DeleteConfirmDialog.tsx  # Source deletion confirmation
      SourcePreviewPanel.tsx   # Source preview sheet
      StackSettingsScreen.tsx  # AI stack config (variant: default | read-only | custom-prompt | disable-warning | no-fallback)
      TokenReportingScreen.tsx # Usage/billing (variant: normal | empty | error)
      RetentionWarningScreen.tsx # Retention warnings (8 variants incl. reactivation)
      # Corner case screens (14 new components, static snapshots for dev drawer):
      UploadValidationScreen.tsx    # 6 upload validation error variants
      UploadPipelineScreen.tsx      # 4 upload pipeline state variants
      StoreCapacityScreen.tsx       # Store exhaustion error
      PlanLimitWarningsScreen.tsx   # 8 plan limit warning variants
      SourceSelectionScreen.tsx     # 3 selection edge case variants
      PlanDataLoadingScreen.tsx     # 2 plan data loading variants
      DeletionStatesScreen.tsx      # 4 deletion state variants
      ChatErrorStatesScreen.tsx     # 4 chat error variants
      TokenQuotaScreen.tsx          # 2 token quota variants
      CitationEdgeCasesScreen.tsx   # 2 citation edge case variants
      UploadTaggingScreen.tsx       # 4 tagging variants
      UrlIngestionScreen.tsx        # 10 URL ingestion variants
      SourcePreviewStatesScreen.tsx # 6 preview state variants
      ChannelQueryStatesScreen.tsx  # 3 channel query variants
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

## State Machine (KBContext)

### Base Phases (mutually exclusive)
`activation | activation-error | no-access | empty | active | archived`

### Overlay Flags (composable on `active` phase)
12 boolean flags in `flags` object: `quotaWarning`, `quotaDepleted`, `sessionWarning`, `sessionCeiling`, `streaming`, `streamInterrupted`, `aiError`, `sessionCreateFail`, `resetFailed`, `deletionFailed`, `retentionWarning`, `retentionFinal`

### Scripted Sequences (driven by counters)
The prototype uses deterministic scripted sequences so reviewers get a predictable walkthrough:

**Chat sequence** (`messageCount`):
1. Message 1 → Normal response + quota warning banner (workspace quota crosses 80%)
2. Message 2 → Normal response + "chat getting long" session warning (session crosses 80%)
3. Message 3 → Stream interrupts at 60% → partial text + error + Retry button
4. Retry → Full response → quota depleted + session ceiling → chat disabled

**Upload sequence** (`uploadCount`):
1-2. Normal pipeline (uploading → pending → indexing → ready)
3. Pipeline fails at indexing → retry available → succeeds on retry

**Deletion sequence** (`deleteCount`):
1. Success — source removed
2. Fails — toast shown, source unchanged, next delete succeeds
3. Partial — source enters `pending_cleanup`, retry counter, locks after 3 retries

**Reset sequence** (`resetAttemptRef`):
1. Success — clears chat and session (not workspace quota)
2. Fails — error dialog with "Retry Reset"
3. Retry succeeds — clears everything

**Retention simulation** (via dev drawer "Simulate Retention Countdown"):
- Immediately: retention warning banner
- After 10s: escalates to final reminder
- After 20s: all sources archived, chat disabled
- Sending a message cancels retention

## Dev Drawer

60+ screen entries across 11 groups accessible via the `</>` icon in the header. Groups: Onboarding, Main Interface, Upload & Validation, Source Panel, Deletion, Chat & Session, Tagging, URL Ingestion, Preview, Settings, Token Reporting, Data Retention. Plus a "Simulate Retention Countdown" button.

## Key Patterns

- **State**: State machine in `KBContext` with base phases + overlay flags + counters. Access via `useKB()` hook.
- **Translations**: Custom `t(key, lang)` function in `translations.ts`. Two languages: `"en"` | `"ar"`. Arabic triggers RTL. ~360 keys covering all screens and error states.
- **Theming**: Light/dark via `.dark` class on `<html>`. CSS variables in `src/index.css`. WCAG AAA contrast on warning/error banners using explicit amber/red Tailwind colors.
- **3-Column Layout**: Sources (25%) | Chat (50%) | Citation Panel (25%) when citation is open. Smooth transition. Mobile uses bottom sheets.
- **Warning Banners**: `WarningBanner` component at top of KBMainInterface. Priority: retentionFinal > quotaDepleted > retentionWarning > quotaWarning. 80% = dismissable yellow, 100% = non-dismissable red.
- **Tag Input**: Collapsible tag section in AddSourceModal (both File and URL tabs). Max 10 tags, no duplicate keys, immutability notice.
- **Dev drawer**: Code2 icon in header opens sheet with all wireframe screens organized by group. Static snapshots for design review.
- **Path alias**: `@` maps to `src/` (configured in vite.config.ts, tsconfig.json, components.json).
- **Mobile responsive**: `useIsMobile()` hook. Mobile shows bottom nav + bottom sheets instead of sidebar.

## Gotchas

- `components/ui/` contains auto-generated shadcn components — add new ones via `npx shadcn-ui@latest add <component>`, don't manually create files there.
- `lovable-tagger` plugin runs only in dev mode for Lovable's component tagging — safe to ignore.
- TypeScript is lenient: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedVars: off` in ESLint.
- `bun.lock` and `bun.lockb` exist alongside `package-lock.json` — project supports both npm and bun.
- The `Screen` type in `pages/Index.tsx` controls which wireframe screens are available. Phase casting (`as any`, `as string`) is used intentionally for dev-only screen routing.
- No backend, no API calls, no environment variables needed. Everything is client-side mock data.
- Scripted sequences use `useRef` for synchronous counter access alongside `useState` for React updates.
- `retrySource` handles failed → indexing → ready. `retryCleanup` handles pending_cleanup retry with lock after 3 attempts.
- Warning banner colors use explicit `text-amber-950 dark:text-amber-100` / `text-red-950 dark:text-red-100` for WCAG AAA compliance — don't use `text-warning` or `text-destructive` on banners.

## Code Style

- Functional components only, no class components
- shadcn/ui conventions: `cn()` for conditional classes, `variant` props
- Tailwind utility classes inline (no CSS modules)
- Translation keys follow dot notation: `"section.action"` (e.g., `"sources.add"`, `"chat.reset"`)
- New screen components accept a `variant` prop with typed union
