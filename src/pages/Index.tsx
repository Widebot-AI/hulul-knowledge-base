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

export type Screen =
  | "activation"
  | "no-access"
  | "kb-main"
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
  { id: "activation", label: "KB Activation Flow", group: "Onboarding" },
  { id: "no-access", label: "No Access", group: "Onboarding" },
  { id: "kb-main", label: "KB Main (Interactive)", group: "Main Interface" },
  { id: "stack-settings", label: "AI Stack Settings", group: "Settings" },
  { id: "stack-settings-readonly", label: "AI Stack — Read Only", group: "Settings" },
  { id: "token-reporting", label: "Token Reporting Table", group: "Settings" },
  { id: "token-reporting-empty", label: "Token Reporting — Empty", group: "Settings" },
  { id: "token-reporting-error", label: "Token Reporting — Error", group: "Settings" },
  { id: "retention-warning", label: "Retention Warning (Initial)", group: "Data Retention" },
  { id: "retention-final", label: "Retention Final Reminder", group: "Data Retention" },
  { id: "retention-dual", label: "Dual Trigger Warning", group: "Data Retention" },
  { id: "archived-state", label: "Archived Sources", group: "Data Retention" },
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

      {/* Dev screen overrides for non-interactive screens */}
      {(kb.phase as string) === "stack-settings" && <StackSettingsScreen />}
      {(kb.phase as string) === "stack-settings-readonly" && <StackSettingsScreen readOnly />}
      {(kb.phase as string) === "token-reporting" && <TokenReportingScreen />}
      {(kb.phase as string) === "token-reporting-empty" && <TokenReportingScreen variant="empty" />}
      {(kb.phase as string) === "token-reporting-error" && <TokenReportingScreen variant="error" />}
      {(kb.phase as string) === "retention-warning" && <RetentionWarningScreen variant="warning" />}
      {(kb.phase as string) === "retention-final" && <RetentionWarningScreen variant="final-reminder" />}
      {(kb.phase as string) === "retention-dual" && <RetentionWarningScreen variant="dual-trigger" />}
      {(kb.phase as string) === "archived-state" && <RetentionWarningScreen variant="archived" />}
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
