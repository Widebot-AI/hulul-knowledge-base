import { useState, useEffect } from "react";
import { WireframeNav } from "@/components/wireframes/WireframeNav";
import { ActivationScreen } from "@/components/wireframes/ActivationScreen";
import { NoAccessScreen } from "@/components/wireframes/NoAccessScreen";
import { KBMainInterface } from "@/components/wireframes/KBMainInterface";
import { AddSourceModal } from "@/components/wireframes/AddSourceModal";
import { DeleteConfirmDialog } from "@/components/wireframes/DeleteConfirmDialog";
import { SourcePreviewPanel } from "@/components/wireframes/SourcePreviewPanel";
import { StackSettingsScreen } from "@/components/wireframes/StackSettingsScreen";
import { TokenReportingScreen } from "@/components/wireframes/TokenReportingScreen";
import { RetentionWarningScreen } from "@/components/wireframes/RetentionWarningScreen";

export type Screen =
  | "activation"
  | "activation-error"
  | "no-access"
  | "kb-empty"
  | "kb-main"
  | "kb-warning-80"
  | "kb-warning-80-multi"
  | "kb-depleted-100"
  | "kb-depleted-storage"
  | "kb-depleted-filecount"
  | "kb-session-warning"
  | "kb-session-ceiling"
  | "kb-loading"
  | "add-source-file"
  | "add-source-file-errors"
  | "add-source-url"
  | "add-source-url-duplicate"
  | "add-source-url-not-found"
  | "add-source-url-blocked"
  | "add-source-url-no-content"
  | "add-source-url-auth"
  | "add-source-url-timeout"
  | "add-source-url-too-large"
  | "add-source-url-unavailable"
  | "delete-confirm"
  | "source-preview"
  | "source-preview-url"
  | "source-preview-failed"
  | "source-preview-fallback"
  | "source-preview-unavailable"
  | "citation-drawer"
  | "citation-deleted"
  | "streaming-error"
  | "session-create-error"
  | "reset-confirm"
  | "reset-error"
  | "pending-cleanup"
  | "stack-settings"
  | "stack-settings-readonly"
  | "token-reporting"
  | "token-reporting-empty"
  | "token-reporting-error"
  | "retention-warning"
  | "retention-final"
  | "retention-dual"
  | "archived-state";

const screens: { id: Screen; label: string; group: string }[] = [
  // Onboarding
  { id: "activation", label: "KB Activation", group: "Onboarding" },
  { id: "activation-error", label: "Activation Failed", group: "Onboarding" },
  { id: "no-access", label: "No Access", group: "Onboarding" },

  // Main Interface
  { id: "kb-empty", label: "KB Empty State", group: "Main Interface" },
  { id: "kb-main", label: "KB Main (Chat + Sources)", group: "Main Interface" },
  { id: "kb-loading", label: "KB Loading Skeleton", group: "Main Interface" },

  // Plan Limit Alerts
  { id: "kb-warning-80", label: "80% Single Limit Warning", group: "Alerts" },
  { id: "kb-warning-80-multi", label: "80% Multi-Limit Warning", group: "Alerts" },
  { id: "kb-depleted-100", label: "100% Token Quota Depleted", group: "Alerts" },
  { id: "kb-depleted-storage", label: "100% Storage Depleted", group: "Alerts" },
  { id: "kb-depleted-filecount", label: "100% File Count Depleted", group: "Alerts" },

  // Session Alerts
  { id: "kb-session-warning", label: "Session Memory Warning (80%)", group: "Session" },
  { id: "kb-session-ceiling", label: "Session Ceiling Reached", group: "Session" },
  { id: "session-create-error", label: "Session Creation Failed", group: "Session" },
  { id: "reset-confirm", label: "Reset Confirmation Dialog", group: "Session" },
  { id: "reset-error", label: "Reset Failed", group: "Session" },

  // Source Management — File
  { id: "add-source-file", label: "Add Source — File Upload", group: "Source Mgmt: File" },
  { id: "add-source-file-errors", label: "File Upload — All Errors", group: "Source Mgmt: File" },
  { id: "delete-confirm", label: "Delete Confirmation", group: "Source Mgmt: File" },
  { id: "pending-cleanup", label: "Pending Cleanup (Partial Delete)", group: "Source Mgmt: File" },

  // Source Management — URL
  { id: "add-source-url", label: "Add Source — URL", group: "Source Mgmt: URL" },
  { id: "add-source-url-duplicate", label: "URL Error — Duplicate", group: "Source Mgmt: URL" },
  { id: "add-source-url-not-found", label: "URL Error — Not Found (404)", group: "Source Mgmt: URL" },
  { id: "add-source-url-blocked", label: "URL Error — Blocked (403)", group: "Source Mgmt: URL" },
  { id: "add-source-url-no-content", label: "URL Error — No Content", group: "Source Mgmt: URL" },
  { id: "add-source-url-auth", label: "URL Error — Auth Required", group: "Source Mgmt: URL" },
  { id: "add-source-url-timeout", label: "URL Error — Timeout", group: "Source Mgmt: URL" },
  { id: "add-source-url-too-large", label: "URL Error — Too Large", group: "Source Mgmt: URL" },
  { id: "add-source-url-unavailable", label: "URL Error — Service Down", group: "Source Mgmt: URL" },

  // Source Preview
  { id: "source-preview", label: "Preview (File — PDF)", group: "Source Preview" },
  { id: "source-preview-url", label: "Preview (URL — Markdown)", group: "Source Preview" },
  { id: "source-preview-failed", label: "Preview (Failed Source)", group: "Source Preview" },
  { id: "source-preview-fallback", label: "Preview (Non-Renderable)", group: "Source Preview" },
  { id: "source-preview-unavailable", label: "Preview (Load Error)", group: "Source Preview" },

  // Chat & Citations
  { id: "citation-drawer", label: "Citation Drawer", group: "Chat" },
  { id: "citation-deleted", label: "Citation — Deleted Source", group: "Chat" },
  { id: "streaming-error", label: "Streaming Error / Partial", group: "Chat" },

  // Settings
  { id: "stack-settings", label: "AI Stack Settings", group: "Settings" },
  { id: "stack-settings-readonly", label: "AI Stack — Read Only", group: "Settings" },
  { id: "token-reporting", label: "Token Reporting Table", group: "Settings" },
  { id: "token-reporting-empty", label: "Token Reporting — Empty", group: "Settings" },
  { id: "token-reporting-error", label: "Token Reporting — Error", group: "Settings" },

  // Data Retention
  { id: "retention-warning", label: "Retention Warning (Initial)", group: "Data Retention" },
  { id: "retention-final", label: "Retention Final Reminder", group: "Data Retention" },
  { id: "retention-dual", label: "Dual Trigger Warning", group: "Data Retention" },
  { id: "archived-state", label: "Archived Sources", group: "Data Retention" },
];

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>("activation");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="flex h-screen overflow-hidden">
      <WireframeNav
        screens={screens}
        activeScreen={activeScreen}
        onSelect={setActiveScreen}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />
      <main className="flex-1 overflow-auto bg-background">
        {/* Onboarding */}
        {activeScreen === "activation" && <ActivationScreen />}
        {activeScreen === "activation-error" && <ActivationScreen variant="error" />}
        {activeScreen === "no-access" && <NoAccessScreen />}

        {/* Main Interface */}
        {activeScreen === "kb-empty" && <KBMainInterface variant="empty" />}
        {activeScreen === "kb-main" && <KBMainInterface variant="active" />}
        {activeScreen === "kb-loading" && <KBMainInterface variant="active" sourceVariant="loading" />}

        {/* Plan Limit Alerts */}
        {activeScreen === "kb-warning-80" && <KBMainInterface variant="active" alertType="warning-80" />}
        {activeScreen === "kb-warning-80-multi" && <KBMainInterface variant="active" alertType="warning-80-multi" />}
        {activeScreen === "kb-depleted-100" && <KBMainInterface variant="active" alertType="depleted-100" />}
        {activeScreen === "kb-depleted-storage" && <KBMainInterface variant="active" alertType="depleted-storage" />}
        {activeScreen === "kb-depleted-filecount" && <KBMainInterface variant="active" alertType="depleted-filecount" />}

        {/* Session */}
        {activeScreen === "kb-session-warning" && <KBMainInterface variant="active" sessionAlert="warning" />}
        {activeScreen === "kb-session-ceiling" && <KBMainInterface variant="active" sessionAlert="ceiling" />}
        {activeScreen === "session-create-error" && <KBMainInterface variant="active" sessionCreateError />}
        {activeScreen === "reset-confirm" && <KBMainInterface variant="active" showResetConfirm />}
        {activeScreen === "reset-error" && <KBMainInterface variant="active" showResetConfirm resetError />}

        {/* Source Mgmt: File */}
        {activeScreen === "add-source-file" && <AddSourceModal tab="file" />}
        {activeScreen === "add-source-file-errors" && <AddSourceModal tab="file" showAllErrors />}
        {activeScreen === "delete-confirm" && <DeleteConfirmDialog />}
        {activeScreen === "pending-cleanup" && <KBMainInterface variant="active" sourceVariant="pending_cleanup" />}

        {/* Source Mgmt: URL */}
        {activeScreen === "add-source-url" && <AddSourceModal tab="url" />}
        {activeScreen === "add-source-url-duplicate" && <AddSourceModal tab="url" urlError="duplicate" />}
        {activeScreen === "add-source-url-not-found" && <AddSourceModal tab="url" urlError="not_found" />}
        {activeScreen === "add-source-url-blocked" && <AddSourceModal tab="url" urlError="blocked" />}
        {activeScreen === "add-source-url-no-content" && <AddSourceModal tab="url" urlError="no_content" />}
        {activeScreen === "add-source-url-auth" && <AddSourceModal tab="url" urlError="auth_required" />}
        {activeScreen === "add-source-url-timeout" && <AddSourceModal tab="url" urlError="timeout" />}
        {activeScreen === "add-source-url-too-large" && <AddSourceModal tab="url" urlError="too_large" />}
        {activeScreen === "add-source-url-unavailable" && <AddSourceModal tab="url" urlError="service_unavailable" />}

        {/* Source Preview */}
        {activeScreen === "source-preview" && <SourcePreviewPanel type="file" />}
        {activeScreen === "source-preview-url" && <SourcePreviewPanel type="url" />}
        {activeScreen === "source-preview-failed" && <SourcePreviewPanel type="failed" />}
        {activeScreen === "source-preview-fallback" && <SourcePreviewPanel type="fallback" />}
        {activeScreen === "source-preview-unavailable" && <SourcePreviewPanel type="unavailable" />}

        {/* Chat & Citations */}
        {activeScreen === "citation-drawer" && <KBMainInterface variant="active" showCitation />}
        {activeScreen === "citation-deleted" && <KBMainInterface variant="active" showDeletedCitation />}
        {activeScreen === "streaming-error" && <KBMainInterface variant="active" streamingError />}

        {/* Settings */}
        {activeScreen === "stack-settings" && <StackSettingsScreen />}
        {activeScreen === "stack-settings-readonly" && <StackSettingsScreen readOnly />}
        {activeScreen === "token-reporting" && <TokenReportingScreen />}
        {activeScreen === "token-reporting-empty" && <TokenReportingScreen variant="empty" />}
        {activeScreen === "token-reporting-error" && <TokenReportingScreen variant="error" />}

        {/* Data Retention */}
        {activeScreen === "retention-warning" && <RetentionWarningScreen variant="warning" />}
        {activeScreen === "retention-final" && <RetentionWarningScreen variant="final-reminder" />}
        {activeScreen === "retention-dual" && <RetentionWarningScreen variant="dual-trigger" />}
        {activeScreen === "archived-state" && <RetentionWarningScreen variant="archived" />}
      </main>
    </div>
  );
};

export default Index;