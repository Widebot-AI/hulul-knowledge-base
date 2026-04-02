# Phase 1: Fixes + Interactive Warning System

**Date:** 2026-04-03
**Scope:** Fix 4 bugs + add interactive warning/quota system to KB Main
**Depends on:** Previous corner case screens implementation (complete)

---

## Fix 1: Activation Screen — Add Explicit CTA

**File:** `src/components/wireframes/ActivationScreen.tsx`

**Current behavior:** Activation screen is a drop zone. Clicking/dropping immediately uploads a mock source and transitions to `phase: "active"`. No explicit activation step.

**New behavior:**
- Remove the drop zone click-to-upload behavior from the activation card
- Add a primary "Activate Knowledge Base" button at the bottom of the card, below the source type shortcuts
- Clicking "Activate" transitions `phase` to `"empty"` (KB activated, no sources yet)
- The empty state of KBMainInterface already exists and shows "Add sources to start chatting" guidance
- Source type shortcuts (PDF, Website, Paste text) remain as visual indicators of what's possible. They can optionally also trigger activation (click any shortcut → activate + open AddSourceModal with the relevant tab). But the primary CTA is the "Activate" button.
- Translation key: reuse `"activation.title"` for button text, or add `"activation.activate"` → en: "Activate Knowledge Base" / ar: "تفعيل قاعدة المعرفة"

**Error variant (`variant="error"`):**
- "Activate" button shows inline error below it: `t("activation.errorMsg", lang)` with retry button
- Keep existing error variant behavior, just ensure the error appears below the CTA button, not below the drop zone

**Drop zone stays** as a visual element showing supported formats, but clicking it does nothing on the activation screen. The actual upload happens after activation via the "Add sources" button in the empty state.

---

## Fix 2: Reset Button Always Visible

**File:** `src/components/wireframes/ChatPanel.tsx`

**Current behavior:** Reset only available via warning banners at 80% and 100% session token usage.

**New behavior:**
- Add a RotateCcw icon button in the chat input area, to the left of the text input
- Only visible when `messages.length > 0` (no reset button when chat is empty)
- Clicking opens the existing reset confirmation dialog (`openModal({ kind: "reset-confirm" })`)
- Small, subtle styling: `text-muted-foreground hover:text-foreground` — not prominent but discoverable
- The 80% and 100% warning reset buttons remain unchanged — this is additive

---

## Fix 3: Citation Panel — 3-Column Layout

**Files:**
- `src/components/wireframes/KBMainInterface.tsx` — layout change
- `src/components/wireframes/ChatPanel.tsx` — extract citation drawer to external control

**Current behavior:** Citation drawer is absolutely positioned inside ChatPanel, overlapping chat content.

**New behavior:**

KBMainInterface manages the 3-column layout:

```
Default:        Sources (30%)  |  Chat (70%)
Citation open:  Sources (25%)  |  Chat (50%)  |  Citations (25%)
Mobile:         Chat (100%)    — citation as bottom sheet (unchanged)
```

**Implementation:**
- KBMainInterface reads `citationDrawer` from KBContext to know if citation panel is open
- When citation is open, column widths transition smoothly (`transition-all duration-300`)
- Extract the citation drawer markup from ChatPanel into a new `CitationPanel.tsx` component
- CitationPanel renders in the third column of KBMainInterface, not inside ChatPanel
- ChatPanel no longer renders any citation drawer — it just calls `openCitation()` on click
- CitationPanel has its own close button that calls `closeCitation()`
- On mobile (`useIsMobile()`), CitationPanel renders as a Sheet/bottom sheet instead of a column

**New file:** `src/components/wireframes/CitationPanel.tsx`
- Receives citation data from KBContext (`citationDrawer`, `closeCitation`)
- Renders source name, type, status, upload date, tags, excerpt
- Shows "Source no longer available" warning for deleted sources
- Close button at top right

---

## Fix 4: Tag Input in AddSourceModal

**File:** `src/components/wireframes/AddSourceModal.tsx`

**Current behavior:** No tag input anywhere in the upload flow.

**New behavior:**

Add a collapsible "Tags (optional)" section to both FileUploadTab and UrlTab, between the file/URL input and the action buttons.

**Tag input UI:**
- Collapsed by default with a "Add tags" toggle/link
- When expanded:
  - Existing tags shown as removable chips: `key: value` with X button
  - Two inline inputs: Key (placeholder "Key") + Value (placeholder "Value") + "Add" button
  - Immutability notice below in muted text: `t("tag.immutableNotice", lang)` — "Tags cannot be edited after upload"
- Validation (all client-side):
  - Max 10 tags: "Add" button disabled when 10 reached, show `t("tag.limitReached", lang)`
  - No duplicate keys: inline error `t("tag.duplicateKey", lang)` if key already exists
  - No empty key/value: "Add" button disabled when either is empty
- Tags array passed to `addMockSource(name, type, tags)` on upload — this parameter already exists and works

**State:** Local component state `tags: { key: string; value: string }[]` + `tagKey: string` + `tagValue: string` for input fields.

---

## Fix 5: Warning Banner System in KB Main

**Files:**
- `src/components/wireframes/KBContext.tsx` — new state fields
- `src/components/wireframes/WarningBanner.tsx` — new component
- `src/components/wireframes/KBMainInterface.tsx` — render WarningBanner

### New KBContext State

Add to KBContext state and provider:

```
workspaceQuotaPercent: number       // starts at 45, increments +8 per chat response
storageWarningDismissed: boolean    // session-level dismiss for 80% storage warning
filecountWarningDismissed: boolean  // session-level dismiss for 80% filecount warning
tokenWarningDismissed: boolean      // session-level dismiss for 80% token warning
```

- `workspaceQuotaPercent` increments in `sendMessage()` alongside `sessionTokenPercent`
- `storagePercent` already exists as derived value in SourcePanel — make it available in context or compute in WarningBanner
- File count: `sources.length / 50 * 100`

### WarningBanner Component

Rendered at the top of KBMainInterface, above the split layout.

**Logic (evaluated on every render):**

1. Compute current percentages: storage, filecount, workspaceQuota
2. Check which limits are at 80%+ and 100%+
3. **100% takes priority** — if any limit is at 100%, show non-dismissable red banner:
   - Storage 100%: "Storage limit reached. New uploads are blocked until you free space or upgrade."
   - Filecount 100%: "File limit reached. New uploads are blocked until you delete sources or upgrade."
   - Token quota 100%: "Token quota exhausted. All KB querying is disabled. Upgrade to continue." + chat input disabled
4. **80% warning** — if any limit is at 80%+ (and not 100%), show dismissable yellow banner:
   - Single limit: specific message for that limit
   - Multiple limits: combined message listing all approaching limits
   - X button dismisses for the session (sets `*WarningDismissed = true`)
   - Dismissed warning reappears if a NEW limit crosses 80% (check if the dismissed limit is still the same set)
5. **Quota restored** — if `workspaceQuotaPercent` drops below 100% (e.g., manual reset via dev), show green success banner that auto-fades

**Interaction with chat:**
- When `workspaceQuotaPercent >= 100`: ChatPanel's `disabled` prop adds workspace quota check
- Current: `disabled = !hasSelectedReady || sessionCeiling`
- New: `disabled = !hasSelectedReady || sessionCeiling || workspaceQuotaDepleted`
- `workspaceQuotaDepleted` comes from KBContext

### How Reviewers Experience It

Starting at 45% workspace quota:
- Chat 5 times → quota reaches ~85% → yellow dismissable warning appears
- Chat 2 more times → quota reaches ~101% → red non-dismissable banner, chat disabled
- Reset chat → session resets but quota stays depleted (matching US-006 S10)
- Storage/filecount warnings appear as sources are added (already at 74% storage from mock data)

---

## Fix 6: Chat Session Warnings Verification

**File:** `src/components/wireframes/ChatPanel.tsx`

**Current behavior:** 80% and 100% session warnings already exist and work correctly.

**Verification needed:**
- 80% text uses qualitative language only — no counts, percentages, or raw numbers. Current text: "This conversation is getting long. Consider resetting to maintain response quality." — this is correct per US-006.
- 100% text disables input with reset prompt — current behavior is correct
- No changes needed unless verification finds issues

---

## What This Does NOT Change

- Dev drawer screens remain as-is (static snapshots still accessible)
- Mobile layout unchanged (single column + bottom sheets)
- Existing mock AI responses unchanged
- No new dependencies
- No changes to components/ui/ (shadcn primitives)
