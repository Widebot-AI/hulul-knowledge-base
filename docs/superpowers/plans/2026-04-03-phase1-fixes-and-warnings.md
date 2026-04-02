# Phase 1: Fixes + Interactive Warning System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 bugs (activation CTA, reset button, citation layout, tag input) and add an interactive warning/quota system to KB Main.

**Architecture:** Modify existing wireframe components + add 2 new components (CitationPanel, WarningBanner). Extend KBContext with workspace quota state. All changes in `src/components/wireframes/`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons

**Spec:** `docs/superpowers/specs/2026-04-03-phase1-fixes-and-interactive-warnings-design.md`

---

## Dependency Graph

```
Task 1 (translations) ──> Tasks 2-5 (independent fixes, parallel OK)
                     ──> Task 6 (KBContext state) ──> Task 7 (WarningBanner) ──> Task 8 (verify)
```

- Task 1: New translation keys (must go first)
- Tasks 2-5: Independent bug fixes (no shared file modifications between them)
- Task 6: KBContext state changes (depends on Task 1 for new keys)
- Task 7: WarningBanner + wire into KBMainInterface (depends on Task 6)
- Task 8: Smoke test everything

---

## Task 1: Add New Translation Keys

**Files:**
- Modify: `src/components/wireframes/translations.ts`

- [ ] Add key `"activation.activate"` — en: "Activate Knowledge Base" / ar: "تفعيل قاعدة المعرفة"
- [ ] Add keys for warning banner messages (workspace-level quota warnings — distinct from existing `warn.*` keys which are for dev drawer screens). Use prefix `"kb.warn.*"` to avoid collision with existing keys
- [ ] Verify no TypeScript errors
- [ ] Commit

---

## Task 2: Fix Activation Screen — Add Explicit CTA

**Files:**
- Modify: `src/components/wireframes/ActivationScreen.tsx`

- [ ] Remove the `onClick={handleFileSelect}` from the drop zone div — it should not trigger upload on the activation screen
- [ ] Add a primary "Activate Knowledge Base" button below the source type shortcuts grid
- [ ] Button calls `setPhase("empty")` — transitions to KB empty state where user can then add sources
- [ ] Source type shortcuts can optionally also trigger activation: click → `setPhase("empty")` then open AddSourceModal
- [ ] For error variant: show inline error below the CTA button (not below the drop zone)
- [ ] Verify the empty state in KBMainInterface still shows "Add sources to start chatting" guidance
- [ ] Commit

---

## Task 3: Fix Reset Button — Always Visible

**Files:**
- Modify: `src/components/wireframes/ChatPanel.tsx`

- [ ] Add a RotateCcw icon button in the chat input area, to the left of the text input field
- [ ] Only render when `messages.length > 0`
- [ ] Clicking opens reset confirmation: `openModal({ kind: "reset-confirm" })`
- [ ] Style: subtle `text-muted-foreground hover:text-foreground`, small (h-8 w-8)
- [ ] Existing 80% and 100% warning reset buttons remain unchanged
- [ ] Commit

---

## Task 4: Fix Citation Panel — 3-Column Layout

**Files:**
- Create: `src/components/wireframes/CitationPanel.tsx`
- Modify: `src/components/wireframes/ChatPanel.tsx`
- Modify: `src/components/wireframes/KBMainInterface.tsx`

- [ ] **Extract** the citation drawer markup from ChatPanel.tsx (the `{citationDrawer && (...)}` block) into a new `CitationPanel.tsx` component
- [ ] CitationPanel reads `citationDrawer`, `closeCitation`, and `lang` from `useKB()`
- [ ] CitationPanel renders the same content: source name, type, status, upload date, excerpt, close button. Deleted source warning when applicable.
- [ ] **Remove** the citation drawer rendering from ChatPanel.tsx entirely (ChatPanel still calls `openCitation()` on citation click)
- [ ] **Modify KBMainInterface.tsx** layout:
  - Read `citationDrawer` from `useKB()` to know if panel is open
  - Default: Sources (w-[30%]) | Chat (flex-1)
  - Citation open: Sources (w-[25%]) | Chat (flex-1) | CitationPanel (w-[25%])
  - Add `transition-all duration-300` for smooth width changes
  - On mobile: CitationPanel renders as a Sheet (bottom sheet) instead of a column
- [ ] Verify citations still open/close correctly when clicking citation markers in chat
- [ ] Commit

---

## Task 5: Fix Tag Input in AddSourceModal

**Files:**
- Modify: `src/components/wireframes/AddSourceModal.tsx`

- [ ] Add a "Tags (optional)" collapsible section to FileUploadTab, between the file list and action buttons
- [ ] When expanded: show existing tags as removable chips, Key + Value inputs, "Add" button
- [ ] Validation: max 10 tags (disable Add when reached, show limit message), no duplicate keys (inline error), no empty key/value (disable Add)
- [ ] Immutability notice in muted text: `t("tag.immutableNotice", lang)`
- [ ] Tags array stored in local state, passed to `onAddSource(name, type, tags)` on upload
- [ ] Add same tag section to UrlTab
- [ ] Commit

---

## Task 6: Add Workspace Quota State to KBContext

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx`

- [ ] Add new state fields:
  - `workspaceQuotaPercent: number` — starts at 45
  - `storageWarningDismissed: boolean` — starts false
  - `filecountWarningDismissed: boolean` — starts false
  - `tokenWarningDismissed: boolean` — starts false
- [ ] In `sendMessage()`: increment `workspaceQuotaPercent` by 8 alongside existing `sessionTokenPercent` increment
- [ ] Add computed value: `workspaceQuotaDepleted: boolean` — true when `workspaceQuotaPercent >= 100`
- [ ] Add dismiss functions: `dismissStorageWarning()`, `dismissFilecountWarning()`, `dismissTokenWarning()`
- [ ] Expose all new fields and functions through context provider
- [ ] Update ChatPanel's disabled logic: add `|| workspaceQuotaDepleted` to the existing disabled check
- [ ] When `workspaceQuotaDepleted`: show upgrade prompt text in the disabled input area instead of "Add and select sources"
- [ ] Commit

---

## Task 7: Create WarningBanner + Wire into KB Main

**Files:**
- Create: `src/components/wireframes/WarningBanner.tsx`
- Modify: `src/components/wireframes/KBMainInterface.tsx`

- [ ] **Create WarningBanner component** that reads from KBContext:
  - Compute storage% from `sources.length / 50 * 100` (simplified)
  - Compute filecount% same way
  - Read `workspaceQuotaPercent` from context
  - **100% check (priority)**: If any limit >= 100, render non-dismissable red banner with specific message per limit type. No X button.
  - **80% check**: If any limit >= 80 and < 100, and not dismissed, render dismissable yellow banner. X button calls the corresponding dismiss function.
  - **Multi-limit**: If multiple limits at 80%+, combine into one banner listing all.
  - 100% supersedes 80% — never show both
- [ ] **Wire into KBMainInterface**: Render `<WarningBanner />` above the split layout div, inside the `flex flex-col h-full` container
- [ ] Verify: chat enough times to see 80% warning appear, then 100% depletion
- [ ] Verify: dismiss 80% warning, keep chatting, see 100% appear
- [ ] Verify: when token quota depleted, chat input is disabled
- [ ] Commit

---

## Task 8: Smoke Test

- [ ] Run `npm run dev`, open `http://localhost:8080`
- [ ] **Activation**: Verify "Activate Knowledge Base" button appears, clicking it goes to empty state
- [ ] **Activation error**: Switch to "Activation Error" in dev drawer, verify error below CTA
- [ ] **Reset**: Chat a few times, verify RotateCcw button appears next to input, clicking opens reset dialog
- [ ] **Citation**: Click a citation marker, verify 3-column layout (sources | chat | citation), no overlap
- [ ] **Tags**: Click "Add sources" → verify tag section appears in modal, add tags, verify validation
- [ ] **80% warning**: Chat ~5 times, verify yellow dismissable banner appears at top
- [ ] **100% depletion**: Chat ~7 times total, verify red non-dismissable banner, chat disabled
- [ ] **Reset after depletion**: Reset chat, verify quota still depleted (chat still disabled)
- [ ] Toggle dark mode and AR language on a few states
- [ ] Fix any issues found
- [ ] Final commit
