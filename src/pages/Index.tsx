import { useState } from "react";
import { cn } from "@/lib/utils";
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
  | "no-access"
  | "kb-empty"
  | "kb-main"
  | "kb-warning-80"
  | "kb-depleted-100"
  | "kb-session-warning"
  | "kb-session-ceiling"
  | "add-source-file"
  | "add-source-url"
  | "delete-confirm"
  | "source-preview"
  | "source-preview-url"
  | "citation-drawer"
  | "stack-settings"
  | "token-reporting"
  | "retention-warning"
  | "archived-state";

const screens: { id: Screen; label: string; group: string }[] = [
  { id: "activation", label: "KB Activation", group: "Onboarding" },
  { id: "no-access", label: "No Access", group: "Onboarding" },
  { id: "kb-empty", label: "KB Empty State", group: "Main Interface" },
  { id: "kb-main", label: "KB Main (Chat + Sources)", group: "Main Interface" },
  { id: "kb-warning-80", label: "80% Plan Limit Warning", group: "Alerts" },
  { id: "kb-depleted-100", label: "100% Quota Depleted", group: "Alerts" },
  { id: "kb-session-warning", label: "Session Memory Warning", group: "Alerts" },
  { id: "kb-session-ceiling", label: "Session Ceiling Reached", group: "Alerts" },
  { id: "add-source-file", label: "Add Source — File Upload", group: "Source Management" },
  { id: "add-source-url", label: "Add Source — URL", group: "Source Management" },
  { id: "delete-confirm", label: "Delete Confirmation", group: "Source Management" },
  { id: "source-preview", label: "Source Preview (File)", group: "Source Management" },
  { id: "source-preview-url", label: "Source Preview (URL)", group: "Source Management" },
  { id: "citation-drawer", label: "Citation Drawer", group: "Chat" },
  { id: "stack-settings", label: "AI Stack Settings", group: "Settings" },
  { id: "token-reporting", label: "Token Reporting Table", group: "Settings" },
  { id: "retention-warning", label: "Retention Warning", group: "Data Retention" },
  { id: "archived-state", label: "Archived Sources", group: "Data Retention" },
];

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>("activation");

  return (
    <div className="flex h-screen overflow-hidden">
      <WireframeNav
        screens={screens}
        activeScreen={activeScreen}
        onSelect={setActiveScreen}
      />
      <main className="flex-1 overflow-auto bg-background">
        {activeScreen === "activation" && <ActivationScreen />}
        {activeScreen === "no-access" && <NoAccessScreen />}
        {activeScreen === "kb-empty" && (
          <KBMainInterface variant="empty" />
        )}
        {activeScreen === "kb-main" && (
          <KBMainInterface variant="active" />
        )}
        {activeScreen === "kb-warning-80" && (
          <KBMainInterface variant="active" alertType="warning-80" />
        )}
        {activeScreen === "kb-depleted-100" && (
          <KBMainInterface variant="active" alertType="depleted-100" />
        )}
        {activeScreen === "kb-session-warning" && (
          <KBMainInterface variant="active" sessionAlert="warning" />
        )}
        {activeScreen === "kb-session-ceiling" && (
          <KBMainInterface variant="active" sessionAlert="ceiling" />
        )}
        {activeScreen === "add-source-file" && <AddSourceModal tab="file" />}
        {activeScreen === "add-source-url" && <AddSourceModal tab="url" />}
        {activeScreen === "delete-confirm" && <DeleteConfirmDialog />}
        {activeScreen === "source-preview" && <SourcePreviewPanel type="file" />}
        {activeScreen === "source-preview-url" && <SourcePreviewPanel type="url" />}
        {activeScreen === "citation-drawer" && (
          <KBMainInterface variant="active" showCitation />
        )}
        {activeScreen === "stack-settings" && <StackSettingsScreen />}
        {activeScreen === "token-reporting" && <TokenReportingScreen />}
        {activeScreen === "retention-warning" && <RetentionWarningScreen variant="warning" />}
        {activeScreen === "archived-state" && <RetentionWarningScreen variant="archived" />}
      </main>
    </div>
  );
};

export default Index;
