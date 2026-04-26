# Claude Code Build Spec — Hulul Knowledge Base Prototype

Use this file as the Claude Code implementation brief for recreating the Hulul Knowledge Base prototype with all views, flows, interactions, and edge cases.

## 1. Product Goal

Build an interactive Knowledge Base prototype inside the Hulul platform UI. The prototype must let reviewers walk through activation, source upload, source management, chat with citations, plan limits, token limits, URL ingestion, preview, settings, reporting, and retention/archive states.

This is a frontend prototype unless explicitly upgraded later. Use mock data and deterministic scripted flows. Do not require a backend, external API, or real Gemini integration.

## 2. Technical Baseline

- React 18 + TypeScript + Vite.
- Tailwind CSS with semantic CSS variables.
- shadcn/ui + Radix primitives for dialogs, sheets, tabs, scroll areas, toasts, buttons, inputs, badges, and alerts.
- Lucide React icons.
- React Router with `/` as the main route and `*` as not found.
- Bilingual UI: English and Arabic.
- Arabic must switch layout to RTL where relevant.
- Theme support: light and dark.
- All data is mock/simulated.
- The implementation must include a dev/reviewer drawer that can switch directly to every screen and edge case.

## 3. Important Build/Project Hygiene

Before implementing views, Claude Code should verify the app builds:

- `src/main.tsx` must exist and mount `<App />` into `#root`.
- `index.html` must reference `/src/main.tsx`.
- `package.json` must include:
  - `dev`
  - `build`
  - `lint`
  - `test`
  - `preview`
- Do not rely on a `build:dev` script unless it is explicitly added.
- Do not store roles on a user/profile object if backend work is ever added. Roles must live in a separate role table. For this prototype, roles are simulated only.

## 4. Global App Shell

Create a Hulul-style app shell that frames every screen.

### Desktop Shell

- Top header:
  - Hulul logo.
  - Breadcrumb showing Knowledge Base.
  - Search trigger.
  - Language toggle.
  - Light/dark theme toggle.
  - Dev drawer trigger using a code icon.
- Left icon sidebar:
  - Home.
  - Inbox.
  - CRM.
  - Agent.
  - Knowledge Base active.
  - Settings.
  - Energy/battery indicator.
  - User avatar.
- Main content area renders the current KB screen.

### Mobile Shell

- Top header:
  - Hulul logo.
  - Sources pill with selected-ready count.
  - Compact actions.
- Bottom navigation:
  - Home.
  - Inbox.
  - Search.
  - KB.
  - Menu.
- Sources open in a bottom sheet.
- Citations open in a bottom sheet.
- Dev drawer remains reachable from mobile menu.

## 5. Global State Model

Implement a central KB context/state machine.

### Base Phases

- `activation`
- `activation-error`
- `no-access`
- `empty`
- `active`
- `archived`

### Source Statuses

- `fetching`
- `uploading`
- `pending`
- `indexing`
- `ready`
- `failed`
- `archived`
- `pending_cleanup`

### Overlay Flags

- `quotaWarning`
- `quotaDepleted`
- `sessionWarning`
- `sessionCeiling`
- `streaming`
- `streamInterrupted`
- `aiError`
- `sessionCreateFail`
- `resetFailed`
- `deletionFailed`
- `retentionWarning`
- `retentionFinal`

### Modal Types

- Add source modal with `file` and `url` tabs.
- Delete confirmation dialog.
- Source preview panel/sheet.
- Chat reset confirmation.
- Citation detail panel/drawer.

## 6. Main KB Interface

### Desktop Layout

Three-column workspace:

1. Source panel.
2. Chat panel.
3. Citation panel, visible only when a citation is opened.

Rules:

- Warning banner appears above the columns.
- Source panel width changes smoothly when citation panel opens.
- Citation panel must not overlap chat content.
- Desktop citation panel is inline on the side.

### Mobile Layout

- Chat is the primary screen.
- Source panel opens from the header pill as a bottom sheet.
- Citation panel opens as a bottom sheet.
- No desktop sidebar columns on mobile.

## 7. Dev Drawer Screen Registry

Create a reviewer/dev drawer with the following groups and screens.

### Onboarding

- KB Activation Flow.
- Activation Error.
- No Access.

### Main Interface

- KB Main Interactive.

### Upload & Validation

- Unsupported Type.
- File Too Large.
- Duplicate Name.
- Storage Cap Exceeded.
- File Limit Exceeded.
- Batch Mixed Errors.
- Single Upload Progress.
- Batch Upload Progress.
- Processing Failure.
- First Source Ready.
- Store Capacity Error.

### Source Panel

- Storage Warning 80%.
- File Count Warning 80%.
- Token Warning 80%.
- Multi-Limit Warning.
- Storage Depleted 100%.
- File Count Depleted 100%.
- Token Quota Depleted.
- Quota Restored.
- Deselect Blocked.
- Auto-Select After Delete.
- No Ready Sources.
- Plan Data Loading.
- Stripe/plan metadata Failure.

### Deletion

- Delete Blocked During Processing.
- Deletion Failed.
- Pending Cleanup.
- Cleanup Locked.

### Chat & Session

- Streaming Interrupted.
- AI Service Error.
- Session Creation Failed.
- Reset Failed.
- Quota Exhausted Mid-Session.
- Quota Exhausted Pre-Session.
- Citation Deleted Source.
- Citation No Grounding.

### Tagging

- Tags During Upload.
- Tag Limit Reached.
- Duplicate Tag Key.
- Tags Locked Read-Only.

### URL Ingestion

- URL Success Fetching.
- URL Page Not Found.
- URL Blocked.
- URL No Content.
- URL Auth Required.
- URL Rate Limited.
- URL Timeout.
- URL Service Unavailable.
- URL Content Too Large.
- URL Duplicate.

### Preview

- Preview PDF.
- Preview Text/Code.
- Preview Non-Renderable.
- Preview Load Failure.
- Preview URL Source.
- Preview Failed Source.

### Settings

- AI Stack Settings.
- AI Stack Read Only.
- AI Stack Custom Prompt.
- Disable KB Stack Warning.
- No Fallback Stack Warning.
- Channel No Sources With Customer Context.
- Channel No Sources Without Customer Context.
- Channel Quota Depleted.

### Token Reporting

- Token Reporting Table.
- Token Reporting Empty.
- Token Reporting Error.

### Data Retention

- Retention Warning Initial.
- Retention Final Reminder.
- Dual Trigger Warning.
- Archived Sources.
- Subscription Renewed.
- Activity Resumed.
- Source Reactivation.
- Reactivation Failed.

### Simulations

- Simulate Retention Countdown.

## 8. User Stories and Required Flows

## US-001 — Store and Project Setup

### Story

When a workspace member uploads the first source to the Knowledge Base, the system needs to provision isolated storage infrastructure for the workspace on demand, so source uploads and queries are isolated per tenant.

### Prototype Views

- Store Capacity Error.
- First Source Ready.
- Upload progress states.

### Required Flow

1. User activates KB or enters an empty KB.
2. User uploads first source.
3. Mock pipeline implies store assignment.
4. If assignment succeeds, continue to upload/indexing.
5. If capacity is exhausted, show a generic support/contact error without technical details.

### Cases

- First upload assigns workspace to available store.
- Store capacity overflow assigns additional store.
- No storage capacity available blocks upload.

## US-002 — KB Activation and File Upload

### Story

As a workspace member with KB access, I want to activate the Knowledge Base and upload files as sources, so my team can ask questions from documents.

### Required Views

- Activation screen.
- Activation error screen.
- Empty KB state.
- Add Source modal.
- Upload progress cards.
- Upload validation errors.
- First Source Ready.

### Required Interactions

- Activate KB CTA.
- Retry activation after failure.
- Open Add Source modal.
- Select file tab.
- Submit upload.
- Show pipeline states: uploading -> pending -> indexing -> ready.
- On first ready source, auto-select it and enable chat.

### Validation Cases

- Unsupported file type.
- File exceeds 10 MB.
- Duplicate file name.
- Upload would exceed storage cap.
- Upload would exceed file count limit.
- Batch exceeds 10 files.
- Mixed batch where invalid files fail and valid files continue.
- Processing failure with retry.

### Scripted Upload Sequence

1. Upload 1 succeeds through uploading -> pending -> indexing -> ready.
2. Upload 2 succeeds through uploading -> pending -> indexing -> ready.
3. Upload 3 fails at indexing and exposes Retry.
4. Retry moves failed -> indexing -> ready.

## US-003 — KB Session Model

### Story

When chat is opened or resumed, the system maintains a continuous per-user session with cumulative token accounting.

### Required Views

- Main chat.
- Session creation failed.
- Session memory warning.
- Session ceiling reached.
- Reset confirmation.
- Reset failed.

### Required Interactions

- First message creates a new mock session.
- Returning to the page restores mock conversation history.
- Reset clears visible chat and creates a fresh mock session.
- Token usage increments after responses.
- Session ceiling disables input and prompts reset.
- Session creation failure blocks query and offers retry.

### Cases

- New session on first message.
- Existing session restored.
- Reset creates fresh session.
- Token usage captured after every response.
- Session creation fails.
- Query blocked after ceiling reached.

## US-004 — Source Panel, Storage Tracking, and Selection

### Story

As a workspace member, I want real-time visibility into plan limits and source availability.

### Required Views

- Source panel with source list.
- Empty source state.
- Plan loading skeleton.
- Plan metadata failure fallback.
- Warning banners at 80%.
- Depletion banners at 100%.
- Selection edge cases.

### Source Card Requirements

Each source card shows:

- Display name.
- Type.
- Status badge.
- Tags.
- Upload date or mock timestamp.
- Selection checkbox/toggle for ready sources.
- Preview action for ready sources.
- Delete action for terminal states if role allows it.
- Retry action for failed/pending cleanup states.

Do not show per-source file size.

### Plan Limit Display

- Storage: percentage only.
- File count: `X / Y files` or `0 files added`.
- Hide absolute byte values.
- While plan data loads, show skeleton.
- If plan metadata fails, hide limit displays and show non-blocking fallback.

### Warning Rules

- 80% alert is dismissible.
- 100% alert is non-dismissible.
- 100% alert supersedes 80% alert.
- Multiple limits combine into one warning.
- Alert clears automatically when usage drops below threshold.
- Dismissed 80% warning reappears if a limit crosses threshold again.

### Selection Rules

- At least one ready source must remain selected.
- Deselecting the last selected source is blocked.
- Deleting the selected source auto-selects the next ready source.
- If no ready source remains, disable chat.
- If selected source transitions to non-ready, auto-select next ready source.

## US-005 — Source Deletion

### Story

As an authorized workspace user, I want to delete a source so I can keep content current and reclaim capacity.

### Required Views

- Delete confirmation dialog.
- Delete blocked during processing.
- Deletion failed.
- Pending cleanup.
- Cleanup locked.
- Success toast.

### Required Interactions

- Delete button opens confirmation.
- Confirm deletion.
- Cancel returns unchanged.
- Success removes source and updates storage/file count.
- Failure leaves source unchanged and exposes retry.
- Partial failure marks source as `pending_cleanup` and not queryable.
- Manual cleanup retry allowed up to 3 times.
- After 3 failed retries, lock delete and ask user to contact support.

### Scripted Deletion Sequence

1. First deletion succeeds.
2. Second deletion fails and shows toast/error; next attempt can succeed.
3. Third deletion partially completes and moves source to `pending_cleanup`.
4. Cleanup retry increments counter.
5. After 3 retries, source becomes locked.

## US-006 — Chat with Citations, Memory, and Reset

### Story

As a KB user, I want grounded chat responses with citations, persistent conversation memory, warnings near memory limits, and reset control.

### Required Views

- Chat panel empty prompt.
- Chat panel active conversation.
- Streaming assistant response.
- Citation markers.
- Citation panel.
- Streaming interrupted state.
- AI service error.
- Session warning.
- Session ceiling.
- Reset confirmation.
- Reset failed.
- Token quota depleted.

### Required Interactions

- Send message.
- Stream assistant text progressively.
- Append user and assistant messages to history.
- Show citation markers after completion.
- Click citation marker to open citation panel.
- Retry interrupted response.
- Reset chat from warning/ceiling state.
- Retry failed reset.

### Scripted Chat Sequence

1. Message 1 returns normal cited response and triggers workspace quota warning when crossing 80%.
2. Message 2 returns normal cited response and triggers session memory warning when crossing 80%.
3. Message 3 starts streaming, interrupts at ~60%, saves partial content, marks it as error, and shows Retry.
4. Retry completes the response, then sets quota depleted and session ceiling; chat input becomes disabled.

### Citation Cases

- Citation opens source details, tags, status, and excerpt.
- Deleted source citation shows stored snapshot and deleted-source note.
- No grounding response shows no citation markers and no panel action.

### Reset Sequence

1. First reset succeeds and clears chat/session only.
2. Second reset fails and shows retry dialog.
3. Retry succeeds and clears chat/session.

## US-007 — Source Tagging at Upload

### Story

As a KB user, I want to attach descriptive tags to sources at upload time.

### Required Views

- Tag section in Add Source modal for file upload.
- Tag section in Add Source modal for URL upload.
- Tag limit reached.
- Duplicate tag key.
- Locked/read-only tags on source cards.

### Rules

- Tags are key-value pairs.
- Tags are optional.
- Max 10 user-defined tags per source.
- Key and value must be non-empty after trim.
- Key max 256 chars.
- Value max 2,048 chars.
- Keys must be unique within the same source.
- Tags are immutable after upload.
- Show visible notice that tags cannot be edited later.
- If indexing fails, preserve tags on the failed source.

## US-008 — URL Ingestion with Error Handling

### Story

As a KB user, I want to add web pages as sources and query them alongside uploaded files.

### Required Views

- Add Source modal URL tab.
- URL fetching state.
- URL upload/indexing states.
- URL ready state.
- URL error states.

### Required Flow

1. User enters URL.
2. Client validates URL format.
3. User optionally adds tags.
4. Submit starts fetching.
5. Success resolves page title and extracted markdown.
6. Source enters uploading -> pending -> indexing -> ready.
7. Ready URL source becomes queryable.

### Error Cases

- Page not found: 404 style error.
- Page blocked: 403/firewall style error.
- No readable content.
- Auth/subscription required.
- Rate limited.
- Timeout after 60 seconds.
- URL processing service unavailable.
- Extracted content exceeds 10 MB.
- Duplicate URL.
- Malformed URL rejected before submission.

### URL Rules

- Only single URL submission at launch.
- URL sources count toward file count.
- Tags apply to URL sources with same rules as files.
- URL preview renders extracted markdown.
- Original URL remains clickable.

## US-009 — Source Preview

### Story

As a KB user, I want to preview and download source content.

### Required Views

- Preview panel/sheet.
- PDF preview.
- Text/code preview.
- Non-renderable fallback.
- Load failure indicator.
- URL markdown preview.
- Failed source preview restriction.

### Rules

- Preview action only appears for ready sources.
- Download action follows preview availability.
- PDF, text, HTML, markdown render inline.
- Code, JSON, XML, CSV, TSV, YAML show as raw text.
- DOCX, XLSX, PPTX show fallback with download link.
- If content cannot load, show preview unavailable without changing source queryability.
- Failed sources show failure reason and retry, not preview/download.
- URL preview shows extracted markdown, added date, and original URL link.

## US-010 — AI Stacks, Channel Routing, and Token Reporting

### Story

As a settings user, I want to enable the KB stack across channels and track token usage.

### Required Views

- AI Stack Settings default.
- Read-only settings for non-admin.
- Custom prompt configuration.
- Disable KB warning.
- No fallback warning.
- Channel query no sources with customer context.
- Channel query no sources without context.
- Channel quota depleted.
- Token reporting table.
- Token reporting empty.
- Token reporting error.

### Required Interactions

- Enable KB stack.
- Disable KB stack.
- Save custom prompt.
- Read-only users can view but not toggle.
- Warning before disabling stack.
- If no fallback stack exists, warn that channels will not receive AI responses.

### Channel Cases

- Enabling KB auto-connects all current channels.
- Later-enabled channels inherit KB stack.
- Non-admin cannot enable/disable.
- Platform prompt is hidden.
- Custom prompt is editable.
- No ready sources + customer context returns customer-context fallback response.
- No ready sources + no context returns no-answer/default fallback.
- Token depleted stops channel AI replies.
- Disabling KB reverts to fallback stack if available.
- Disabling KB with no fallback leaves channels without AI responses.

### Token Reporting

Table should show mock rows with:

- Date/time.
- Channel/source: in-app KB chat or channel.
- User/customer/session identifier.
- Prompt/input tokens.
- Output tokens.
- Total tokens.
- Status.

Also implement empty and error states.

## US-011 — Token-Based Summarization

### Story

When long sessions approach token limits, the system can summarize conversation context using the configured workspace model when available.

### Prototype Scope

This is mostly represented by session memory warning and session ceiling states.

### Required Case

- Summarization uses workspace-configured model when available.
- If summarization is not exposed as a separate UI, document it in the session warning/ceiling behavior and keep the visible UI focused on reset and continuation limits.

## US-012 — Data Retention and Expiry Policy

### Story

When subscription or inactivity retention triggers expire, the app warns users, archives sources, disables chat if all sources are archived, and allows reactivation.

### Required Views

- Initial retention warning.
- Final retention reminder.
- Dual trigger warning.
- Archived sources state.
- Subscription renewed.
- Activity resumed.
- Source reactivation.
- Reactivation failed.

### Required Retention Simulation

Add a dev drawer action: Simulate Retention Countdown.

Sequence:

1. Immediately show retention warning banner.
2. After 10 seconds, replace with final reminder.
3. After 20 seconds, archive all sources and disable chat.
4. Sending a chat message cancels retention countdown.

### Cases

- Either subscription or inactivity trigger starts the same warning sequence.
- Renewing subscription cancels expiry countdown.
- Resuming KB activity cancels inactivity countdown.
- Both triggers active simultaneously show dual trigger warning.
- Grace period ending archives sources.
- Reactivating archived source restores queryability.
- Reactivation failure is recoverable.
- Chat disabled when all sources are archived.

## 9. Search Overlay

Implement global search overlay.

### Trigger

- Desktop header search button.
- Keyboard shortcut if desired: Cmd/Ctrl+K.
- Mobile bottom nav Search item opens search.

### Search Behaviors

- Focus input when opened.
- Esc closes dialog.
- ArrowDown/ArrowUp moves focused result.
- Enter on focused result shows navigation toast or mock navigation.
- Default state shows recent searches and saved presets.
- Active filters appear as removable chips.
- Filter bar appears when results exist and prefix mode is none.

### Prefix Modes

- `>` actions/commands.
- `@` contacts/conversations.
- `#` source/tag/id style lookup.
- ID lookup appears when ID prefix query is at least 2 chars.

### Search States

- Default state.
- Results grouped by entity type.
- No results.
- Active filters.
- Saved preset.
- Recent search removal.
- Clear recent searches.

## 10. Warning Banner Priority

Warning banner display priority must be:

1. Retention final.
2. Token/workspace quota depleted.
3. Retention warning.
4. Quota warning.
5. Storage/file-count warnings.

Rules:

- 80% warnings are dismissible.
- 100% depletion warnings are not dismissible.
- Token depletion disables querying.
- Storage/file-count depletion blocks uploads but does not block existing chat.
- Retention final overrides retention warning.

## 11. Mock Data Requirements

Seed the prototype with sources similar to:

- `Q3 Strategy Deck.pdf` — PDF — ready — selected — tag `department: strategy`.
- `API Documentation.md` — MD — ready — selected.
- `Employee Handbook.docx` — DOCX — ready — not selected.
- `Sales Pipeline.xlsx` — XLSX — indexing.
- `Release Notes v2.1.txt` — TXT — pending.
- `https://docs.example.com/guide` — URL — fetching.
- `Old Policy.pdf` — PDF — failed.

Seed mock assistant responses with:

- Business strategy answer with citations.
- Supply chain risks answer with citations.
- API documentation answer with citations.
- No-grounding answer with no citations.

## 12. Accessibility and UX Requirements

- Use semantic buttons for all click actions.
- Dialogs and sheets must have accessible titles.
- Icons used alone need title/aria-label.
- Keyboard navigation must work for search and dialogs.
- Loading and streaming states must not shift layout excessively.
- Mobile sheets must be dismissible.
- Do not overlap text or controls on desktop or mobile.
- Keep source, chat, and citation areas independently scrollable.
- All visible user copy must be localizable.

## 13. Localization Requirements

Support `en` and `ar`.

- Add a `t(key, lang)` translation helper.
- Use dot notation keys such as `sources.add`, `chat.reset`, `search.placeholder`.
- Language toggle switches between English and Arabic.
- Arabic should apply RTL layout direction.
- All critical states, buttons, banners, labels, tabs, and errors require translations.

## 14. Acceptance Checklist for Claude Code

Claude Code is done when:

- The app builds successfully with `npm run build`.
- All dev drawer screens listed above are reachable.
- The main KB interactive flow works end-to-end.
- Activation flow works.
- Upload modal supports file and URL tabs.
- Upload scripted sequence works.
- Chat scripted sequence works.
- Citation panel opens on citation click.
- Delete scripted sequence works.
- Reset scripted sequence works.
- Retention countdown simulation works.
- Search overlay works with keyboard controls.
- Light/dark theme toggles.
- English/Arabic toggle works.
- Desktop layout shows source/chat/citation columns.
- Mobile layout uses bottom sheets.
- All edge case screens render without crashing.
- No backend/API calls are required.

