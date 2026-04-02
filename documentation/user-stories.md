## US-001: Gemini Store and Project Setup

**Epic:** Knowledge Base Foundation | **[R1]**
**Gemini API Reference:** [Gemini File Search - Store Concepts](https://ai.google.dev/gemini-api/docs/file-search#file-search-stores "https://ai.google.dev/gemini-api/docs/file-search#file-search-stores")

### **STORY**

**When** a workspace member uploads the first source to the Knowledge Base,
**the system needs** to provision isolated storage infrastructure for the workspace on demand,
**So that** source uploads and queries are correctly isolated per tenant, and store resources are allocated only to active workspaces.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: First source upload assigns workspace to an available store**

* **Given** a workspace has no existing storage assignment
* **When** the first source upload is initiated
* **Then** the workspace is assigned to an available store
* And the assignment is persisted for all subsequent uploads and queries

#### **Scenario 2: Store capacity overflow assigns an additional store**

* **Given** a workspace's assigned store has reached its capacity limit
* **When** a new source upload is initiated
* **Then** the system provisions additional storage capacity for the workspace
* And the upload proceeds without interruption
* And all previously uploaded sources remain queryable alongside the new source

#### **Scenario 3: No storage capacity available**

* **Given** the system has no remaining storage capacity for the workspace
* **When** a new source upload is initiated
* **Then** the upload fails with a generic error prompting the user to contact support, with no technical detail exposed
* And the internal operations team is alerted about the capacity exhaustion

### **Requirements:**

**1. Store Infrastructure (General)**

1. Store pool is domain-based: `platform.hulul.net` workspaces assign to regular stores (80 stores across 8 projects); `platform.widebot.net` workspaces assign to enterprise stores (20 stores across 2 projects). Each project holds a maximum of 10 stores. All stores are [pre-created](https://ai.google.dev/api/file-search/file-search-stores#method:-filesearchstores.create "https://ai.google.dev/api/file-search/file-search-stores#method:-filesearchstores.create") at deployment time; no store is created on-demand during workspace assignment. Domain is evaluated at assignment time. Existing assignments are retained if the domain changes; re-assignment is not supported at launch.
2. Every query injects the workspace identifier as a metadata filter from auth context. This is the primary tenant isolation mechanism.

**2. First Upload Assignment (S1)**

1. Store setup happens on first source [upload](https://ai.google.dev/gemini-api/docs/file-search#upload "https://ai.google.dev/gemini-api/docs/file-search#upload"). The activation is a UX and tracking gate only. Store resources are allocated only when a source is uploaded.
2. Assignment routing: select the project with the lowest workspace count; within that project, select the store with the lowest count of workspaces.
3. Store assignment is idempotent: concurrent first uploads for the same workspace (across tabs, browsers, or users) resolve to a single assignment with no duplicates created.
4. Workspace-to-project assignment is permanent.

**3. Capacity Overflow (S2)**

1. A workspace starts with one store assignment and can grow to a maximum of 5 stores total, all within the same project.
2. All files for a workspace reside within the same project. Cross-project overflow is not supported.
3. Query calls pass all stores assigned to the workspace (1-5).
4. If all stores within the workspace's assigned project are at capacity, the workspace cannot expand further regardless of availability in other projects. New source uploads are blocked until capacity is freed.

**4. Tracking Events**

1. `KB Store Assigned` fires server-side on first-time store setup.
2. `KB Store Exhausted` fires server-side when capacity exhaustion is detected. No technical detail is exposed to the user.

---

## US-002: KB Activation and File Upload

**Epic:** Knowledge Base Foundation | **[R1]**
**Gemini API Reference:** [Gemini File Search - Upload](https://ai.google.dev/gemini-api/docs/file-search#upload "https://ai.google.dev/gemini-api/docs/file-search#upload")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** to activate the Knowledge Base and upload files as sources,
**So that** my team can get answers from uploaded documents through the KB chat.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: First-time activation transitions to KB empty state**

* **Given** I have access to the Knowledge Base and my workspace has not activated it yet
* **When** I activate the Knowledge Base
* **Then** the workspace is marked as activated
* And I land in the KB interface with chat unavailable
* And I see guidance to add my first source before I can start asking questions

#### **Scenario 2: Activation fails with retry**

* **Given** my workspace has not yet activated the KB
* **When** I attempt to activate the Knowledge Base and the request fails
* **Then** I am informed of the failure and can retry without losing my place

#### **Scenario 3: Returning user bypasses activation**

* **Given** my workspace has already activated the Knowledge Base
* **When** I open the Knowledge Base
* **Then** I land directly in the KB without seeing the activation screen

#### **Scenario 4: Successful single file upload with real-time status**

* **Given** I have a supported file under 10 MB and my workspace has not exceeded its storage cap or file count limit
* **When** I upload the file
* **Then** the source appears in the panel and I can follow its progress in real time until it is available for querying or shows an error

#### **Scenario 5: Successful batch upload**

* **Given** I have up to 10 supported files ready to upload within workspace limits
* **When** I upload the batch
* **Then** each file appears in the source panel with its own status indicator and any single file failure does not block the rest

#### **Scenario 6: Upload rejected before any transfer begins**

* **Given** I have selected one or more files that do not pass upload requirements
* **When** I attempt to upload
* **Then** each file that fails validation is rejected with a specific, actionable error before any data is transferred, while valid files proceed normally

#### **Scenario 7: Processing failure is isolated and recoverable**

* **Given** a source is being processed
* **When** processing fails
* **Then** the source shows a failed status, I can retry it, and no other source in the panel is affected

#### **Scenario 8: Chat activates when the first source reaches ready**

* **Given** the KB has no sources available for querying
* **When** a source finishes processing successfully
* **Then** it is automatically selected and I can begin querying

### **Requirements:**

**1. Access and Roles**

1. KB is accessible to default roles only: Owner, Super Admin, Bot Admin, Editor, App Manager. Other roles see no KB entry point.
2. Users without KB access see no KB entry point. Direct URL navigation shows a message informing them to contact the workspace admin. This is a new platform UI element; Product Design to define layout and copy. Exact message in [UX Specs](https://widebot.atlassian.net/wiki/spaces/WD/pages/3313860639 "https://widebot.atlassian.net/wiki/spaces/WD/pages/3313860639").

**2. Activation**

1. The activation screen is a one-time gate. Once any user activates the KB, all users skip it permanently. The backend persists the activation flag. No Gemini store setup occurs on activation; store assignment is deferred to the first source upload.
2. Design note: Activation screen design, CTA copy, and value proposition are owned by Product Design.
3. KB interface state persists across page reloads and re-logins.
4. If activation fails, the user remains on the activation screen with an error message and can retry immediately. No navigation or state is lost.

**3. Supported Sources**

1. Supported file types ([File types reference](https://ai.google.dev/gemini-api/docs/file-search#supported-files "https://ai.google.dev/gemini-api/docs/file-search#supported-files")): Documents (PDF, DOCX, PPTX, XLSX), Text (TXT, MD, HTML, XML, JSON, YAML, JSONL, CSV, TSV), Code (PY, JS, TS, JAVA, C, CPP, CS, GO, RB, PHP, SH, R, SQL). Extendable later.

**4. Pre-Upload Validation**

1. Pre-check list for file upload:
   1. Batch exceeds 10 files: files beyond the first 10 are rejected with a count notice; the first 10 proceed to per-file checks
   2. Unsupported file type: rejected at the client validation layer with the list of accepted formats before upload begins
   3. File exceeds 10 MB hard ceiling: rejected with guidance on the per-file limit
   4. Duplicate file name (same name already exists in the workspace): rejected with guidance to delete the existing source or rename before re-uploading
   5. Upload would exceed workspace storage cap: rejected with guidance to delete sources or upgrade
   6. Upload would exceed workspace file count limit: rejected with guidance to delete sources or upgrade
2. All plan limit checks (file size, storage cap, file count) run as a pre-check before upload. Reject early.
3. Error messages for rejection scenarios describe what the error communicates. Exact copy in [UX Specs](https://widebot.atlassian.net/wiki/spaces/WD/pages/3313860639 "https://widebot.atlassian.net/wiki/spaces/WD/pages/3313860639").

**5. Upload Pipeline and Queue**

1. On upload, the file is stored in S3 first; the S3 identifier is passed to Gemini as metadata before indexing begins.
2. If no Gemini store assignment exists for the workspace, the upload pipeline triggers store setup before proceeding. Transparent to the user. If store setup fails, the upload is rejected with a generic error prompting support contact.
3. Every file uploaded to Gemini includes platform [custom metadata](https://ai.google.dev/api/file-search/documents#CustomMetadata "https://ai.google.dev/api/file-search/documents#CustomMetadata") from the authenticated session: workspace identifier and storage bucket identifier. These 2 tags are never accepted from client input.
4. All files in a batch and files from concurrent users are processed sequentially through a per-workspace queue, one file at a time. Each file's status updates independently. Any single file failure does not affect other queued files.
5. Queue ordering: smaller files first by size ascending. FIFO tiebreaker for equal sizes.
6. Limit validation runs twice per file: pre-queue and post-S3-upload. Post-upload check catches limits reached by concurrent uploads during processing.
7. If post-upload validation fails for a pending-state file (S3 complete, not yet submitted to Gemini), rollback is S3-only.
8. Queue state survives temporary service restarts. Files mid-processing are re-queued. No queued files are lost or silently dropped. Persistence mechanism is engineering's decision.
9. Upload queue continues processing when the client disconnects. On reconnect, each file's current processing state is reflected accurately.
10. Gemini retry behavior during indexing follows [Document State](https://ai.google.dev/api/file-search/documents#State "https://ai.google.dev/api/file-search/documents#State") lifecycle (pending, active, failed). The source remains in indexing state during retries. If all retries fail, the source is marked failed with a retry option.
11. Logs Manager entry on source entering pending state: Section "Knowledge Base", Description "ID {source_id} {actor_name} Added {display_name} Source", Type badge "Upload", Created By the authenticated user.
12. The event fires at S3 completion, not after Gemini indexing.

**6. Source Panel and Status**

1. Each source reflects its current processing state in real-time (no page refresh).
2. Display strings for uploading, pending, indexing, ready, and failed states can be localized without changing state logic.
3. At least one source must always be selected; if the selected source is deleted, the next available ready source is auto-selected.
4. Source panel status reflects current state across concurrent users. Broadcast mechanism is engineering's decision.

**7. Chat Activation (S8)**

1. Chat input is disabled until at least one source reaches ready state. When the first source is ready, it is automatically selected and chat becomes available without any user action. The chat panel re-evaluates enabled/disabled state in real-time whenever source processing status changes.

**8. Tracking Events**

1. Events fired: `KB Activated` (first-time activation only), `KB Viewed`, `KB Empty State Viewed`, `Source Upload Initiated`, `Source Upload Completed`, `Source Upload Failed`, `Source Indexed`, `Source Index Failed`

---

## US-003: KB Session Model

**Epic:** Knowledge Base Foundation | **[R1]**

### **STORY**

**When** a chat session is opened or resumed in the Knowledge Base,
**the system needs** to maintain a continuous, per-user session with accurate cumulative token accounting,
**So that** conversation context is preserved across page reloads, re-logins, and browser closes, and the per-session ceiling is correctly enforced.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: New session created on first chat interaction**

* **Given** no active session exists for this user in this KB
* **When** the first message is sent
* **Then** a new session is created with no prior history and no recorded usage

#### **Scenario 2: Existing session restored on return**

* **Given** an active session exists for this user in this KB
* **When** KB chat is initialized for this user
* **Then** the existing session is restored with full conversation history and recorded usage intact, and no new session is created

#### **Scenario 3: Session reset creates a fresh session**

* **Given** a session reset has been confirmed for this user
* **When** the reset is processed
* **Then** the current session is closed and the chat is cleared, ready for a new conversation

#### **Scenario 4: Token usage captured after every response**

* **Given** an active session
* **When** a query is submitted and a response is received from Gemini
* **Then** the system records how many tokens the response consumed and updates the running session total

#### **Scenario 5: Session creation fails**

* **Given** no active session exists for this user and at least one ready source is available
* **When** a session creation attempt fails
* **Then** an error with a retry option is surfaced to the user
* And no query is processed until a session is successfully established

#### **Scenario 6: Query blocked when session ceiling is reached**

* **Given** a session that has reached its maximum conversation length
* **When** a new query is received
* **Then** the query is blocked, no request is sent to Gemini, and the user is prompted to reset the session to continue chatting

### **Requirements:**

**1. Session Lifecycle**

1. This session model is new to the platform. The legacy RAG system has no equivalent. Do not reuse existing session infrastructure.
2. Session is created on first message sent, not on chat open.
3. One active conversation per user per KB at all times.
4. Session reset must complete in under 500ms.
5. Reset and closed sessions are retained in the database with full conversation history for future training purposes. This data is not visible to users. Surfacing it is future scope.

**2. Persistence**

1. Session is server-managed and persists across page reloads, browser closes, re-logins, and multiple devices. All tabs and devices for the same user reflect the same session state. The server-side session is the single source of truth.
2. Cross-tab session consistency must be handled so that actions in one tab (sending a message, resetting a session) are reflected in other open tabs for the same user. Implementation approach is the frontend team's decision.

**3. Token Tracking**

1. Token tracking is server-side, not frontend.
2. All token fields from the [Gemini usage response](https://ai.google.dev/gemini-api/docs/tokens "https://ai.google.dev/gemini-api/docs/tokens") are captured per response. If Gemini returns no usage_metadata, token fields are stored as NULL and the running session total is not incremented.
3. Queries from the same session are serialized at the service layer. Concurrent queries must not read the same token count simultaneously, as both would pass the ceiling check and write independently, causing the count to be double-incremented. Per-session query queuing is a service-level concern.

**4. Scope Boundaries**

1. KB deactivation and workspace deletion are out of scope for all releases.

**5. Events**

1. No client-side events for session creation. Session state reflected in `session_token_count` property on `Chat Input Focused` and `Chat Query Submitted` events.

---

## US-004: Source Panel, Storage Tracking, and Selection

**Epic:** Source Management | **[R1]**
**Gemini API Reference:** [Gemini Documents - Document Resource](https://ai.google.dev/api/file-search/documents#resource:-document "https://ai.google.dev/api/file-search/documents#resource:-document")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** real-time visibility into my workspace plan limits and guaranteed source availability,
**So that** I can manage my KB proactively and never face an unexpected unqueryable state.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Source panel displays storage and file count**

* **Given** I have one or more sources in my Knowledge Base
* **When** I view the source panel
* **Then** workspace storage is displayed as a percentage consumed (e.g., "65% storage used"), file count as absolute (e.g., "12 / 50 files"), and no per-source sizes or absolute byte values are shown anywhere in the panel

#### **Scenario 2: Source panel displays zero state**

* **Given** I have no sources in my Knowledge Base
* **When** I view the source panel
* **Then** storage displays as "0% storage used" and file count as "0 files added"

#### **Scenario 3a: Alert appears when workspace approaches a plan limit**

* **Given** my workspace usage is below the plan limit warning threshold
* **When** usage crosses the warning threshold for any limit
* **Then** a dismissable alert appears across all pages, visible to all workspace members, indicating which limit is approaching with upgrade or manage-sources guidance

#### **Scenario 3b: Alert updates when a second limit approaches**

* **Given** a warning alert is already visible for one limit
* **When** a second limit subsequently crosses the warning threshold
* **Then** the existing alert updates to list all affected limits without requiring dismissal

#### **Scenario 3c: Alert clears when usage drops below the warning threshold**

* **Given** a warning alert is visible for a limit
* **When** the usage for that limit drops below the warning threshold
* **Then** the alert clears without requiring user action

#### **Scenario 3d: Dismissed alert reappears when a limit crosses the threshold again**

* **Given** the warning alert was previously dismissed
* **When** a limit crosses the warning threshold
* **Then** the alert reappears listing all limits currently at or above the warning threshold

#### **Scenario 4: Token quota depletes mid-session**

* **Given** I am actively using the KB and my workspace's KB token quota is not yet fully exhausted
* **When** I receive the full response of the query that depleted the remaining quota to zero
* **Then** KB querying is disabled immediately after the response is delivered
* And a system-wide non-dismissable alert appears immediately, regardless of whether the warning was shown or dismissed, with upgrade guidance
* And the source panel (add, preview, delete) remains fully functional

#### **Scenario 5: User opens KB after quota is already depleted**

* **Given** my workspace's KB token quota has been fully exhausted before my session
* **When** I open the KB
* **Then** the KB opens with querying disabled and the non-dismissable alert visible.

#### **Scenario 6: Source successfully completes indexing**

* **Given** a source is being indexed and I am viewing the source panel
* **When** the source successfully completes processing
* **Then** the source status updates to ready without page refresh, storage percentage updates to reflect the newly indexed source.

#### **Scenario 7: Source fails indexing**

* **Given** a source is being indexed and I am viewing the source panel
* **When** the source fails processing
* **Then** the source status updates to failed without page refresh, and storage percentage and file count remain unchanged

#### **Scenario 8: Quota restored while user is on the KB**

* **Given** my workspace's KB token quota is fully depleted and querying is disabled
* **When** the quota is automatically restored by a billing cycle renewal or service delivery quota reset
* **Then** KB querying re-enables immediately without page reload
* And the non-dismissable alert auto-hides without requiring user action
* And the chat input returns to its enabled state if at least one ready source exists, or remains disabled with the add-sources prompt if no ready sources are available

#### **Scenario 9: Deselecting the last selected source is blocked**

* **Given** only one source is currently selected
* **When** I attempt to deselect it
* **Then** the deselection is blocked and the source remains selected

#### **Scenario 10: Auto-selecting next source when selected source is deleted**

* **Given** I have multiple sources and the currently selected source is deleted
* **When** the deletion completes
* **Then** the platform automatically selects the next available source with ready status
* And if no ready source exists after deletion, the chat input disables with a prompt to add sources

#### **Scenario 10b: Auto-selecting next source when selected source transitions to a non-ready state**

* **Given** a source is currently selected
* **And** at least one other source has ready status
* **When** the selected source transitions to a non-ready state
* **Then** the platform automatically selects the next available ready source in list order

#### **Scenario 11: Chat disabled when no ready sources remain**

* **Given** all sources have been deleted or are in a non-ready state
* **When** the last ready source is deleted or transitions to a non-ready state
* **Then** the chat input is disabled with a prompt to add sources

### **Requirements:**

**1. Display and Real-Time Behavior**

1. Storage display is percentage-only. No absolute byte values shown anywhere. Internal enforcement uses Gemini `sizeBytes`. Total workspace storage = sum of all source `sizeBytes` in the source registry.
2. No per-source size displayed. Source cards show: name, type, status, tags, upload date.
3. **File count reflects all sources regardless of status.** The (X / Y) counter increments when a source is added to the workspace, including sources in processing, failed, or non-ready states. When US-016 ships (R3), expired sources will also count toward file count per this rule — no update needed at that time.
4. Sources still being processed are excluded from storage percentage until Gemini confirms their size.
5. The chat panel re-evaluates enabled/disabled state in real-time whenever source status or selection changes.

**2. Plan Data Loading**

1. While Stripe metadata is loading, storage percentage and file count display a loading skeleton. Stripe failure fallback applies if the fetch does not resolve.
2. Stripe metadata failure fallback: If Stripe metadata fails to load, hide storage percentage and file count displays entirely. Platform retries fetching in the background. Displays render once data is available.
3. Plan limit values from Stripe metadata. Plan tiers advertised as relative multipliers, not byte caps. Upgrade prompt visibility determined by whether a higher plan tier exists in Stripe metadata.

**3. Warning Alert (80%)**

1. The plan limit warning threshold is 80% of the respective limit (storage cap, file count, KB token quota). An alert fires when any limit crosses this threshold.
2. The 80% warning alert auto-hides whenever usage for that limit drops below the warning threshold, regardless of cause (user action or system resolution). When a user manually dismisses the alert while usage is still at or above the warning threshold, the dismissed state persists for the current browser session — the alert will not reappear unless usage crosses the threshold again. Navigating between pages within the same session preserves the dismissed state.
3. The upgrade prompt within the 80% alert is visible if a higher plan tier exists in Stripe metadata and hidden on the highest plan.

**4. Depletion Alert (100%)**

1. **Alert visibility:** Both alerts are system-wide across all pages, visible to all users regardless of role. 80% is dismissable. 100% is non-dismissable.
2. Any limit depletion alert (100%) supersedes and replaces the 80% dismissable alert regardless of its current state.
3. The 100% non-dismissable alert behavior varies by limit type. Storage cap and file count at 100% block new uploads but do not disable querying — KB conversations continue normally. Token quota at 100% disables all KB querying regardless of source availability.
4. When a depletion alert auto-hides on system resolution, if any limits remain at or above 80%, the 80% dismissable alert reappears for those limits.

**5. Token Quota Rules**

1. When KB token quota is fully depleted: all KB querying disabled. Source panel remains functional. Upgrade to a higher plan, billing cycle renewal, or manual quota reset by service delivery restores querying.
2. If completing an in-progress query causes the token balance to go negative, the negative credit is silently ignored. No negative balance is shown anywhere. Negative credit handling is out of scope for R1.
3. Chat session reset does not restore KB querying when token quota is depleted.

**6. Source Selection Rules**

1. At least one source must be selected at all times when ready sources exist. The UI must enforce this and not rely on the user.
2. Auto-selection picks the next available ready source in list order. Triggers: selected source is deleted, or selected source transitions to a non-ready state.
3. Selection state persists across page reloads and re-logins.

**7. Analytics Events**

1. **Events fired:** `Storage Limit Warning Shown` {limit_type, percent_consumed}, `File Count Limit Warning Shown` {limit_type, percent_consumed}, `Token Quota Warning Shown` {limit_type, percent_consumed}, `Token Quota Depleted` {timestamp}, `KB Querying Disabled` {trigger: "quota_depletion", timestamp}, `Source Selected` {source_id, trigger: "auto" | "user"}, `Source Deselected` {source_id}

## US-005: Source Deletion

**Epic:** Source Management | **[R1]**
**Gemini API Reference:** [Gemini File Search - Delete Document](https://ai.google.dev/api/file-search/documents#method:-filesearchstores.documents.delete "https://ai.google.dev/api/file-search/documents#method:-filesearchstores.documents.delete")

### **STORY**

**As a** workspace Owner, Super Admin, Bot Admin, or App Manager,
**I want** to delete a source from the Knowledge Base,
**So that** I can keep my workspace sources current and reclaim storage capacity.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Source is successfully deleted**

* **Given** a source is in ready or failed state
* **When** I confirm the deletion via the confirmation dialog
* **Then** the source disappears from the source panel
* And workspace storage percentage and file count update immediately
* And if the deleted source was the only selected source, the system auto-selects a remaining source

#### **Scenario 2: Delete action blocked during active processing**

* **Given** a source is being processed (status shown as fetching, uploading, pending, or indexing)
* **When** I view that source in the source panel
* **Then** the delete action is not available for that source

#### **Scenario 3: Deletion fails**

* **Given** I confirm the deletion of a source in ready or failed state
* **When** the deletion fails
* **Then** the source remains fully visible and unchanged in the source panel
* And I can retry the deletion

#### **Scenario 4: Deletion partially completes**

* **Given** I confirm the deletion of a source
* **When** the deletion partially completes
* **Then** the source is no longer queryable but remains visible in the source panel in an error state
* And I can retry the deletion after a short cooldown, up to a limited number of attempts
* And if all retries fail, the delete action is locked and I am informed that support is needed to resolve it

### **Requirements:**

**1. Deletion Pipeline**

1. Deletion executes Gemini removal before S3 removal. If Gemini fails, abort with no S3 touch. If Gemini succeeds and S3 fails after all retries, the source transitions to `pending_cleanup`. The source registry row is always soft-deleted only.
2. Delete action is blocked (never queued) for non-terminal states.
3. Automatic backend S3 retry policy before transitioning to `pending_cleanup` is engineering's decision. User-facing retries follow the policy defined above.

**2. Partial Failure & Recovery**

1. For sources in `pending_cleanup`: user may trigger up to 3 manual S3 retry attempts, 30 seconds apart. If all 3 fail, the source is locked and recovery requires ops intervention (admin force-delete).
2. When a source enters `pending_cleanup`, a structured log entry is written for ops visibility.
3. The source panel clearly communicates to the user that the source is no longer queryable.

**3. User Experience**

1. Confirmation dialog uses locked copy confirming the deletion is permanent and cannot be undone.
2. On successful deletion, display a success toast notification.
3. Auto-selection after deletion follows the source selection rules defined in the Source Panel story.

**4. Access Control**

1. Delete action available to Owner, Super Admin, Bot Admin, and App Manager only. Editor sees no delete control on source cards. Add, preview, and query remain open to all 5 default roles.

**5. Audit & Events**

1. Logs Manager entry on successful deletion (both Gemini and S3 confirmed): Section "Knowledge Base", Description "ID {source_id} {actor_name} Deleted {display_name} Source", Type badge "Delete", Created By the authenticated user.
2. **Events fired:** `Source Delete Initiated` (on confirmation), `Source Deleted` (happy path completion), `Source Delete Failed` (Scenario 3), `Source Delete Retry` - Scenario 4 (user-initiated S3 retry)

---

## US-006: Chat with Citations, Memory, and Reset

**Epic:** Chat and Memory | **[R1]**
**Gemini API Reference:** [Gemini Generate Content - Grounding Metadata](https://ai.google.dev/gemini-api/docs/file-search#structured-output "https://ai.google.dev/gemini-api/docs/file-search#structured-output")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** my queries grounded by indexed sources with visible citations, in a persistent conversation that warns me when context is getting long and lets me reset when needed,
**So that** I can verify AI accuracy against my sources and stay productive across long research sessions.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Query streams with citation markers**

* **Given** I have at least one ready source selected
* **When** I submit a query
* **Then** the response streams to completion, with first content appearing immediately
* And numbered citation markers appear at grounded positions in the completed text
* And the query and response are appended to my persistent conversation history

#### **Scenario 2: Citation panel shows source details and text snippet**

* **Given** a response contains citation markers
* **When** I select a citation marker
* **Then** a panel opens showing the source name, type, upload date, status, tags, and the excerpt from that source
* And if the source still exists, its current status and tags are fetched live to reflect any changes since the response was saved
* And if the source has been deleted, the panel shows the stored snapshot with a note that the source is no longer available

#### **Scenario 3: Conversation history persists across sessions**

* **Given** I have had multiple exchanges in the KB chat
* **When** I navigate away and return to the Knowledge Base
* **Then** my full conversation history is restored and I can continue immediately

#### **Scenario 4: AI service failure or streaming interruption**

* **Given** I have at least one ready source selected
* **When** I submit a query and the AI service returns an error, becomes unavailable, or the stream is interrupted mid-delivery
* **Then** any content already received is shown as-is with an error indicator
* And a retry option is available
* And my existing conversation history remains intact
* And the partial response received so far is saved to conversation history as-is

#### **Scenario 5: Session approaching memory limit (80% warning)**

* **Given** I have an active KB chat session
* **When** the session context is getting long
* **Then** a persistent, non-blocking notice appears indicating the conversation is getting long and response quality may be affected
* And I can continue submitting queries
* And the notice includes a reset option

#### Scenario 6: Full response delivered before ceiling is enforced

* **Given** my session has not yet reached its memory limit
* **When** I submit a query and the response pushes the session over its limit
* **Then** the full response is delivered
* And the chat input is disabled with a prompt to reset the session

#### Scenario 7: Query blocked when ceiling already reached

* **Given** my session has already reached its memory limit
* **When** I attempt to submit a query
* **Then** the query is not submitted
* And the chat input remains disabled with a prompt to reset the session

#### **Scenario 8: Reset starts a fresh conversation**

* **Given** the reset option is available (either voluntarily or after reaching the session limit)
* **When** I confirm the reset
* **Then** my conversation history is cleared from the chat view
* And a fresh conversation begins immediately with the chat input active
* And all selected sources remain selected and queryable
* And the session context is fresh with no prior conversation loaded

#### **Scenario 9: Reset fails with retry**

* **Given** I trigger a reset
* **When** the reset operation fails
* **Then** an error with retry option appears
* And my existing conversation history and session state remain intact

#### **Scenario 10: Workspace KB token quota exhausted blocks all querying**

* **Given** my workspace's KB token quota has been fully exhausted
* **When** I attempt to submit a query
* **Then** the query is blocked before being sent with an upgrade prompt
* And resetting the session does not restore querying ability

### **Requirements:**

**1. Query Execution & Isolation**

1. Every query includes the workspace identifier as a metadata filter from auth context only. A query from Workspace A never returns Workspace B content.
2. The chat input is disabled from the moment a query is submitted until the full response is received or an error is returned. The user cannot submit a second query while a response is streaming.
3. Queries are scoped to the user's currently selected sources.
4. Concurrent queries from the same session are serialized at the service layer to prevent token-count race conditions.
5. KB in-app chat always uses streaming. This is fixed, not user-configurable. The AI Stack streaming setting applies to channels only.
6. Prompt assembly: Layer 1 (System Instructions) + `{{feature_context_chat}}` ([AQL - Knowledge Base System Instructions Prompts](https://widebot.atlassian.net/wiki/x/AQBlx "https://widebot.atlassian.net/wiki/x/AQBlx") Section A). No `{{user_context}}` for in-app chat.

**2. Session Ceiling & Quota Enforcement**

1. Session ceiling: 700,000 tokens. Post-response enforcement: queries submitted below the ceiling always go through; blocking only applies if the ceiling was already reached before the query. Both states disable chat input with a reset prompt.
2. Warning threshold: the notice appears when cumulative session tokens cross 80% of the 700,000 token ceiling. Qualitative language only — no counts, percentages, or raw numbers shown to the user. The warning is persistent and non-blocking, using natural language only (e.g., "This chat is getting long. Consider resetting to maintain response quality.").
3. Pre-request check order: (1) workspace quota check — if depleted, block with upgrade prompt; (2) session ceiling check — if at or above 700K from a prior response, block with reset prompt. Both checks, including token counting against the session ceiling, run before every generation call.

**3. Citations & Grounding**

1. Gemini does not guarantee grounding data on every response. When absent, citations are stored as null and the response renders with no citation markers. No special UI treatment needed. Never fabricate citations.
2. Citation data (chunk text, source name, type, upload date, status, tags snapshot) is stored in the session at response write time, not fetched live. The panel always loads from stored data.
3. If the source still exists at panel render time, current status and tags are fetched to supplement the snapshot. If deleted, the stored snapshot renders with a "source no longer available" note.
4. **Workspace verification:** After every response, the document identifier is extracted from the `uri` field in each grounding chunk's `RetrievedContext` and resolved against the source registry, where the Gemini document ID-to-workspace mapping is stored at upload time. Any chunk with a mismatched or absent workspace identifier is stripped before the response is returned. A server-side failure event is logged. This is a P0 guardrail: failure rate above 0% is a P0 incident. QA must verify:
   1. mismatched chunks are never surfaced
   2. the log event fires on mismatch
   3. valid chunks pass through as-is.

**4. Session Management**

1. Reset: create a new session for the same user + KB with token count at zero. Old session and messages remain in the database. Old messages are excluded from the chat view.
2. Reset confirmation clearly states conversation history will be cleared.
3. Chat input becomes active immediately after reset without page reload.
4. Reset affects conversation history only. Sources, selection state, and indexed content are unaffected.
5. Sessions are server-managed. All tabs and devices for the same user reflect the same state. Reset in one tab is immediately reflected everywhere.

**5. Rate Limiting & Caching**

1. Per-workspace rate limiting follows [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits "https://ai.google.dev/gemini-api/docs/rate-limits"). Failures degrade gracefully with an inline error and retry option.
2. Query deduplication within a short window may be served from [Gemini&#39;s caching infrastructure](https://ai.google.dev/gemini-api/docs/caching "https://ai.google.dev/gemini-api/docs/caching").

**6. Activity Tracking**

21. **Activity tracking at response write time:** Two fire-and-forget updates run:
    1. last-referenced timestamp updated for each cited source
    2. last RAG activity timestamp updated for the workspace.
    3. Both non-blocking. When no grounding data is present, the workspace timestamp is still updated but no source timestamps are. These timestamps are the sole input for a later user story. QA must verify both timestamps reflect the most recent response time.
22. Activity tracking and workspace verification apply to both in-app KB chat and channel sessions.

**Non-Functional Requirements**

23. Reset under 500ms. E2E response time < 5s p95. TTFT for streaming < 2s p95.

**Logging & Events**

24. Every query produces a structured server-side log event including token fields, citation presence, chunks retrieved, and channel source.
25. **Events fired:** `Chat Input Focused`, `Chat Query Submitted`, `Chat Response Received`, `Citation Clicked`, `Citation Panel Opened`, `Session Memory Warning Shown`, `Session Ceiling Block Shown`, `Chat Session Reset`. Server-side: workspace verification failure event (on mismatch only).

---

## US-007: Source Tagging at Upload

**Epic:** Source Management | **[R2]**
**Gemini API Reference:** [Gemini Documents - Custom Metadata](https://ai.google.dev/api/file-search/documents#CustomMetadata "https://ai.google.dev/api/file-search/documents#CustomMetadata")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** to attach descriptive tags to sources at upload time,
**So that** I can organize my content meaningfully from the start and build a structured metadata foundation for my sources.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Tagging a source during upload**

* **Given** I am adding a new source to the KB
* **When** I add custom key-value tags (e.g., `department: strategy`, `quarter: Q3`) before confirming
* **Then** the tags are saved with the source and visible on the source card

#### **Scenario 2: Exceeding the 10-tag limit**

* **Given** I am adding tags during upload
* **When** I attempt to add an 11th tag
* **Then** the additional tag is rejected and my existing 10 tags remain intact

#### **Scenario 3: Duplicate tag key within same source**

* **Given** I am adding tags during upload
* **When** I add a second tag with the same key as an existing tag
* **Then** the duplicate key is rejected, the original tag remains unchanged, and an inline error is shown

#### **Scenario 4: Tags are locked after upload**

* **Given** a source has been successfully uploaded with tags
* **When** I view the source card
* **Then** the tags are displayed but no edit option is available

### **Requirements:**

**1. Tag Structure & Validation**

1. Each tag is a key-value pair. Both key and value are free-text strings.
2. **Tag validation:** Empty strings rejected after trim. Key max 256 chars, value max 2,048 chars. Character limits enforced client-side by preventing input beyond the maximum length. Empty values block submission with an inline prompt.
3. Maximum 10 user-defined tags per source. Gemini allows 20 metadata slots: 2 platform + 10 user + 8 reserved.
4. Tag keys must be unique within a single source.
5. Tags are optional. Sources work identically with or without them.

**2. Behavior & Immutability**

1. Tags are immutable after creation. Editing tags requires delete + re-upload (future phase).
2. A visible notice warns the user that tags cannot be edited after upload, displayed in the tag input before confirming.
3. Tags apply to both file and URL source types.
4. If Gemini indexing fails, the source enters failed state with tags preserved.
5. Recovery is delete + re-upload; the user re-enters tags in the new upload form.

**3. Gemini Integration**

1. Tags are sent to Gemini as metadata for faster, more targeted retrieval.
2. Tags are available for [metadata-based query filtering](https://ai.google.dev/api/file-search/documents#rest-resource:-filesearchstores.documents "https://ai.google.dev/api/file-search/documents#rest-resource:-filesearchstores.documents") at query time. Not exposed to users at launch; data foundation ships now.

**4. Events**

1. **Events fired:** `Source Tag Added` - fired once per source upload when at least one tag is submitted.

---

## US-008: URL Ingestion with Error Handling

**Epic:** Source Management | **[R2]**
**Gemini API Reference:** [Gemini File Search - Rate Limits](https://ai.google.dev/gemini-api/docs/file-search#rate-limits "https://ai.google.dev/gemini-api/docs/file-search#rate-limits")
**Gemini API Reference:** [Gemini Usage Tiers - Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits#usage-tiers "https://ai.google.dev/gemini-api/docs/rate-limits#usage-tiers")
**URL Fetcher Reference:** [Jina Reader API](https://jina.ai/reader/ "https://jina.ai/reader/")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** to add web pages as sources,
**So that** I can query external content alongside my uploaded files.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Successful URL ingestion with tagging**

* **Given** I have a publicly accessible URL
* **When** I submit the URL with optional tags
* **Then** I see the source progress through its processing stages until it becomes available
* And the source appears with the page title as its display name, and is immediately queryable once ready

#### **Scenario 2: URL ingestion fails with a permanent error**

* **Given** a URL that is unreachable, blocked, requires authentication, contains no readable content, or the extracted content exceeds the size limit
* **When** I submit it as a source
* **Then** the source shows an error with a message identifying the specific failure reason, with a retry option

#### **Scenario 3: URL ingestion fails with a transient error**

* **Given** a URL that cannot be processed due to a transient error or timeout
* **When** I submit it as a source
* **Then** the source shows an error with the relevant transient failure message, a retry option, and no impact on other sources in the workspace

#### **Scenario 4: URL rejected because it already exists**

* **Given** a URL has already been added as a source in this workspace
* **When** I submit the same URL again
* **Then** the submission is rejected with an error indicating the URL already exists.

### **Requirements:**

**1. Validation & Limits**

1. **Client-side URL validation:** Malformed URLs rejected before submission. Server-side remains authoritative.
2. **URL uniqueness:** Raw URL is the uniqueness key per workspace against active records. Soft-deleted URLs can be re-added.
3. URL sources count toward workspace file count limit. File count pre-check runs before fetching begins. After fetching, the extracted content is saved to S3 as .md. The S3 file size is validated before indexing; content exceeding the file size limit fails with `url_content_too_large` and the S3 file is deleted. Storage cap is evaluated at indexing completion using the Gemini-confirmed size, consistent with file upload behavior.
4. URL submission is single-URL only at launch. Batch URL submission is deferred.

**2. Ingestion Pipeline**

1. The URL fetcher (currently Jina Reader) is behind an abstraction layer, making the provider swappable.
2. The full flow (fetch, save to S3, submit to Gemini, index) completes without user intervention.
3. URL sources enter the same per-workspace processing queue as file uploads. The fetch step occurs before the source enters the queue; S3 save and Gemini indexing are queued.
4. Extracted markdown saved as .md to S3 for preview and download. Original URL remains clickable.
5. **Timeout:** 60 seconds platform-side HTTP client timeout. If no response, fail with `url_fetch_timeout`.
6. Jina returns HTTP 200 even for error pages, with the actual error in response fields. Backend must inspect both the HTTP status and the warning field in the response. See [Jina Reader API](https://jina.ai/reader/ "https://jina.ai/reader/") for details.
7. Queue resilience (restart survival, client disconnect) and sequential processing guarantees from the file upload story apply identically to URL sources.

**3. Display & Metadata**

1. Display name defaults to page title. Fallback: the raw URL.
2. URL-specific status flow: fetching -> uploading -> pending -> indexing -> ready or failed. Platform status labels are localizable.
3. Source tags apply at submission time. Same rules: up to 10, immutable, sent to Gemini as metadata.

**4. QA Error Mapping Table:**

| Platform Error Code         | Jina HTTP                                                                                                        | Jina Status                                                                                                      | Jina Response Pattern                         | User-Facing Message                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `url_page_not_found`      | 200                                                                                                              | 20000                                                                                                            | `data.warning`contains "returned error 404" | Page not found (404). Check the URL and try again.                                                                        |
| `url_page_blocked`        | 200                                                                                                              | 20000                                                                                                            | `data.warning`contains "returned error 403" | This page could not be accessed. It may be blocked or behind a firewall.                                                  |
| `url_no_content  `        | 200                                                                                                              | 20000                                                                                                            | `data.content`empty or < 50 chars           | No readable content could be extracted from this page. JavaScript-heavy or dynamically loaded pages may not be supported. |
| `url_auth_required`       | 422                                                                                                              | 42206                                                                                                            | Standard 422 response                         | This page requires login or a subscription. Only publicly accessible pages are supported.                                 |
| `url_rate_limited`        | 429                                                                                                              | *`<span data-testid="renderer-code-block-line-1" data-ds--code--row="" class=""><span class=""></span></span>` | Standard 429                                  | Too many requests. Please try again in a moment.                                                                          |
| `url_fetch_timeout`       | *`<span data-testid="renderer-code-block-line-1" data-ds--code--row="" class=""><span class=""></span></span>` | *`<span data-testid="renderer-code-block-line-1" data-ds--code--row="" class=""><span class=""></span></span>` | No response within 60s                        | The page took too long to load. Try again or use a different URL.                                                         |
| `url_service_unavailable` | 503                                                                                                              | *`<span data-testid="renderer-code-block-line-1" data-ds--code--row="" class=""><span class=""></span></span>` | Jina service error                            | Our URL processing service is temporarily unavailable. Please try again shortly.                                          |
| `url_content_too_large`   | 200                                                                                                              | 20000                                                                                                            | Extracted markdown > 10 MB                    | The extracted content from this URL exceeds the 10 MB file size limit.                                                    |

* **Events fired:** `Source URL Initiated`, `Source URL Completed`, `Source URL Failed`, `Source Indexed`, `Source Index Failed`

---

## US-009: Source Preview

**Epic:** Source Management | **[R2]**
**Gemini API Reference:** [Gemini File Search - List Documents](https://ai.google.dev/api/file-search/documents#method:-filesearchstores.documents.list "https://ai.google.dev/api/file-search/documents#method:-filesearchstores.documents.list")

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** to preview and download source content within the Knowledge Base,
**So that** I can verify what was indexed and access it outside the platform.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Preview a source**

* **Given** I have a source in ready status
* **When** I trigger the preview action
* **Then** the source content is rendered in the preview panel

#### **Scenario 2: Download a source**

* **Given** I have a source in ready status
* **When** I trigger the download action
* **Then** the source content is downloaded to my device

#### **Scenario 3: Failed source shows failure reason instead of preview**

* **Given** I have a source in failed status
* **When** I view the source in the panel
* **Then** I see the failure reason and a retry option instead of preview or download actions

#### **Scenario 4: Source content loads but cannot be rendered**

* **Given** I have a ready source whose content cannot be rendered in the browser
* **When** I trigger the preview action
* **Then** I see a fallback message with a download link

#### **Scenario 5: Source content cannot be loaded**

* **Given** I have a ready source whose content fails to load
* **When** I trigger the preview action
* **Then** I see a preview unavailable indicator
* And the source's indexing status and queryability are unaffected

#### **Scenario 6: Preview a URL source**

* **Given** I have a URL source in ready status
* **When** I trigger the preview action
* **Then** I see the extracted content rendered as formatted markdown with the date the source was added
* And the original URL is clickable and opens in a new tab

### **Requirements:**

**1. Preview Rendering**

1. Browser-natively renderable types (PDF, plain text, HTML, markdown) render inline. Text-based types (code files, JSON, XML, CSV, TSV, YAML) display as raw text. Binary document types (DOCX, XLSX, PPTX) display the fallback message with a download link.
2. **URL preview:** Renders extracted .md as formatted markdown with the date the source was added to the Knowledge Base. Original URL is clickable and opens in a new tab.

**2. Availability & Access**

1. The preview action is only available for sources in ready status. Sources in failed status display their failure reason and a retry option instead.
2. Download action follows the same availability rules and role access as preview.

**3. Error Handling**

1. If content loads but cannot be rendered, a fallback message with a download link is shown.
2. If content cannot be loaded at all, a "preview unavailable" indicator is shown. Source record, indexing status, and queryability are unaffected.

**4. Download**

1. File sources download the original file. URL sources download the extracted content as a .md file.

**5. Events**

1. **Events fired:** `Source Preview Opened`, `Source Downloaded`

---

## US-010: AI Stacks, Channel Routing, and Token Reporting

**Epic:** Platform Integration | **[R3]**
**Gemini API Reference:** [Gemini File Search - Query](https://ai.google.dev/api/generate-content "https://ai.google.dev/api/generate-content")

### **STORY**

**As a** workspace member with access to settings,
**I want** to enable the Knowledge Base stack across my workspace's channels and track how tokens are consumed,
**So that** my channels answer from indexed sources and I can manage usage against my plan limits.

### **ACCEPTANCE CRITERIA**

**Scenario 1: Enabling the KB stack auto-connects all channels**

* **Given** my workspace has at least one enabled communication channel
* **When** I enable the "Knowledge Base" stack in Settings -> Conversational AI Models
* **Then** all currently enabled channels route queries through the Knowledge Base stack
* And any channel enabled afterwards inherits it automatically

#### **Scenario 2: Non-admin cannot enable or disable the KB stack**

* **Given** I am a workspace member without Owner or Admin role
* **When** I access the Conversational AI Models settings
* **Then** I can view the KB stack configuration but cannot enable or disable it

#### **Scenario 3: Platform prompt is hidden; custom prompt is user-configurable**

* **Given** I have enabled the KB stack
* **When** I configure the custom system prompt
* **Then** the custom prompt takes effect for all channel responses
* And the platform-level prompt is not visible or editable in the settings UI

#### **Scenario 4: Channel query with no ready sources uses customer context**

* **Given** no sources are available to query and workspace customer context is configured
* **When** a channel user sends a query
* **Then** the model uses the workspace customer context to respond without drawing on the Knowledge Base

#### **Scenario 5: Channel query with no sources and no customer context**

* **Given** no sources are available to query and no workspace customer context is configured
* **When** a channel user sends a query
* **Then** the model responds using only its base instructions without drawing on KB sources or workspace context

#### **Scenario 6: Channel stops receiving replies when token quota is depleted**

* **Given** the workspace KB token quota has been fully exhausted
* **When** a channel user sends a query
* **Then** the platform does not send any response to the channel
* And source management in the KB panel remains functional

#### **Scenario 7: Disabling the KB stack reverts channels to the fallback**

* **Given** the KB stack is active and channels are using it
* **When** I disable it
* **Then** any in-flight queries at the time of disabling complete against the KB stack
* And subsequent queries route to the previously active stack configuration

#### **Scenario 8: Disabling KB with no fallback leaves channels without AI responses**

* **Given** the KB stack is active and no other stack was previously configured
* **When** I disable it
* **Then** channels no longer receive AI responses until a new stack is configured

#### **Scenario 9: Token reporting table shows workspace usage**

* **Given** I access the token reporting table (Settings -> Subscription -> Billing -> AI Services)
* **When** I view the table
* **Then** I see KB token consumption, storage usage, and file count at workspace level

### **Requirements**

**1. Stack Configuration**

1. One new stack: "Knowledge Base" in Settings -> Conversational AI Models. Supports streaming and non-streaming ([structured outputs](https://ai.google.dev/gemini-api/docs/structured-output?example=recipe "https://ai.google.dev/gemini-api/docs/structured-output?example=recipe") for non-streaming), determined per channel capability at routing time.
2. At launch, enabling the KB stack auto-connects all enabled channels. Per-channel opt-out is deferred to a future phase.
3. Only Owner and Admin can enable or disable the KB stack.

**2. Prompts**

1. Each stack has two prompts: a platform prompt (hidden, assembled server-side from `{{feature_context_stack}}` + `{{user_context}}`) and a custom prompt (visible, user-editable). The platform prompt is always prepended server-side and takes precedence over any custom prompt. Custom prompts cannot override or modify the platform prompt.

**3. Channel Query Behavior**

1. Every channel query includes the workspace identifier bot id as a metadata filter from auth context.
2. Channel citations: Citation panels are KB in-app chat only at launch. A single system prompt is used for all channel types. Citation generation is not visible to the customer for all meta channel sessions at launch.

**4. Token Quota & Usage**

1. Token usage from channel queries is captured and accumulated at workspace level.
2. Token tracking for channel sessions follows the same schema as in-app chat.
3. Token quota warning states (80% and 100%) are covered before with in-app chat; verify both thresholds still display correctly when quota is depleted during channel usage.
4. Channel silent failure rationale: When token quota is depleted, channels receive no response because:
   1. Any response consumes channel delivery costs
   2. Generic errors are not actionable for end users
   3. Workspace admins have the system-wide depletion banner.
   4. A future phase may add a pre-composed static message.
5. Inbound channel messages received while the token quota is depleted are logged for auditability.

**5. Token Reporting**

1. Reporting table located at Settings -> Subscription -> Billing -> AI Services. Access open to all 5 default KB roles. Total token count is the single metric against the workspace token limit. All fields summed.
2. Tokens displayed as consumed vs quota in X/Y format, storage as percentage consumed, file count as absolute X/Y. Token reporting table must render its full structure in the empty state (0 / Y) and show a generic error with retry on data failure.
3. Data freshness: Reflects latest state on page load. No live streaming. Freshness granularity is engineering's decision.
4. Filters are eferred to a future phase.

**6. Disable & Fallback**

1. If no previously active stack exists when KB is disabled, channels receive no AI responses until another stack is configured.
2. In-flight queries complete against the KB stack before rerouting; subsequent queries route to the fallback.

**7. Audit & Events**

1. **Events fired:** `KB Stack Enabled`, `KB Stack Disabled`, `Token Report Viewed`
2. Logs Manager entry on stack toggle: Section "Knowledge Base", Description "{actor_name} Enabled/Disabled Knowledge Base Stack", Type badge "Update", Created By the authenticated Owner or Admin.

---

## US-011: Token-Based Summarization

**Epic:** Platform Integration | **[R3]**

### **STORY**

**When** a channel session's cumulative token count reaches the workspace's configured summarization threshold,
**the system needs** to summarize accumulated conversation history and replace it with a compact representation,
**So that** channel context quality is maintained within token limits without requiring user intervention.

### **ACCEPTANCE CRITERIA**

#### Scenario 1: Summarization when channel session exceeds the threshold

* **Given** a channel session whose token count has reached the workspace's summarization threshold
* **When** the next channel query is received
* **Then** the session's active context contains exactly one summary representing the compressed history
* And the query is processed against the summary and any turns that follow it
* And the full history prior to the summary is no longer part of the active context

#### Scenario 2: Re-summarization of a previously summarized session

* **Given** a previously summarized session grows to reach the summarization threshold again
* **When** the next query is received
* **Then** a new summary is generated from the previous summary plus subsequent turns
* And the new summary replaces the old one in the active context

#### **Scenario 3: Summarization uses the workspace-configured model when available**

* **Given** a workspace has a custom summarization model configured
* **When** summarization is needed
* **Then** the configured model is used; otherwise the platform default applies

#### Scenario 4: Summarization fails after retry exhaustion

* **Given** a channel session reaches the summarization threshold and the workspace has sufficient token quota
* **When** the summarization call fails after all retry attempts are exhausted
* **Then** no summary is created
* And the channel session continues without compression
* And summarization is not re-attempted until the next query after a configured cooldown period

#### Scenario 5: Summarization skipped due to insufficient quota

* **Given** summarization is needed and the workspace token quota is below the minimum required for summarization
* **When** the next query is received
* **Then** summarization is not attempted
* And the session continues without compression

### **ADDITIONAL REQUIREMENTS**

**1. Scope**

1. This is a NEW feature independent from the existing message-count-based summarizer. Different trigger (token-count), different provider (configurable). Two independent systems.
2. Summarization applies to CHANNEL SESSIONS ONLY. KB in-app chat is excluded.

**2. Summarization Behavior**

1. Only one active summary per session at any time.
2. The summary preserves: original question context, key answers and decisions, workspace-specific details.
3. Replaced summaries and raw messages replaced by a summary are retained for audit but excluded from active context.
4. After retry exhaustion, summarization enters a cooldown (configurable, default: 1 minute). During cooldown, queries proceed without summarization attempts. The cooldown resets on the next query after it expires.
5. Summarization executes synchronously before the triggering query is processed. The user may experience increased response time on the turn that triggers summarization.

**3. Configuration**

1. Summarization threshold is configurable per workspace via Stripe plan metadata. Default: 50K tokens.
2. Default summarization model is Gemini 2.5 Flash when `kb_summarization_model` is not configured. Overridable per workspace to Claude Sonnet 4.6 via Stripe.
3. Summarization model configured via dedicated Stripe key: `kb_summarization_model`. Separate from `kb_model` (generation). Never reuse the same key.
4. The summarization call is a plain completion API call with no File Search tool. Non-Gemini models (e.g., Sonnet 4.6) are valid.

**4. Token Quota**

1. Summarization token usage counts against workspace GenAI token quota.
2. Quota is validated before attempting the summarization API call. Minimum required quota for a summarization attempt is 50K tokens.
3. Quota-depleted alerts include a call-to-action to upgrade the workspace plan. Follows existing KB notification system pattern (dismissable alert at 80% quota usage).

**5. Dependencies**

1. **Summarization prompt (OQ-012):** Dedicated prompt defining output size, compression strategy, and re-summarization behavior. Product and Engineering co-design. Blocking for quality, not plumbing.

**Tracking**

| Event                              | Type   | Trigger                      |
| ---------------------------------- | ------ | ---------------------------- |
| `summarization_started`          | Server | Summarization call initiated |
| `summarization_completed`        | Server | Summary successfully written |
| `summarization_failed`           | Server | All retries exhausted        |
| `quota_depleted_alert_shown`     | Client | Alert displayed to user      |
| `quota_depleted_alert_dismissed` | Client | User dismisses alert         |
| `quota_upgrade_cta_clicked`      | Client | User clicks upgrade CTA      |

---

## US-012: Data Retention and Expiry Policy

**Epic:** Knowledge Base Foundation | **[R3]**

### **STORY**

**As a** workspace member with Knowledge Base access,
**I want** advance warnings and a defined grace period before my sources are archived due to plan expiry or prolonged inactivity, with the ability to reactivate them afterward,
**So that** I can act before archival happens or recover my sources without re-uploading.

### **ACCEPTANCE CRITERIA**

#### **Scenario 1: Either retention trigger initiates the same warning sequence**

* **Given** my workspace subscription has expired or been cancelled, or no user or channel has queried the Knowledge Base for ta prolonged period
* **When** the grace period begins
* **Then** a persistent warning appears to all workspace users stating the archival date and the action needed to prevent it
* And a final reminder appears as the archival date approaches

#### **Scenario 2: Renewing subscription cancels the expiry countdown**

* **Given** the warning sequence is active due to plan expiry
* **When** the subscription is renewed
* **Then** all warnings are dismissed, the grace period is cancelled, and all sources remain in their current state

#### **Scenario 3: Resuming KB activity cancels the inactivity countdown**

* **Given** the warning sequence is active due to prolonged inactivity
* **When** any KB user or channel user submits a Knowledge Base query
* **Then** all warnings are dismissed, the grace period is cancelled, and all sources remain in their current state

#### **Scenario 4: Both archival triggers active simultaneously**

* **Given** both a plan expiry and an inactivity countdown are active with different timelines
* **When** the system evaluates the grace period
* **Then** warnings reflect the earlier archival date
* And resolving one trigger cancels only that trigger's countdown; the other remains active independently
* And if the resolved trigger had the earlier archival date, warnings update to reflect the remaining trigger's timeline

#### **Scenario 5: Sources are archived when the grace period ends without action**

* **Given** the grace period has ended with no qualifying action taken
* **When** the archival process runs
* **Then** each source transitions to an archived status with a timestamp
* And archived sources are excluded from all query results
* And workspace storage recalculates from remaining active sources
* And archived sources still count toward the file count limit

#### **Scenario 6: Reactivating an archived source restores it for querying**

* **Given** an archived source exists and all active triggering conditions have been resolved
* **When** I initiate reactivation
* **Then** the source is re-indexed until it reaches ready or failed
* And a successfully reactivated source becomes queryable again and is included in storage calculations

#### **Scenario 7: Chat is disabled when all sources are archived**

* **Given** all workspace sources have been archived
* **When** I open the Knowledge Base
* **Then** chat is disabled and I am guided to reactivate sources or upload new ones

### **Requirements**

**1. Triggers & Configuration**

1. Two independent triggers, each controlled by a Stripe metadata key per plan: plan expiry grace period (`retention_grace_days`) and inactivity threshold (`inactivity_threshold_days`).
2. Inactivity trigger tracks `last_kb_activity_at`. Knowledge Base queries reset it. Background cron for detection.

**2. Warnings**

1. Two-stage warning cadence: first warning at grace period start, final reminder at the interval configured per plan (`retention_final_warning_days`). All warning and grace period intervals are Stripe metadata keys. Visible during active sessions only. Email notifications deferred.
2. The KB remains fully operational during the warning countdown. Archival fires only after the grace period ends with no qualifying action.

**3. Archival Process**

1. **Archival, not deletion:** Archival removes the Gemini index only. S3 file is retained for reactivation.
2. Sources are archived one at a time to prevent partial-failure cascading.
3. **Retry escalation:** 3 retries at 1-hour intervals, then next day, then 3 days later. Failed sources flagged with system tag for tech review.

**4. Archived State & Retention**

1. `archived` status: New enum value. `archived_at` timestamp set. Visible in panel with indicator, not queryable, not selectable.
2. **File count after archival:** Archived sources remain visible and count toward the file count limit. Storage percentage excludes them (Gemini index removed, no `sizeBytes`). Users must manually delete or reactivate.
3. Archived sources are retained indefinitely.
4. Qualifying actions that cancel a grace period: subscription renewal (plan expiry trigger), any Knowledge Base query by a user or channel (inactivity trigger).

**5. Reactivation**

1. Available to users with Knowledge Base access. Submits S3 file to Gemini via standard indexing pipeline. Available only when no active archival countdown remains for the workspace; if both triggers were active, both must be resolved. archived_at timestamp cleared on successful reactivation.
2. Reactivation happens to each source at a time, no batch or bulk processing

**6. Audit & Events**

1. Logs Manager entry on each source expiry: Section "Knowledge Base", Description "ID {source_id} System Expired {display_name} Source", Type badge "Expired", Created By "System".
2. Logs Manager entry on successful reactivation: Section "Knowledge Base", Description "ID {source_id} {actor_name} Reactivated {display_name} Source", Type badge "Reactivated", Created By the authenticated user.
3. **Events fired** : `Retention Warning Shown`, `Source Archived`, `Source Reactivated`, `Retention Reactivation Triggered`
