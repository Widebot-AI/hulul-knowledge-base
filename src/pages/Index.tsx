import { KBProvider, useKB } from "@/components/wireframes/KBContext";
import { AppShell } from "@/components/wireframes/AppShell";
import { ActivationScreen } from "@/components/wireframes/ActivationScreen";
import { NoAccessScreen } from "@/components/wireframes/NoAccessScreen";
import { KBMainInterface } from "@/components/wireframes/KBMainInterface";
import { AddSourceModal } from "@/components/wireframes/AddSourceModal";
import { DeleteConfirmDialog } from "@/components/wireframes/DeleteConfirmDialog";
import { SourcePreviewPanel } from "@/components/wireframes/SourcePreviewPanel";
import { StackSettingsScreen } from "@/components/wireframes/StackSettingsScreen";
import { TokenReportingScreen } from "@/components/wireframes/TokenReportingScreen";
import { RetentionWarningScreen } from "@/components/wireframes/RetentionWarningScreen";
import { UploadValidationScreen } from "@/components/wireframes/UploadValidationScreen";
import { UploadPipelineScreen } from "@/components/wireframes/UploadPipelineScreen";
import { StoreCapacityScreen } from "@/components/wireframes/StoreCapacityScreen";
import { PlanLimitWarningsScreen } from "@/components/wireframes/PlanLimitWarningsScreen";
import { SourceSelectionScreen } from "@/components/wireframes/SourceSelectionScreen";
import { PlanDataLoadingScreen } from "@/components/wireframes/PlanDataLoadingScreen";
import { DeletionStatesScreen } from "@/components/wireframes/DeletionStatesScreen";
import { ChatErrorStatesScreen } from "@/components/wireframes/ChatErrorStatesScreen";
import { TokenQuotaScreen } from "@/components/wireframes/TokenQuotaScreen";
import { CitationEdgeCasesScreen } from "@/components/wireframes/CitationEdgeCasesScreen";
import { UploadTaggingScreen } from "@/components/wireframes/UploadTaggingScreen";
import { UrlIngestionScreen } from "@/components/wireframes/UrlIngestionScreen";
import { SourcePreviewStatesScreen } from "@/components/wireframes/SourcePreviewStatesScreen";
import { ChannelQueryStatesScreen } from "@/components/wireframes/ChannelQueryStatesScreen";

export type Screen =
  | "activation"
  | "activation-error"
  | "no-access"
  | "kb-main"
  // Upload & Validation
  | "upload-val-unsupported"
  | "upload-val-too-large"
  | "upload-val-duplicate"
  | "upload-val-storage-cap"
  | "upload-val-file-limit"
  | "upload-val-batch-mixed"
  | "upload-single-progress"
  | "upload-batch-progress"
  | "upload-processing-fail"
  | "upload-first-ready"
  | "store-exhausted"
  // Source Panel
  | "warn-storage-80"
  | "warn-filecount-80"
  | "warn-token-80"
  | "warn-multi-limit"
  | "warn-storage-100"
  | "warn-filecount-100"
  | "warn-token-depleted"
  | "warn-quota-restored"
  | "select-deselect-blocked"
  | "select-auto-after-delete"
  | "select-no-ready"
  | "plan-loading"
  | "plan-stripe-fail"
  // Deletion
  | "delete-blocked"
  | "delete-failed"
  | "delete-pending-cleanup"
  | "delete-cleanup-locked"
  // Chat & Session
  | "chat-streaming-interrupted"
  | "chat-ai-error"
  | "chat-session-create-fail"
  | "chat-reset-failed"
  | "quota-mid-session"
  | "quota-pre-session"
  | "citation-deleted-source"
  | "citation-no-grounding"
  // Tagging
  | "tag-default"
  | "tag-limit-reached"
  | "tag-duplicate-key"
  | "tag-locked-view"
  // URL Ingestion
  | "url-success"
  | "url-not-found"
  | "url-blocked"
  | "url-no-content"
  | "url-auth-required"
  | "url-rate-limited"
  | "url-timeout"
  | "url-service-unavailable"
  | "url-too-large"
  | "url-duplicate"
  // Preview
  | "preview-pdf"
  | "preview-text"
  | "preview-non-renderable"
  | "preview-load-failure"
  | "preview-url"
  | "preview-failed-source"
  // Settings
  | "stack-settings"
  | "stack-settings-readonly"
  | "stack-custom-prompt"
  | "stack-disable-warning"
  | "stack-no-fallback"
  | "channel-no-sources-context"
  | "channel-no-sources-bare"
  | "channel-quota-depleted"
  // Token Reporting
  | "token-reporting"
  | "token-reporting-empty"
  | "token-reporting-error"
  // Data Retention
  | "retention-warning"
  | "retention-final"
  | "retention-dual"
  | "archived-state"
  | "retention-renewed"
  | "retention-activity-resumed"
  | "retention-reactivation"
  | "retention-reactivation-fail";

const screens: { id: Screen; label: string; group: string }[] = [
  // Onboarding
  { id: "activation", label: "KB Activation Flow", group: "Onboarding" },
  { id: "activation-error", label: "Activation Error", group: "Onboarding" },
  { id: "no-access", label: "No Access", group: "Onboarding" },

  // Main Interface
  { id: "kb-main", label: "KB Main (Interactive)", group: "Main Interface" },

  // Upload & Validation
  { id: "upload-val-unsupported", label: "Unsupported Type", group: "Upload & Validation" },
  { id: "upload-val-too-large", label: "File Too Large", group: "Upload & Validation" },
  { id: "upload-val-duplicate", label: "Duplicate Name", group: "Upload & Validation" },
  { id: "upload-val-storage-cap", label: "Storage Cap Exceeded", group: "Upload & Validation" },
  { id: "upload-val-file-limit", label: "File Limit Exceeded", group: "Upload & Validation" },
  { id: "upload-val-batch-mixed", label: "Batch Mixed Errors", group: "Upload & Validation" },
  { id: "upload-single-progress", label: "Single Upload Progress", group: "Upload & Validation" },
  { id: "upload-batch-progress", label: "Batch Upload Progress", group: "Upload & Validation" },
  { id: "upload-processing-fail", label: "Processing Failure", group: "Upload & Validation" },
  { id: "upload-first-ready", label: "First Source Ready", group: "Upload & Validation" },
  { id: "store-exhausted", label: "Store Capacity Error", group: "Upload & Validation" },

  // Source Panel
  { id: "warn-storage-80", label: "Storage Warning (80%)", group: "Source Panel" },
  { id: "warn-filecount-80", label: "File Count Warning (80%)", group: "Source Panel" },
  { id: "warn-token-80", label: "Token Warning (80%)", group: "Source Panel" },
  { id: "warn-multi-limit", label: "Multi-Limit Warning", group: "Source Panel" },
  { id: "warn-storage-100", label: "Storage Depleted (100%)", group: "Source Panel" },
  { id: "warn-filecount-100", label: "File Count Depleted (100%)", group: "Source Panel" },
  { id: "warn-token-depleted", label: "Token Quota Depleted", group: "Source Panel" },
  { id: "warn-quota-restored", label: "Quota Restored", group: "Source Panel" },
  { id: "select-deselect-blocked", label: "Deselect Blocked", group: "Source Panel" },
  { id: "select-auto-after-delete", label: "Auto-Select After Delete", group: "Source Panel" },
  { id: "select-no-ready", label: "No Ready Sources", group: "Source Panel" },
  { id: "plan-loading", label: "Plan Data Loading", group: "Source Panel" },
  { id: "plan-stripe-fail", label: "Stripe Failure", group: "Source Panel" },

  // Deletion
  { id: "delete-blocked", label: "Delete Blocked (Processing)", group: "Deletion" },
  { id: "delete-failed", label: "Deletion Failed", group: "Deletion" },
  { id: "delete-pending-cleanup", label: "Pending Cleanup", group: "Deletion" },
  { id: "delete-cleanup-locked", label: "Cleanup Locked", group: "Deletion" },

  // Chat & Session
  { id: "chat-streaming-interrupted", label: "Streaming Interrupted", group: "Chat & Session" },
  { id: "chat-ai-error", label: "AI Service Error", group: "Chat & Session" },
  { id: "chat-session-create-fail", label: "Session Creation Failed", group: "Chat & Session" },
  { id: "chat-reset-failed", label: "Reset Failed", group: "Chat & Session" },
  { id: "quota-mid-session", label: "Quota Exhausted (Mid-Session)", group: "Chat & Session" },
  { id: "quota-pre-session", label: "Quota Exhausted (Pre-Session)", group: "Chat & Session" },
  { id: "citation-deleted-source", label: "Citation — Deleted Source", group: "Chat & Session" },
  { id: "citation-no-grounding", label: "Citation — No Grounding", group: "Chat & Session" },

  // Tagging
  { id: "tag-default", label: "Tags During Upload", group: "Tagging" },
  { id: "tag-limit-reached", label: "Tag Limit Reached", group: "Tagging" },
  { id: "tag-duplicate-key", label: "Duplicate Tag Key", group: "Tagging" },
  { id: "tag-locked-view", label: "Tags Locked (Read-Only)", group: "Tagging" },

  // URL Ingestion
  { id: "url-success", label: "URL Success (Fetching)", group: "URL Ingestion" },
  { id: "url-not-found", label: "URL — Not Found", group: "URL Ingestion" },
  { id: "url-blocked", label: "URL — Blocked", group: "URL Ingestion" },
  { id: "url-no-content", label: "URL — No Content", group: "URL Ingestion" },
  { id: "url-auth-required", label: "URL — Auth Required", group: "URL Ingestion" },
  { id: "url-rate-limited", label: "URL — Rate Limited", group: "URL Ingestion" },
  { id: "url-timeout", label: "URL — Timeout", group: "URL Ingestion" },
  { id: "url-service-unavailable", label: "URL — Service Unavailable", group: "URL Ingestion" },
  { id: "url-too-large", label: "URL — Content Too Large", group: "URL Ingestion" },
  { id: "url-duplicate", label: "URL — Duplicate", group: "URL Ingestion" },

  // Preview
  { id: "preview-pdf", label: "Preview — PDF", group: "Preview" },
  { id: "preview-text", label: "Preview — Text/Code", group: "Preview" },
  { id: "preview-non-renderable", label: "Preview — Non-Renderable", group: "Preview" },
  { id: "preview-load-failure", label: "Preview — Load Failure", group: "Preview" },
  { id: "preview-url", label: "Preview — URL Source", group: "Preview" },
  { id: "preview-failed-source", label: "Preview — Failed Source", group: "Preview" },

  // Settings
  { id: "stack-settings", label: "AI Stack Settings", group: "Settings" },
  { id: "stack-settings-readonly", label: "AI Stack — Read Only", group: "Settings" },
  { id: "stack-custom-prompt", label: "AI Stack — Custom Prompt", group: "Settings" },
  { id: "stack-disable-warning", label: "Disable KB Stack Warning", group: "Settings" },
  { id: "stack-no-fallback", label: "No Fallback Stack Warning", group: "Settings" },
  { id: "channel-no-sources-context", label: "Channel — No Sources (Context)", group: "Settings" },
  { id: "channel-no-sources-bare", label: "Channel — No Sources (Bare)", group: "Settings" },
  { id: "channel-quota-depleted", label: "Channel — Quota Depleted", group: "Settings" },

  // Token Reporting
  { id: "token-reporting", label: "Token Reporting Table", group: "Token Reporting" },
  { id: "token-reporting-empty", label: "Token Reporting — Empty", group: "Token Reporting" },
  { id: "token-reporting-error", label: "Token Reporting — Error", group: "Token Reporting" },

  // Data Retention
  { id: "retention-warning", label: "Retention Warning (Initial)", group: "Data Retention" },
  { id: "retention-final", label: "Retention Final Reminder", group: "Data Retention" },
  { id: "retention-dual", label: "Dual Trigger Warning", group: "Data Retention" },
  { id: "archived-state", label: "Archived Sources", group: "Data Retention" },
  { id: "retention-renewed", label: "Subscription Renewed", group: "Data Retention" },
  { id: "retention-activity-resumed", label: "Activity Resumed", group: "Data Retention" },
  { id: "retention-reactivation", label: "Source Reactivation", group: "Data Retention" },
  { id: "retention-reactivation-fail", label: "Reactivation Failed", group: "Data Retention" },
];

function KBApp() {
  const kb = useKB();

  // Map phase to initial screen
  const getEffectiveScreen = (): Screen => {
    if (kb.devDrawerOpen) return kb.devDrawerOpen as unknown as Screen;
    return "kb-main";
  };

  return (
    <AppShell
      screens={screens}
      activeScreen="kb-main"
      onSelect={(s) => {
        // Handle dev screen selection
        if (s === "activation") { kb.setPhase("activation"); }
        else if (s === "no-access") { kb.setPhase("no-access"); }
        else if (s === "kb-main") { kb.setPhase("active"); }
        else { kb.setPhase(s as any); }
        kb.setDevDrawerOpen(false);
      }}
      isDark={kb.isDark}
      onToggleTheme={kb.toggleTheme}
    >
      {/* Global modals */}
      <AddSourceModal />
      <DeleteConfirmDialog />
      <SourcePreviewPanel />

      {/* Phase-based routing */}
      {kb.phase === "activation" && <ActivationScreen />}
      {kb.phase === "no-access" && <NoAccessScreen />}
      {kb.phase === "empty" && <KBMainInterface />}
      {kb.phase === "active" && <ScreenRouter />}

      {/* Onboarding */}
      {(kb.phase as string) === "activation-error" && <ActivationScreen variant="error" />}

      {/* Upload & Validation */}
      {(kb.phase as string) === "upload-val-unsupported" && <UploadValidationScreen variant="unsupported-type" />}
      {(kb.phase as string) === "upload-val-too-large" && <UploadValidationScreen variant="file-too-large" />}
      {(kb.phase as string) === "upload-val-duplicate" && <UploadValidationScreen variant="duplicate-name" />}
      {(kb.phase as string) === "upload-val-storage-cap" && <UploadValidationScreen variant="storage-cap" />}
      {(kb.phase as string) === "upload-val-file-limit" && <UploadValidationScreen variant="file-limit" />}
      {(kb.phase as string) === "upload-val-batch-mixed" && <UploadValidationScreen variant="batch-mixed" />}
      {(kb.phase as string) === "upload-single-progress" && <UploadPipelineScreen variant="single-uploading" />}
      {(kb.phase as string) === "upload-batch-progress" && <UploadPipelineScreen variant="batch-mixed" />}
      {(kb.phase as string) === "upload-processing-fail" && <UploadPipelineScreen variant="processing-failure" />}
      {(kb.phase as string) === "upload-first-ready" && <UploadPipelineScreen variant="first-source-ready" />}
      {(kb.phase as string) === "store-exhausted" && <StoreCapacityScreen />}

      {/* Source Panel — Plan Limit Warnings */}
      {(kb.phase as string) === "warn-storage-80" && <PlanLimitWarningsScreen variant="storage-80" />}
      {(kb.phase as string) === "warn-filecount-80" && <PlanLimitWarningsScreen variant="filecount-80" />}
      {(kb.phase as string) === "warn-token-80" && <PlanLimitWarningsScreen variant="token-80" />}
      {(kb.phase as string) === "warn-multi-limit" && <PlanLimitWarningsScreen variant="multi-limit" />}
      {(kb.phase as string) === "warn-storage-100" && <PlanLimitWarningsScreen variant="storage-100" />}
      {(kb.phase as string) === "warn-filecount-100" && <PlanLimitWarningsScreen variant="filecount-100" />}
      {(kb.phase as string) === "warn-token-depleted" && <PlanLimitWarningsScreen variant="token-depleted" />}
      {(kb.phase as string) === "warn-quota-restored" && <PlanLimitWarningsScreen variant="quota-restored" />}

      {/* Source Panel — Source Selection */}
      {(kb.phase as string) === "select-deselect-blocked" && <SourceSelectionScreen variant="deselect-blocked" />}
      {(kb.phase as string) === "select-auto-after-delete" && <SourceSelectionScreen variant="auto-select" />}
      {(kb.phase as string) === "select-no-ready" && <SourceSelectionScreen variant="no-ready" />}

      {/* Source Panel — Plan Data Loading */}
      {(kb.phase as string) === "plan-loading" && <PlanDataLoadingScreen variant="skeleton" />}
      {(kb.phase as string) === "plan-stripe-fail" && <PlanDataLoadingScreen variant="stripe-failure" />}

      {/* Deletion */}
      {(kb.phase as string) === "delete-blocked" && <DeletionStatesScreen variant="blocked-processing" />}
      {(kb.phase as string) === "delete-failed" && <DeletionStatesScreen variant="failed" />}
      {(kb.phase as string) === "delete-pending-cleanup" && <DeletionStatesScreen variant="pending-cleanup" />}
      {(kb.phase as string) === "delete-cleanup-locked" && <DeletionStatesScreen variant="cleanup-locked" />}

      {/* Chat & Session — Chat Errors */}
      {(kb.phase as string) === "chat-streaming-interrupted" && <ChatErrorStatesScreen variant="streaming-interrupted" />}
      {(kb.phase as string) === "chat-ai-error" && <ChatErrorStatesScreen variant="ai-service-error" />}
      {(kb.phase as string) === "chat-session-create-fail" && <ChatErrorStatesScreen variant="session-creation-failed" />}
      {(kb.phase as string) === "chat-reset-failed" && <ChatErrorStatesScreen variant="reset-failed" />}

      {/* Chat & Session — Token Quota */}
      {(kb.phase as string) === "quota-mid-session" && <TokenQuotaScreen variant="mid-session" />}
      {(kb.phase as string) === "quota-pre-session" && <TokenQuotaScreen variant="pre-session" />}

      {/* Chat & Session — Citation Edge Cases */}
      {(kb.phase as string) === "citation-deleted-source" && <CitationEdgeCasesScreen variant="deleted-source" />}
      {(kb.phase as string) === "citation-no-grounding" && <CitationEdgeCasesScreen variant="no-grounding" />}

      {/* Tagging */}
      {(kb.phase as string) === "tag-default" && <UploadTaggingScreen variant="default" />}
      {(kb.phase as string) === "tag-limit-reached" && <UploadTaggingScreen variant="limit-reached" />}
      {(kb.phase as string) === "tag-duplicate-key" && <UploadTaggingScreen variant="duplicate-key" />}
      {(kb.phase as string) === "tag-locked-view" && <UploadTaggingScreen variant="locked-view" />}

      {/* URL Ingestion */}
      {(kb.phase as string) === "url-success" && <UrlIngestionScreen variant="success" />}
      {(kb.phase as string) === "url-not-found" && <UrlIngestionScreen variant="page-not-found" />}
      {(kb.phase as string) === "url-blocked" && <UrlIngestionScreen variant="page-blocked" />}
      {(kb.phase as string) === "url-no-content" && <UrlIngestionScreen variant="no-content" />}
      {(kb.phase as string) === "url-auth-required" && <UrlIngestionScreen variant="auth-required" />}
      {(kb.phase as string) === "url-rate-limited" && <UrlIngestionScreen variant="rate-limited" />}
      {(kb.phase as string) === "url-timeout" && <UrlIngestionScreen variant="timeout" />}
      {(kb.phase as string) === "url-service-unavailable" && <UrlIngestionScreen variant="service-unavailable" />}
      {(kb.phase as string) === "url-too-large" && <UrlIngestionScreen variant="content-too-large" />}
      {(kb.phase as string) === "url-duplicate" && <UrlIngestionScreen variant="duplicate" />}

      {/* Preview */}
      {(kb.phase as string) === "preview-pdf" && <SourcePreviewStatesScreen variant="pdf" />}
      {(kb.phase as string) === "preview-text" && <SourcePreviewStatesScreen variant="text" />}
      {(kb.phase as string) === "preview-non-renderable" && <SourcePreviewStatesScreen variant="non-renderable" />}
      {(kb.phase as string) === "preview-load-failure" && <SourcePreviewStatesScreen variant="load-failure" />}
      {(kb.phase as string) === "preview-url" && <SourcePreviewStatesScreen variant="url-source" />}
      {(kb.phase as string) === "preview-failed-source" && <SourcePreviewStatesScreen variant="failed-source" />}

      {/* Settings */}
      {(kb.phase as string) === "stack-settings" && <StackSettingsScreen variant="default" />}
      {(kb.phase as string) === "stack-settings-readonly" && <StackSettingsScreen variant="read-only" />}
      {(kb.phase as string) === "stack-custom-prompt" && <StackSettingsScreen variant="custom-prompt" />}
      {(kb.phase as string) === "stack-disable-warning" && <StackSettingsScreen variant="disable-warning" />}
      {(kb.phase as string) === "stack-no-fallback" && <StackSettingsScreen variant="no-fallback" />}
      {(kb.phase as string) === "channel-no-sources-context" && <ChannelQueryStatesScreen variant="no-sources-with-context" />}
      {(kb.phase as string) === "channel-no-sources-bare" && <ChannelQueryStatesScreen variant="no-sources-no-context" />}
      {(kb.phase as string) === "channel-quota-depleted" && <ChannelQueryStatesScreen variant="quota-depleted" />}

      {/* Token Reporting */}
      {(kb.phase as string) === "token-reporting" && <TokenReportingScreen />}
      {(kb.phase as string) === "token-reporting-empty" && <TokenReportingScreen variant="empty" />}
      {(kb.phase as string) === "token-reporting-error" && <TokenReportingScreen variant="error" />}

      {/* Data Retention */}
      {(kb.phase as string) === "retention-warning" && <RetentionWarningScreen variant="warning" />}
      {(kb.phase as string) === "retention-final" && <RetentionWarningScreen variant="final-reminder" />}
      {(kb.phase as string) === "retention-dual" && <RetentionWarningScreen variant="dual-trigger" />}
      {(kb.phase as string) === "archived-state" && <RetentionWarningScreen variant="archived" />}
      {(kb.phase as string) === "retention-renewed" && <RetentionWarningScreen variant="subscription-renewed" />}
      {(kb.phase as string) === "retention-activity-resumed" && <RetentionWarningScreen variant="activity-resumed" />}
      {(kb.phase as string) === "retention-reactivation" && <RetentionWarningScreen variant="reactivation" />}
      {(kb.phase as string) === "retention-reactivation-fail" && <RetentionWarningScreen variant="reactivation-failed" />}
    </AppShell>
  );
}

function ScreenRouter() {
  return <KBMainInterface />;
}

const Index = () => {
  return (
    <KBProvider>
      <KBApp />
    </KBProvider>
  );
};

export default Index;
