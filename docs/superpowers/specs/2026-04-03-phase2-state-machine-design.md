# Phase 2: State Machine — Full Interactive Prototype

**Date:** 2026-04-03
**Scope:** Refactor KBContext into a proper state machine with overlay flags. Make KB Main handle all error flows, deletion states, chat errors, retention warnings, and upload failures interactively via scripted sequences.
**Depends on:** Phase 1 (complete)

---

## 1. State Model

### Base Phases (mutually exclusive)

```
activation → activation-error → empty → active → archived
                                  ↑         ↑
                               no-access  (from dev drawer only)
```

- `activation` — User hasn't activated KB yet
- `activation-error` — Activation attempt failed
- `no-access` — User lacks KB permissions (dev drawer only)
- `empty` — KB activated, no sources yet
- `active` — Sources exist, normal operation
- `archived` — All sources archived (retention expiry)

### Overlay Flags (composable on `active` phase)

These are booleans that can be true simultaneously:

| Flag | Meaning | Cleared by |
|------|---------|-----------|
| `quotaWarning` | Workspace token quota >= 80% | Drops below 80% (n/a in prototype) |
| `quotaDepleted` | Workspace token quota >= 100% | Quota restored (dev action) |
| `sessionWarning` | Session tokens >= 80% of limit | Reset chat |
| `sessionCeiling` | Session tokens >= 100% of limit | Reset chat |
| `streaming` | AI response currently streaming | Response completes or errors |
| `streamInterrupted` | Stream cut off mid-response | Retry |
| `aiError` | AI service returned error | Retry |
| `sessionCreateFail` | Session creation failed | Retry |
| `resetFailed` | Session reset failed | Retry |
| `deletionFailed` | Most recent deletion failed | Dismissed or retry |
| `retentionWarning` | Inactivity/expiry countdown started | User queries KB |
| `retentionFinal` | Final reminder before archival | User queries KB |

### Counters (drive scripted sequences)

| Counter | Starts at | Incremented by | Purpose |
|---------|-----------|---------------|---------|
| `messageCount` | 0 | Each sendMessage call | Drives chat scripted sequence |
| `uploadCount` | 0 | Each addMockSource call | Drives upload scripted sequence |
| `deleteCount` | 0 | Each deleteSource call | Drives deletion scripted sequence |
| `sessionTokenPercent` | 0 | +40 per response | Session limit tracking |
| `workspaceQuotaPercent` | 72 | +10 per response | Workspace quota tracking |

---

## 2. Scripted Sequences

### Chat Sequence (based on messageCount)

| messageCount | Response Behavior | Flags Set After |
|-------------|-------------------|-----------------|
| 1 | Normal response with citations | `quotaWarning` (quota → 82%) |
| 2 | Normal response | `sessionWarning` (session → 80%) |
| 3 | Stream starts, interrupts at 60% of text | `streamInterrupted` |
| 4 (retry of 3) | Full response delivered | `quotaDepleted` (quota → 102%) + `sessionCeiling` (session → 120%) → chat disabled |

After message 4, chat is fully disabled. Reset clears session (sessionWarning, sessionCeiling, messages) but NOT workspace quota — chat stays disabled with upgrade prompt.

### Upload Sequence (based on uploadCount)

| uploadCount | Pipeline Behavior |
|------------|-------------------|
| 1 | Normal: uploading → pending → indexing → ready (3.5s). Phase transitions empty → active. Chat enables. |
| 2 | Normal: uploading → pending → indexing → ready (3.5s) |
| 3 | Fails: uploading → pending → indexing → **failed**. Retry available. On retry: indexing → ready. |

### Deletion Sequence (based on deleteCount)

| deleteCount | Behavior |
|------------|----------|
| 1 | Success — source removed, auto-select next, toast "Source deleted" |
| 2 | Fails — `deletionFailed` flag set, source unchanged, toast "Deletion failed. Please try again." Retry (click delete again) succeeds. |
| 3 | Partial — Gemini deleted but S3 failed. Source transitions to `pending_cleanup` status. Retry cleanup available (up to 3 attempts). After 3 fails, source locked with "Contact support". |

---

## 3. KBContext Changes

### New fields to add to KBState type

```typescript
// Overlay flags
flags: {
  quotaWarning: boolean;
  quotaDepleted: boolean;
  sessionWarning: boolean;
  sessionCeiling: boolean;
  streaming: boolean;
  streamInterrupted: boolean;
  aiError: boolean;
  sessionCreateFail: boolean;
  resetFailed: boolean;
  deletionFailed: boolean;
  retentionWarning: boolean;
  retentionFinal: boolean;
};

// Counters
messageCount: number;
uploadCount: number;
deleteCount: number;

// Flag management
setFlag: (flag: keyof KBState['flags'], value: boolean) => void;
clearFlag: (flag: keyof KBState['flags']) => void;
```

### Existing fields that stay
- `phase`, `sources`, `messages`, `modal`, `citationDrawer`, `sessionTokenPercent`, `workspaceQuotaPercent` — all remain
- `sendMessage`, `resetChat`, `deleteSource`, `addMockSource` — modified to implement scripted sequences
- Warning dismissed booleans — remain for WarningBanner

### sendMessage modifications

1. Increment `messageCount`
2. Based on `messageCount`:
   - **1, 2**: Normal response (existing behavior). After response completes, evaluate thresholds and set flags.
   - **3**: Start streaming normally, but at 60% of the response text, stop. Set `streamInterrupted` flag. Show partial text + error indicator. Do NOT increment messageCount again on retry — retry re-attempts message 3.
   - **4**: Normal response. After completion, set `quotaDepleted` + `sessionCeiling`.
3. After each response: evaluate `sessionTokenPercent` and `workspaceQuotaPercent` thresholds, set warning/ceiling flags automatically.

### deleteSource modifications

1. Increment `deleteCount`
2. Based on `deleteCount`:
   - **1**: Existing behavior (remove source)
   - **2**: Don't remove. Set `deletionFailed` flag. Show toast. Next delete attempt (deleteCount stays at 2, or use a retry flag) succeeds.
   - **3**: Remove from query results but keep in list. Set source status to `pending_cleanup`. retryCount = 0. Retry increments retryCount. After 3 retries: set `retryLocked = true`.

### addMockSource modifications

1. Increment `uploadCount`
2. Based on `uploadCount`:
   - **1, 2**: Existing behavior (uploading → pending → indexing → ready)
   - **3**: Pipeline runs to indexing, then transitions to `failed` instead of `ready`. Retry (retrySource) transitions to ready.

### resetChat modifications

1. On 1st reset attempt: succeed normally (existing behavior). Clear session flags.
2. On 2nd reset attempt: set `resetFailed` flag. Don't clear anything. Next retry succeeds.

---

## 4. Component Changes

### ChatPanel.tsx

Currently handles: session warnings, send/receive, reset dialog.

**Add:**
- When `flags.streamInterrupted`: the last assistant message shows partial text + cursor stops + error indicator (AlertTriangle + "Response interrupted — partial content shown" + Retry button). Retry calls `sendMessage` again for the same message.
- When `flags.aiError`: after user message, show an error assistant bubble ("Something went wrong. Please try again." + Retry button).
- When `flags.sessionCreateFail`: empty chat shows centered error ("Unable to start session." + Retry button) instead of the normal empty state.
- When `flags.resetFailed`: the reset confirmation dialog shows error state ("Reset failed. Your conversation is unchanged." + "Retry Reset" button).
- Retry actions: clear the respective flag and re-attempt the action.

### SourcePanel.tsx

Currently handles: source list, selection, status display, context menu.

**Add:**
- When `flags.deletionFailed`: show a toast/banner at top of source panel ("Deletion failed. Please try again." in destructive style). Auto-dismiss after 5s or on next action.
- Source with `status === "pending_cleanup"`: already handled in existing code (shows retry cleanup, attempts counter, locked state). Ensure it works with the scripted deletion sequence.

### AddSourceModal.tsx

Currently handles: file upload, URL add, tag input.

**Add:**
- Upload validation based on file characteristics during the scripted sequence. The 3rd upload triggers a failure in the pipeline, not in the modal — so no modal changes needed. The failure appears in the source panel after the modal closes.

### WarningBanner.tsx

Currently handles: quota warning/depletion banners.

**Add:**
- When `flags.retentionWarning`: show retention-specific warning banner (amber, "Your KB sources will be archived on [date] due to inactivity."). This supersedes quota warning if both active.
- When `flags.retentionFinal`: show destructive retention banner ("Final reminder: sources will be archived in 3 days").
- Priority order: retentionFinal > quotaDepleted > retentionWarning > quotaWarning

### KBMainInterface.tsx

No changes needed — already renders WarningBanner + SourcePanel + ChatPanel + CitationPanel. The state machine flags flow through context to each component.

---

## 5. Retention Flow

Retention is harder to script into the main flow since it's time-based. Handle it via:

- Add a "Simulate retention" action in the dev drawer (alongside existing screen links)
- Clicking it sets `flags.retentionWarning` while keeping the KB in `active` phase
- After 10 seconds, auto-escalates to `flags.retentionFinal`
- After another 10 seconds, transitions phase to `archived`
- Querying the KB (sending a message) cancels retention (clears flags)
- When `phase === "archived"`: source panel shows all sources as archived, chat disabled, "Reactivate" or "Upload new" guidance

---

## 6. What Stays Dev Drawer Only

These don't fit naturally into the interactive flow:

- **No Access** — role-based, not a flow state
- **Store capacity exhaustion** — infrastructure concern
- **Stack settings** (all variants) — separate settings page
- **Channel query states** — channel simulation
- **Token reporting** (all variants) — separate reporting page
- **Plan data loading / Stripe failure** — loading states
- **Source preview variants** — preview modal states (though the preview modal itself is interactive)
- **Upload validation edge cases** — batch mixed, storage cap, file limit (would need specific file names to trigger)

---

## 7. What This Does NOT Change

- Dev drawer screens remain as-is (static snapshots still accessible)
- Mobile layout patterns unchanged
- Translation keys already exist from Phase 1 and corner cases work
- No new dependencies
- No changes to components/ui/ (shadcn primitives)
- Existing routing in Index.tsx unchanged
