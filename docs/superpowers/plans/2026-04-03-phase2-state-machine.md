# Phase 2: State Machine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor KBContext into a state machine with overlay flags and scripted sequences so KB Main handles all error flows interactively.

**Architecture:** Add flags object + counters to KBContext. Modify sendMessage/deleteSource/addMockSource/resetChat to follow scripted sequences based on counters. Update ChatPanel, SourcePanel, WarningBanner to render flag-driven error states.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons

**Spec:** `docs/superpowers/specs/2026-04-03-phase2-state-machine-design.md`

---

## Dependency Graph

```
Task 1 (flags + counters in KBContext) 
  ├──> Task 2 (sendMessage scripted sequence)
  ├──> Task 3 (addMockSource scripted sequence)
  ├──> Task 4 (deleteSource scripted sequence)
  └──> Task 5 (resetChat scripted sequence)
         └──> Task 6 (ChatPanel error states) ──> Task 7 (SourcePanel deletion states) ──> Task 8 (WarningBanner retention) ──> Task 9 (Retention simulation) ──> Task 10 (Smoke test)
```

Tasks 2-5 are independent of each other (they each modify different callbacks in KBContext). Tasks 6-9 depend on the flags being available.

---

## Task 1: Add Overlay Flags and Counters to KBContext

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx`

- [ ] Add a `flags` object to KBState type with all 12 boolean flags from the spec: `quotaWarning`, `quotaDepleted`, `sessionWarning`, `sessionCeiling`, `streaming`, `streamInterrupted`, `aiError`, `sessionCreateFail`, `resetFailed`, `deletionFailed`, `retentionWarning`, `retentionFinal`
- [ ] Add `messageCount`, `uploadCount`, `deleteCount` counters (all start at 0) to KBState type
- [ ] Add `setFlag(flag, value)` and `clearFlag(flag)` helper functions to KBState type
- [ ] In KBProvider: create `useState` for `flags` (all false initially) and the 3 counters
- [ ] Implement `setFlag` and `clearFlag` as callbacks that update the flags object
- [ ] Replace the standalone `workspaceQuotaDepleted` computed boolean with `flags.quotaDepleted`
- [ ] Update the Provider value to expose `flags`, counters, `setFlag`, `clearFlag`
- [ ] Update any components that reference `workspaceQuotaDepleted` to use `flags.quotaDepleted` instead (ChatPanel.tsx currently uses it)
- [ ] Verify `npx tsc --noEmit` passes
- [ ] Commit: `"feat: add overlay flags and counters to KBContext"`

---

## Task 2: Scripted Chat Sequence in sendMessage

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx` (sendMessage callback)

- [ ] At the start of sendMessage, increment `messageCount`
- [ ] Read the current messageCount to decide behavior:
  - **messageCount 1-2**: Existing behavior — normal response with citations, then after completion set flags based on threshold evaluation (quotaWarning when quota >= 80, sessionWarning when session >= 80)
  - **messageCount 3**: Start streaming normally, but at ~60% of the response text, stop the interval. Set `flags.streamInterrupted = true`. Mark the assistant message as `isError: true` with partial content. Do NOT increment `responseIndex` so retry re-uses same response.
  - **messageCount 4 (retry after interrupted)**: DON'T increment messageCount (keep at 3, use a `retryingMessage` ref to track). Complete the response fully. After completion set `flags.quotaDepleted = true` and `flags.sessionCeiling = true`.
- [ ] After each completed response: auto-evaluate thresholds and set `quotaWarning`/`sessionWarning`/`sessionCeiling`/`quotaDepleted` flags based on current percentages
- [ ] When `flags.streamInterrupted` is true, the chat input should still be enabled so user can "retry" (send another message which triggers the retry path)
- [ ] Commit: `"feat: scripted chat sequence with stream interruption"`

---

## Task 3: Scripted Upload Sequence in addMockSource

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx` (addMockSource callback)

- [ ] At the start of addMockSource, increment `uploadCount`
- [ ] Read uploadCount:
  - **1-2**: Existing behavior — normal pipeline (uploading → pending → indexing → ready in 3.5s)
  - **3**: Pipeline runs normally to indexing, then at the final setTimeout, transition to `"failed"` instead of `"ready"`. Source shows failed status with retry available. On retrySource for this source, it transitions indexing → ready normally.
- [ ] Commit: `"feat: scripted upload sequence with 3rd upload failure"`

---

## Task 4: Scripted Deletion Sequence in deleteSource

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx` (deleteSource callback)

- [ ] At the start of deleteSource, increment `deleteCount`
- [ ] Read deleteCount:
  - **1**: Existing behavior — source removed, auto-select, modal closed
  - **2**: DON'T remove the source. Set `flags.deletionFailed = true`. Close modal. After 5 seconds auto-clear the flag. Next delete attempt on ANY source succeeds normally (reset deleteCount to allow it, or track a `deletionRetrying` flag).
  - **3**: Don't fully remove. Keep source in list but change status to `"pending_cleanup"`. Set `retryCount: 0` on the source. Close modal. Cleanup retry logic: increment retryCount on each retry, after 3 retries set `retryLocked: true`.
- [ ] Add a `retryCleanup(id)` function to KBContext that handles the pending_cleanup retry: if retryCount < 3, increment retryCount and simulate (wait 1s, if retryCount reaches 3, set retryLocked). If retryCount >= 3, do nothing (locked).
- [ ] Expose `retryCleanup` in the context
- [ ] Commit: `"feat: scripted deletion sequence with failure and partial cleanup"`

---

## Task 5: Scripted Reset Failure in resetChat

**Files:**
- Modify: `src/components/wireframes/KBContext.tsx` (resetChat callback)

- [ ] Add a `resetAttemptCount` ref (useRef, starts at 0)
- [ ] On reset:
  - **1st attempt**: Existing behavior — clear messages, session tokens, citation drawer, modal. Increment resetAttemptCount.
  - **2nd attempt**: Set `flags.resetFailed = true`. Don't clear anything. Close the modal. Increment resetAttemptCount.
  - **3rd attempt (retry after failure)**: Clear the `resetFailed` flag. Perform normal reset. Reset the resetAttemptCount to 0.
- [ ] Commit: `"feat: scripted reset failure on 2nd attempt"`

---

## Task 6: ChatPanel Error State Rendering

**Files:**
- Modify: `src/components/wireframes/ChatPanel.tsx`

- [ ] Read `flags` from `useKB()` (replace the standalone `workspaceQuotaDepleted` with `flags.quotaDepleted`)
- [ ] **streamInterrupted**: When the last assistant message has `isError: true`, render an error indicator below the partial text: AlertTriangle icon + `t("chat.interrupted", lang)` + a "Retry" button. Retry button calls `sendMessage("retry")` (or whatever text — the sendMessage scripted logic handles retry path based on messageCount).
- [ ] **aiError flag**: When `flags.aiError` is true, render an error assistant bubble after the last user message: AlertCircle icon + `t("chatError.aiServiceError", lang)` + "Retry" button. Retry clears the flag and re-sends.
- [ ] **sessionCreateFail flag**: When `flags.sessionCreateFail` is true AND messages are empty, replace the empty state with a centered error: AlertCircle + `t("chatError.sessionCreateFailed", lang)` + "Retry" button.
- [ ] **resetFailed flag**: When `flags.resetFailed` is true AND the reset-confirm modal is open, modify the reset dialog to show error state: red icon circle, `t("chatError.resetFailed", lang)` message, "Retry Reset" button (instead of normal confirm). Retry calls resetChat again.
- [ ] Update the `disabled` variable to use `flags.quotaDepleted` and check `flags.sessionCeiling`
- [ ] Commit: `"feat: ChatPanel renders all error states from flags"`

---

## Task 7: SourcePanel Deletion Failure States

**Files:**
- Modify: `src/components/wireframes/SourcePanel.tsx`

- [ ] Read `flags` and `retryCleanup` from `useKB()`
- [ ] When `flags.deletionFailed` is true: render a toast-like destructive banner at the top of the source list: AlertTriangle + `t("delete.failed", lang)`. Auto-dismiss after 5s (use a local useEffect).
- [ ] For sources with `status === "pending_cleanup"`: already partially handled in existing code. Verify it shows the "No longer queryable" label, retry cleanup button with attempts counter, and locked state when `retryLocked`. Wire the retry button to call `retryCleanup(source.id)`.
- [ ] Commit: `"feat: SourcePanel shows deletion failure toast and cleanup states"`

---

## Task 8: WarningBanner Retention Support

**Files:**
- Modify: `src/components/wireframes/WarningBanner.tsx`

- [ ] Read `flags` from `useKB()`
- [ ] Add retention check with HIGHEST priority (above quota depleted):
  - `flags.retentionFinal` → destructive red banner: AlertTriangle + "Final reminder: sources will be archived in 3 days" (use `t("retention.finalReminder", lang)` + `t("retention.archiveIn", lang)` + `t("retention.3days", lang)`)
  - `flags.retentionWarning` → amber warning banner: Clock icon + "Inactivity notice: sources will be archived on April 15, 2026" (use existing retention translation keys)
- [ ] Priority order: `retentionFinal` > `quotaDepleted` > `retentionWarning` > `quotaWarning`
- [ ] Commit: `"feat: WarningBanner supports retention warning flags"`

---

## Task 9: Retention Simulation via Dev Drawer

**Files:**
- Modify: `src/components/wireframes/AppShell.tsx`
- Modify: `src/components/wireframes/KBContext.tsx`

- [ ] Add a `simulateRetention()` function to KBContext:
  - Sets `flags.retentionWarning = true`
  - After 10 seconds: sets `flags.retentionFinal = true`, clears `retentionWarning`
  - After another 10 seconds: sets phase to `"archived"`, clears `retentionFinal`. Sets all source statuses to `"archived"`.
  - If user sends a message while retention is active (retentionWarning or retentionFinal is true), cancel the timers and clear both flags.
- [ ] Add `simulateRetention` to KBState type and Provider value
- [ ] In AppShell's dev drawer: add a "Simulate Retention" button at the bottom of the screen list. Clicking calls `simulateRetention()` and closes the drawer.
- [ ] Add a `cancelRetention()` function that clears both flags and cancels timers. Call it from sendMessage when either retention flag is true.
- [ ] When `phase === "archived"`: KBMainInterface should show archived state — all sources archived, chat disabled with guidance to reactivate. This is already partially handled by the `archived-state` dev drawer screen. Make sure the actual archived phase renders properly in the phase routing in Index.tsx.
- [ ] Commit: `"feat: retention simulation with escalating warnings and archival"`

---

## Task 10: Smoke Test

- [ ] Restart dev server: `npm run dev`
- [ ] **Chat sequence**: Send 3 messages. Verify: msg 1 → quota warning banner, msg 2 → session warning in chat, msg 3 → stream interrupts with partial text + error indicator
- [ ] **Retry interrupted**: Click retry on the interrupted message. Verify: full response delivered, then chat disabled (quota depleted + session ceiling)
- [ ] **Reset flow**: Click Reset in header. Verify: 1st reset succeeds. Send messages again, reset a 2nd time — verify reset fails with error dialog. Click retry — verify reset succeeds.
- [ ] **Upload sequence**: Add source 1 and 2 — verify both reach ready. Add source 3 — verify it fails. Retry — verify it succeeds.
- [ ] **Deletion sequence**: Delete source 1 — succeeds. Delete source 2 — fails with toast. Delete source 3 — pending_cleanup state with retry counter.
- [ ] **Retention simulation**: Open dev drawer, click "Simulate Retention". Verify warning banner appears. Wait 10s — verify escalation to final reminder. Send a message — verify retention cancelled. OR wait another 10s — verify archived state.
- [ ] Toggle dark mode and AR language across error states
- [ ] Fix any issues
- [ ] Final commit
