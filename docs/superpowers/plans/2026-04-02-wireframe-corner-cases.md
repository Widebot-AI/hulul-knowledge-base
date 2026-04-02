# Wireframe Corner Cases — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all missing UI states from US-001 through US-012 to the prototype's dev drawer as grouped wireframe screens with variant selectors.

**Architecture:** New static snapshot components in `src/components/wireframes/`, each accepting a `variant` prop. Wired into the dev drawer via expanded `Screen` type and `screens` array in `pages/Index.tsx`. All new translation keys added to `translations.ts`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons

**Spec:** `docs/superpowers/specs/2026-04-02-wireframe-corner-cases-design.md`

---

## Dependency Graph

```
Task 1 (translations) ──┬──> Tasks 2-18 (components, all parallel) ──> Task 19 (wiring) ──> Task 20 (verify)
```

- Task 1 MUST complete before any component task
- Tasks 2-18 are fully independent and can run in parallel
- Task 19 depends on ALL component tasks (2-18)
- Task 20 depends on Task 19

---

## Task 1: Add All Translation Keys

**Files:**
- Modify: `src/components/wireframes/translations.ts`

- [ ] Add ~80 new translation keys (en + ar) for all new screens. Key groups:
  - `activation.error*` — activation error retry
  - `upload.val*` — validation errors (unsupported, too large, duplicate, storage cap, file limit, batch)
  - `upload.pipeline*` — pipeline states (single progress, batch, processing fail, first ready)
  - `upload.storeExhausted*` — store capacity error
  - `warn.*` — plan limit warnings (storage/filecount/token at 80% and 100%, multi-limit, quota restored)
  - `select.*` — selection edge cases (deselect blocked, auto-select, no ready)
  - `plan.*` — plan data loading (skeleton, stripe failure)
  - `delete.state*` — deletion states (blocked, failed, pending cleanup, locked)
  - `chatError.*` — chat errors (streaming interrupted already exists, ai error, session create fail, reset fail)
  - `quota.*` — token quota screens (mid-session, pre-session, upgrade prompt)
  - `citationEdge.*` — citation edge cases (deleted source, no grounding)
  - `tag.*` — tagging (add, limit reached, duplicate key, immutable notice, locked view)
  - `url.error.*` — URL ingestion errors (not found, blocked, no content, auth required, rate limited, timeout, service unavailable, too large, duplicate)
  - `previewState.*` — preview states (text preview, non-renderable, load failure, url preview, failed source)
  - `stack.variant.*` — stack settings new variants (custom prompt, disable confirm, no fallback)
  - `channel.*` — channel query states (no sources with context, no sources bare, quota depleted)
  - `retention.new.*` — retention new variants (renewed, activity resumed, reactivating, reactivation failed)
- [ ] Verify no TypeScript errors: `npx tsc --noEmit`
- [ ] Commit: "feat: add translation keys for all wireframe corner case screens"

---

## Task 2: ActivationScreen — Add Error Variant

**Files:**
- Modify: `src/components/wireframes/ActivationScreen.tsx`

- [ ] Add optional `variant` prop: `"default" | "error"`
- [ ] When `variant="error"`: show inline error below the CTA with retry button. Reuse existing layout, add error alert with `t("activation.errorMsg", lang)` and retry button.
- [ ] Default behavior unchanged (no breaking change)
- [ ] Commit: "feat: add error variant to ActivationScreen"

---

## Task 3: UploadValidationScreen (New)

**Files:**
- Create: `src/components/wireframes/UploadValidationScreen.tsx`

**Variants:** `"unsupported-type" | "file-too-large" | "duplicate-name" | "storage-cap" | "file-limit" | "batch-mixed"`

- [ ] Create component showing the Add Source modal layout with pre-populated file list
- [ ] Each variant renders specific validation error(s) on file items:
  - `unsupported-type`: `.exe` file with red error badge
  - `file-too-large`: 15 MB file with size limit error
  - `duplicate-name`: file that already exists with duplicate error
  - `storage-cap`: error banner about storage cap exceeded
  - `file-limit`: error banner about 50 file limit
  - `batch-mixed`: 4 files — 1 valid, 1 unsupported, 1 too large, 1 duplicate
- [ ] Follow `AddSourceModal` visual patterns (modal card, file list items with badges)
- [ ] Commit: "feat: add UploadValidationScreen with 6 variants"

---

## Task 4: UploadPipelineScreen (New)

**Files:**
- Create: `src/components/wireframes/UploadPipelineScreen.tsx`

**Variants:** `"single-uploading" | "batch-mixed" | "processing-failure" | "first-source-ready"`

- [ ] Create component showing source panel + chat panel split layout
- [ ] Each variant renders source list with specific pipeline states:
  - `single-uploading`: one source with animated uploading→pending→indexing status
  - `batch-mixed`: 3 sources at different stages (ready, indexing, pending)
  - `processing-failure`: one source in "Failed" state with retry button, others unaffected
  - `first-source-ready`: first source transitions to ready, chat input enables
- [ ] Follow `SourcePanel` visual patterns (status badges, progress indicators)
- [ ] Commit: "feat: add UploadPipelineScreen with 4 variants"

---

## Task 5: StoreCapacityScreen (New)

**Files:**
- Create: `src/components/wireframes/StoreCapacityScreen.tsx`

- [ ] Create component showing the upload modal with a generic error overlay
- [ ] Error: "Unable to process upload. Please contact support." — no technical details
- [ ] Simple centered error card with alert icon, message, and close button
- [ ] Commit: "feat: add StoreCapacityScreen"

---

## Task 6: PlanLimitWarningsScreen (New)

**Files:**
- Create: `src/components/wireframes/PlanLimitWarningsScreen.tsx`

**Variants:** `"storage-80" | "filecount-80" | "token-80" | "multi-limit" | "storage-100" | "filecount-100" | "token-depleted" | "quota-restored"`

- [ ] Create component wrapping the KB split layout (SourcePanel + ChatPanel) with warning banners at top
- [ ] 80% variants: dismissable warning banner (yellow/warning color, X button)
- [ ] 100% variants: non-dismissable alert banner (red/destructive color, no X button)
- [ ] `token-depleted`: chat input disabled with upgrade prompt
- [ ] `storage-100` / `filecount-100`: uploads blocked but querying works
- [ ] `multi-limit`: banner lists multiple limits approaching
- [ ] `quota-restored`: normal state with success toast "Quota restored"
- [ ] Follow `RetentionWarningScreen` banner pattern (role="alert", banner + split layout below)
- [ ] Commit: "feat: add PlanLimitWarningsScreen with 8 variants"

---

## Task 7: SourceSelectionScreen (New)

**Files:**
- Create: `src/components/wireframes/SourceSelectionScreen.tsx`

**Variants:** `"deselect-blocked" | "auto-select" | "no-ready"`

- [ ] Create component showing source panel with selection edge cases
- [ ] `deselect-blocked`: single selected source, checkbox shows tooltip "At least one source must be selected"
- [ ] `auto-select`: source list where previously selected source is deleted, next ready source highlighted
- [ ] `no-ready`: all sources in non-ready states (indexing, failed), chat disabled
- [ ] Commit: "feat: add SourceSelectionScreen with 3 variants"

---

## Task 8: PlanDataLoadingScreen (New)

**Files:**
- Create: `src/components/wireframes/PlanDataLoadingScreen.tsx`

**Variants:** `"skeleton" | "stripe-failure"`

- [ ] Create component showing source panel header area
- [ ] `skeleton`: storage % and file count replaced with animated skeleton loaders
- [ ] `stripe-failure`: storage % and file count hidden entirely, sources list still visible
- [ ] Commit: "feat: add PlanDataLoadingScreen with 2 variants"

---

## Task 9: DeletionStatesScreen (New)

**Files:**
- Create: `src/components/wireframes/DeletionStatesScreen.tsx`

**Variants:** `"blocked-processing" | "failed" | "pending-cleanup" | "cleanup-locked"`

- [ ] Create component showing source panel with deletion edge cases
- [ ] `blocked-processing`: source in "indexing" state, context menu has no delete option
- [ ] `failed`: source unchanged after failed deletion, toast "Deletion failed"
- [ ] `pending-cleanup`: source in `pending_cleanup` state with "No longer queryable" label, retry cleanup button, "1/3 attempts" counter
- [ ] `cleanup-locked`: source with lock icon, "Max retries reached — contact support", disabled retry
- [ ] Commit: "feat: add DeletionStatesScreen with 4 variants"

---

## Task 10: ChatErrorStatesScreen (New)

**Files:**
- Create: `src/components/wireframes/ChatErrorStatesScreen.tsx`

**Variants:** `"streaming-interrupted" | "ai-service-error" | "session-creation-failed" | "reset-failed"`

- [ ] Create component showing chat panel with error scenarios
- [ ] `streaming-interrupted`: partial response with error indicator + retry link (uses existing `chat.interrupted` key)
- [ ] `ai-service-error`: user message sent, assistant bubble shows error with retry
- [ ] `session-creation-failed`: empty chat with error in input area "Unable to start session. Retry."
- [ ] `reset-failed`: reset confirmation dialog showing error state with retry
- [ ] Follow `ChatPanel` visual patterns (message bubbles, input area)
- [ ] Commit: "feat: add ChatErrorStatesScreen with 4 variants"

---

## Task 11: TokenQuotaScreen (New)

**Files:**
- Create: `src/components/wireframes/TokenQuotaScreen.tsx`

**Variants:** `"mid-session" | "pre-session"`

- [ ] Create component showing KB layout with quota exhaustion
- [ ] `mid-session`: conversation history visible, last response delivered, non-dismissable red banner, chat input disabled with upgrade prompt
- [ ] `pre-session`: KB opens fresh with banner visible, chat input disabled, source panel functional
- [ ] Commit: "feat: add TokenQuotaScreen with 2 variants"

---

## Task 12: CitationEdgeCasesScreen (New)

**Files:**
- Create: `src/components/wireframes/CitationEdgeCasesScreen.tsx`

**Variants:** `"deleted-source" | "no-grounding"`

- [ ] Create component showing chat with citation edge cases
- [ ] `deleted-source`: chat with response containing citation, citation drawer open showing strikethrough name + "Source no longer available" warning + snapshot data
- [ ] `no-grounding`: chat with assistant response that has no citation markers (normal message, no special treatment)
- [ ] Commit: "feat: add CitationEdgeCasesScreen with 2 variants"

---

## Task 13: UploadTaggingScreen (New)

**Files:**
- Create: `src/components/wireframes/UploadTaggingScreen.tsx`

**Variants:** `"default" | "limit-reached" | "duplicate-key" | "locked-view"`

- [ ] Create component showing Add Source modal with tag input section
- [ ] `default`: file selected, 2 tags added (department: strategy, quarter: Q3), immutability notice visible
- [ ] `limit-reached`: 10 tags filled, "Add tag" button disabled, "Maximum 10 tags" message
- [ ] `duplicate-key`: tag input with inline error "Tag key already exists"
- [ ] `locked-view`: source card in panel showing tags as read-only badges, no edit affordance
- [ ] Commit: "feat: add UploadTaggingScreen with 4 variants"

---

## Task 14: UrlIngestionScreen (New)

**Files:**
- Create: `src/components/wireframes/UrlIngestionScreen.tsx`

**Variants:** `"success" | "page-not-found" | "page-blocked" | "no-content" | "auth-required" | "rate-limited" | "timeout" | "service-unavailable" | "content-too-large" | "duplicate"`

- [ ] Create component showing source panel or URL modal with URL-specific states
- [ ] `success`: source panel with URL source progressing through fetching→indexing pipeline
- [ ] Error variants: source in failed state with specific error message from US-008 error mapping table
- [ ] `duplicate`: URL tab of modal with inline error "This URL has already been added"
- [ ] Error messages must match spec exactly (e.g., "Page not found (404). Check the URL and try again.")
- [ ] Commit: "feat: add UrlIngestionScreen with 10 variants"

---

## Task 15: SourcePreviewStatesScreen (New)

**Files:**
- Create: `src/components/wireframes/SourcePreviewStatesScreen.tsx`

**Variants:** `"pdf" | "text" | "non-renderable" | "load-failure" | "url-source" | "failed-source"`

- [ ] Create component showing preview panel in various states
- [ ] `pdf`: PDF rendering area with download button and metadata
- [ ] `text`: raw text/code content rendered in monospace
- [ ] `non-renderable`: "Preview not available for this file type" with download link
- [ ] `load-failure`: "Preview unavailable" indicator, note that source status is unchanged
- [ ] `url-source`: extracted markdown rendered with formatting, original URL clickable, date shown
- [ ] `failed-source`: failure reason displayed with retry option instead of preview/download
- [ ] Follow `SourcePreviewPanel` visual patterns
- [ ] Commit: "feat: add SourcePreviewStatesScreen with 6 variants"

---

## Task 16: StackSettingsScreen — Add New Variants

**Files:**
- Modify: `src/components/wireframes/StackSettingsScreen.tsx`

- [ ] Change prop from `{ readOnly?: boolean }` to `{ variant?: "default" | "read-only" | "custom-prompt" | "disable-warning" | "no-fallback" }`
- [ ] `default`: existing behavior (no change)
- [ ] `read-only`: existing readOnly behavior
- [ ] `custom-prompt`: settings with custom system prompt textarea filled, platform prompt note visible
- [ ] `disable-warning`: confirmation dialog overlay: "Disabling KB stack will route queries to the previous stack."
- [ ] `no-fallback`: confirmation dialog overlay: "No fallback stack exists. Channels will stop receiving AI responses."
- [ ] Commit: "feat: add new variants to StackSettingsScreen"

---

## Task 17: ChannelQueryStatesScreen (New)

**Files:**
- Create: `src/components/wireframes/ChannelQueryStatesScreen.tsx`

**Variants:** `"no-sources-with-context" | "no-sources-no-context" | "quota-depleted"`

- [ ] Create component simulating a channel message view
- [ ] `no-sources-with-context`: channel responds using customer context, note "Responding from workspace context"
- [ ] `no-sources-no-context`: channel responds with base instructions only, note visible
- [ ] `quota-depleted`: channel shows no response, admin banner "Token quota exhausted"
- [ ] Simple chat-like layout with channel branding (WhatsApp-style bubbles or similar)
- [ ] Commit: "feat: add ChannelQueryStatesScreen with 3 variants"

---

## Task 18: RetentionWarningScreen — Add New Variants

**Files:**
- Modify: `src/components/wireframes/RetentionWarningScreen.tsx`

- [ ] Expand variant type: add `"subscription-renewed" | "activity-resumed" | "reactivation" | "reactivation-failed"`
- [ ] `subscription-renewed`: normal KB layout, success toast "Subscription renewed. Sources retained."
- [ ] `activity-resumed`: normal KB layout, success toast "Activity detected. Archival cancelled."
- [ ] `reactivation`: source panel with archived source being re-indexed, status "Reactivating..."
- [ ] `reactivation-failed`: source panel with reactivation error + retry option
- [ ] Existing variants unchanged
- [ ] Commit: "feat: add new variants to RetentionWarningScreen"

---

## Task 19: Wire All Screens into Index.tsx

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] Expand `Screen` type union with all new screen IDs (~48 new entries)
- [ ] Expand `screens` array with all new entries grouped under 11 dev drawer sections:
  1. Onboarding (3)
  2. Upload & Validation (11)
  3. Source Panel (13)
  4. Deletion (4)
  5. Chat & Session (8)
  6. Tagging (4)
  7. URL Ingestion (10)
  8. Preview (6)
  9. Settings (8)
  10. Token Reporting (3 — existing)
  11. Data Retention (8)
- [ ] Add imports for all new components
- [ ] Add routing conditionals mapping each screen ID to component + variant
- [ ] Update `StackSettingsScreen` routing to use new variant prop instead of `readOnly`
- [ ] Verify no TypeScript errors: `npx tsc --noEmit`
- [ ] Commit: "feat: wire all corner case screens into dev drawer"

---

## Task 20: Smoke Test

- [ ] Run `npm run dev`
- [ ] Open `http://localhost:8080`
- [ ] Click dev drawer (Code2 icon in header)
- [ ] Verify all 11 groups appear in the drawer
- [ ] Click through every screen entry — verify each renders without errors
- [ ] Toggle language (EN → AR) on a few screens — verify RTL + Arabic text renders
- [ ] Toggle dark mode on a few screens — verify theme applies
- [ ] Check mobile responsive on 2-3 screens using browser dev tools
- [ ] Fix any rendering issues found
- [ ] Final commit: "fix: resolve any rendering issues from smoke test"
