# Wireframe Corner Cases — Full Scenario Coverage

**Date:** 2026-04-02
**Scope:** Add all missing UI states from US-001 through US-012 to the prototype's dev drawer as grouped screens with variant selectors.
**Approach:** Grouped screens with variant dropdowns (Approach B). Matches existing patterns (`TokenReportingScreen`, `RetentionWarningScreen`).

---

## Architecture

### How It Works Today

- `pages/Index.tsx` defines a `screens` array and a `Screen` type union. The dev drawer (Code2 icon in header) lets reviewers switch between screens.
- Each screen is a component in `src/components/wireframes/`. Some accept a `variant` prop (e.g., `RetentionWarningScreen variant="final-reminder"`).
- State lives in `KBContext.tsx`. Phase-based routing in `Index.tsx` renders the active screen.
- All data is mock. No backend.

### What Changes

1. **New screen components** in `src/components/wireframes/` — one per grouped screen below.
2. **Expanded `Screen` type** and `screens` array in `pages/Index.tsx` with new entries grouped under dev drawer sections.
3. **New translation keys** in `translations.ts` for any new UI copy (error messages, warnings, labels).
4. **No changes to `KBContext` model** — new screens are static snapshots that render their own local state. They don't need to integrate with the shared context.
5. **Existing screens enhanced** where noted (StackSettings gets new variants, Retention gets new variants).

### Variant Selector Pattern

Each new screen component accepts a `variant` prop. The dev drawer maps screen IDs to component + variant. Example:

```tsx
// In Index.tsx screens array
{ id: "upload-validation-unsupported", label: "Unsupported Type", group: "Upload & Validation" }

// In routing
{(kb.phase as string) === "upload-validation-unsupported" && <UploadValidationScreen variant="unsupported-type" />}
```

---

## Screen Inventory

### Group 1: Onboarding (enhance existing)

**Component:** `ActivationScreen.tsx` (modify)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `activation` | default | US-002 | S1 | Existing activation flow (no change) |
| `activation-error` | error | US-002 | S2 | Activation CTA shows inline error with retry button. "Something went wrong. Please try again." |
| `no-access` | — | US-002 | S1 | Existing no-access screen (no change) |

---

### Group 2: Upload & Validation (new)

**Component:** `UploadValidationScreen.tsx` (new)

Shows the Add Source modal pre-populated with files in various validation error states.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `upload-val-unsupported` | unsupported-type | US-002 | S6 | Modal with a `.exe` file showing red "Unsupported file type" badge. Valid files shown alongside it unaffected. |
| `upload-val-too-large` | file-too-large | US-002 | S6 | Modal with a 15 MB file showing "Exceeds 10 MB limit" error. |
| `upload-val-duplicate` | duplicate-name | US-002 | S6 | Modal with a file that already exists showing "File already exists — delete or rename" error. |
| `upload-val-storage-cap` | storage-cap | US-002 | S6 | Modal with "Would exceed storage cap" error and upgrade guidance. |
| `upload-val-file-limit` | file-limit | US-002 | S6 | Modal with "Would exceed 50 file limit" error and guidance. |
| `upload-val-batch-mixed` | batch-mixed | US-002 | S5, S6 | Modal with 4 files: 1 valid (proceeding), 1 unsupported, 1 too large, 1 duplicate. Shows mixed validation. |

**Component:** `UploadPipelineScreen.tsx` (new)

Shows the source panel with sources in various pipeline states.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `upload-single-progress` | single-uploading | US-002 | S4 | Source panel with one source cycling through: uploading -> pending -> indexing, with animated status. |
| `upload-batch-progress` | batch-mixed | US-002 | S5 | Source panel with 3 sources at different stages: one ready, one indexing, one pending. |
| `upload-processing-fail` | processing-failure | US-002 | S7 | Source panel with a source in "Failed" state with retry button. Other sources unaffected. |
| `upload-first-ready` | first-source-ready | US-002 | S8 | Source panel with first source transitioning to ready. Chat input enables. Auto-selection happens. |

**Component:** `StoreCapacityScreen.tsx` (new)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `store-exhausted` | — | US-001 | S3 | Upload attempt showing generic error: "Unable to process upload. Please contact support." No technical details. |

---

### Group 3: Source Panel States (new)

**Component:** `PlanLimitWarningsScreen.tsx` (new)

Full KB layout with warning banners at the top.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `warn-storage-80` | storage-80 | US-004 | S3a | Dismissable banner: "Storage usage is approaching your plan limit. Manage sources or upgrade." |
| `warn-filecount-80` | filecount-80 | US-004 | S3a | Dismissable banner for file count approaching limit. |
| `warn-token-80` | token-80 | US-004 | S3a | Dismissable banner for token quota approaching limit. |
| `warn-multi-limit` | multi-limit | US-004 | S3b | Banner listing both storage and file count warnings. |
| `warn-storage-100` | storage-100 | US-004 | S4 | Non-dismissable banner: storage depleted. Uploads blocked, querying works. Source panel functional. |
| `warn-filecount-100` | filecount-100 | US-004 | S4 | Non-dismissable banner: file limit reached. Uploads blocked, querying works. |
| `warn-token-depleted` | token-depleted | US-004 | S4, S5 | Non-dismissable banner: token quota exhausted. Chat input disabled with upgrade prompt. Source panel functional. |
| `warn-quota-restored` | quota-restored | US-004 | S8 | Banner auto-hides. Chat input re-enables. Normal state restored. |

**Component:** `SourceSelectionScreen.tsx` (new)

Source panel focused on selection edge cases.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `select-deselect-blocked` | deselect-blocked | US-004 | S9 | Only 1 source selected. Checkbox shows blocked state (tooltip: "At least one source must be selected"). |
| `select-auto-after-delete` | auto-select | US-004 | S10 | Source deleted, next ready source auto-selects with brief highlight animation. |
| `select-no-ready` | no-ready | US-004 | S11 | All sources non-ready (indexing/failed). Chat disabled: "Add and select sources to start chatting." |

**Component:** `PlanDataLoadingScreen.tsx` (new)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `plan-loading` | skeleton | US-004 | Req 2.1 | Source panel header with skeleton loaders where storage % and file count normally appear. |
| `plan-stripe-fail` | stripe-failure | US-004 | Req 2.2 | Source panel header with storage/file count hidden entirely. Sources still visible and functional. |

---

### Group 4: Source Deletion (new)

**Component:** `DeletionStatesScreen.tsx` (new)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `delete-blocked` | blocked-processing | US-005 | S2 | Source in "indexing" state. Context menu has no delete option. |
| `delete-failed` | failed | US-005 | S3 | Delete confirmation was submitted but failed. Source unchanged. Toast: "Deletion failed. Please try again." |
| `delete-pending-cleanup` | pending-cleanup | US-005 | S4 | Source in `pending_cleanup` state: "No longer queryable — partial deletion." Retry cleanup button with "1/3 attempts" counter. |
| `delete-cleanup-locked` | cleanup-locked | US-005 | S4 | Source in `pending_cleanup` with lock icon: "Max retries reached — contact support." Retry button disabled. |

---

### Group 5: Chat & Session (new)

**Component:** `ChatErrorStatesScreen.tsx` (new)

Full KB layout with chat panel showing error scenarios.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `chat-streaming-interrupted` | streaming-interrupted | US-006 | S4 | Partial response visible with error indicator: "Response interrupted — partial content shown." Retry link. |
| `chat-ai-error` | ai-service-error | US-006 | S4 | User message sent, assistant bubble shows error: "Something went wrong. Please try again." Retry option. |
| `chat-session-create-fail` | session-creation-failed | US-003 | S5 | Chat input area shows: "Unable to start session. Retry." No messages. |
| `chat-reset-failed` | reset-failed | US-006 | S9 | Reset confirmation overlay shows error: "Reset failed. Your conversation is unchanged." Retry button. |

**Component:** `TokenQuotaScreen.tsx` (new)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `quota-mid-session` | mid-session | US-004 | S4 | Chat with conversation history. Last response delivered. Non-dismissable banner at top. Chat input disabled with upgrade prompt. |
| `quota-pre-session` | pre-session | US-004 | S5 | KB opens with banner visible. Chat input disabled. Source panel fully functional. |

**Component:** `CitationEdgeCasesScreen.tsx` (new)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `citation-deleted-source` | deleted-source | US-006 | S2 | Citation panel open showing source with strikethrough name, "Source no longer available" warning, snapshot data. |
| `citation-no-grounding` | no-grounding | US-006 | Req 3.1 | Assistant response with no citation markers. Normal message, no special treatment. |

---

### Group 6: Source Tagging (new)

**Component:** `UploadTaggingScreen.tsx` (new)

Shows the Add Source modal with the tagging section.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `tag-default` | default | US-007 | S1 | Modal with file selected and 2 tags added (department: strategy, quarter: Q3). Immutability notice visible. |
| `tag-limit-reached` | limit-reached | US-007 | S2 | Modal with 10 tags filled. "Add tag" button disabled. Inline message: "Maximum 10 tags per source." |
| `tag-duplicate-key` | duplicate-key | US-007 | S3 | Modal with tag input showing inline error: "Tag key already exists." |
| `tag-locked-view` | locked-view | US-007 | S4 | Source card in panel showing tags as read-only badges. No edit affordance. |

---

### Group 7: URL Ingestion (new)

**Component:** `UrlIngestionScreen.tsx` (new)

Shows either the URL tab of the Add Source modal or the source panel with URL-specific states.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `url-success` | success | US-008 | S1 | Source panel with URL source progressing: fetching -> uploading -> pending -> indexing. Page title as display name. |
| `url-not-found` | page-not-found | US-008 | S2 | Source in failed state: "Page not found (404). Check the URL and try again." |
| `url-blocked` | page-blocked | US-008 | S2 | Failed: "This page could not be accessed. It may be blocked or behind a firewall." |
| `url-no-content` | no-content | US-008 | S2 | Failed: "No readable content could be extracted from this page." |
| `url-auth-required` | auth-required | US-008 | S2 | Failed: "This page requires login or a subscription. Only publicly accessible pages are supported." |
| `url-rate-limited` | rate-limited | US-008 | S3 | Failed: "Too many requests. Please try again in a moment." |
| `url-timeout` | timeout | US-008 | S3 | Failed: "The page took too long to load. Try again or use a different URL." |
| `url-service-unavailable` | service-unavailable | US-008 | S3 | Failed: "Our URL processing service is temporarily unavailable. Please try again shortly." |
| `url-too-large` | content-too-large | US-008 | S2 | Failed: "The extracted content from this URL exceeds the 10 MB file size limit." |
| `url-duplicate` | duplicate | US-008 | S4 | Modal URL tab with inline error: "This URL has already been added as a source." |

---

### Group 8: Source Preview (new)

**Component:** `SourcePreviewStatesScreen.tsx` (new)

Shows the preview panel/sheet in various states.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `preview-pdf` | pdf | US-009 | S1 | Preview panel with PDF rendering area, download button, source metadata. |
| `preview-text` | text | US-009 | S1 | Preview panel with raw text/code content rendered. |
| `preview-non-renderable` | non-renderable | US-009 | S4 | "Preview not available for this file type." with download link. |
| `preview-load-failure` | load-failure | US-009 | S5 | "Preview unavailable" indicator. Source status unchanged. |
| `preview-url` | url-source | US-009 | S6 | Extracted markdown rendered with formatting. Original URL clickable. Date shown. |
| `preview-failed-source` | failed-source | US-009 | S3 | Failure reason displayed with retry option instead of preview/download. |

---

### Group 9: AI Stack & Channels (enhance existing + new)

**Component:** `StackSettingsScreen.tsx` (modify — add variants)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `stack-settings` | default | US-010 | S1 | Existing (no change) |
| `stack-settings-readonly` | read-only | US-010 | S2 | Existing (no change) |
| `stack-custom-prompt` | custom-prompt | US-010 | S3 | Settings with custom system prompt textarea filled. Platform prompt note visible. |
| `stack-disable-warning` | disable-warning | US-010 | S7 | Confirmation dialog: "Disabling KB stack will route queries to the previous stack." |
| `stack-no-fallback` | no-fallback | US-010 | S8 | Confirmation dialog: "No fallback stack exists. Channels will stop receiving AI responses." |

**Component:** `ChannelQueryStatesScreen.tsx` (new)

Simulated channel message view showing edge cases.

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `channel-no-sources-context` | no-sources-with-context | US-010 | S4 | Channel responds using customer context (no KB citation). Note: "Responding from workspace context." |
| `channel-no-sources-bare` | no-sources-no-context | US-010 | S5 | Channel responds with base instructions only. Note: "No KB sources or customer context available." |
| `channel-quota-depleted` | quota-depleted | US-010 | S6 | Channel shows no response. Admin banner: "Token quota exhausted. Channels are not receiving responses." |

---

### Group 10: Token Reporting (enhance existing)

**Component:** `TokenReportingScreen.tsx` (modify — add variant)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `token-reporting` | default | US-010 | S9 | Existing (no change) |
| `token-reporting-empty` | empty | US-010 | S9 | Existing (no change) |
| `token-reporting-error` | error | US-010 | S9 | Existing (no change) |

---

### Group 11: Retention (enhance existing)

**Component:** `RetentionWarningScreen.tsx` (modify — add variants)

| Screen ID | Variant | US | Scenario | What It Shows |
|---|---|---|---|---|
| `retention-warning` | warning | US-012 | S1 | Existing (no change) |
| `retention-final` | final-reminder | US-012 | S1 | Existing (no change) |
| `retention-dual` | dual-trigger | US-012 | S4 | Existing (no change) |
| `archived-state` | archived | US-012 | S5, S7 | Existing (no change) |
| `retention-renewed` | subscription-renewed | US-012 | S2 | Warnings dismissed. Normal KB state. Success toast: "Subscription renewed. Sources retained." |
| `retention-activity-resumed` | activity-resumed | US-012 | S3 | Warnings dismissed. Normal KB state. Success toast: "Activity detected. Archival cancelled." |
| `retention-reactivation` | reactivation | US-012 | S6 | Source panel with archived source being re-indexed. Status: "Reactivating..." with progress. |
| `retention-reactivation-fail` | reactivation-failed | US-012 | S6 | Source panel with reactivation failed. Error: "Reactivation failed." Retry option. |

---

## Dev Drawer Organization

The `screens` array in `Index.tsx` groups entries under these sections:

1. **Onboarding** — activation, activation-error, no-access
2. **Upload & Validation** — all upload-val-*, upload pipeline, store-exhausted
3. **Source Panel** — plan limit warnings, selection edge cases, plan data loading
4. **Deletion** — deletion states
5. **Chat & Session** — chat errors, token quota, citation edge cases
6. **Tagging** — upload with tags
7. **URL Ingestion** — all url-* variants
8. **Preview** — all preview-* variants
9. **Settings** — stack settings variants, channel query states
10. **Token Reporting** — existing + quota-restored
11. **Data Retention** — existing + new retention variants

**Total: ~60 screen entries across 17 components (10 new, 7 modified), organized into 11 dev drawer groups.**

---

## Translation Keys

All new user-facing strings (error messages, warnings, labels) get entries in `translations.ts` with both `en` and `ar` values. Key naming follows existing convention: `"section.action"`.

Examples of new keys:
- `"upload.unsupportedType"`, `"upload.fileTooLarge"`, `"upload.duplicateName"`, `"upload.storageCapExceeded"`, `"upload.fileLimitExceeded"`
- `"warn.storageApproaching"`, `"warn.filecountApproaching"`, `"warn.tokenApproaching"`, `"warn.storageDepleted"`, `"warn.tokenDepleted"`
- `"delete.blockedProcessing"`, `"delete.failedRetry"`, `"delete.pendingCleanup"`, `"delete.cleanupLocked"`
- `"url.notFound"`, `"url.blocked"`, `"url.noContent"`, `"url.authRequired"`, `"url.rateLimited"`, `"url.timeout"`, `"url.serviceUnavailable"`, `"url.contentTooLarge"`, `"url.duplicate"`

---

## Intentionally Excluded

- **US-011 (Token-Based Summarization):** This is a backend-only feature for channel sessions. No user-facing KB UI. The only client-side effect is quota depletion alerts, which are already covered under Plan Limit Warnings (`warn-token-depleted`).

---

## What This Does NOT Change

- No changes to `KBContext` state model — new screens use local state only
- No changes to `components/ui/` (shadcn primitives)
- No new dependencies
- No routing changes (still single `/` route)
- Existing interactive screens (kb-main) remain unchanged
- No backend, no API calls, no env vars
