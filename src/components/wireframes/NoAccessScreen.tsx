import { ShieldAlert } from "lucide-react";

export function NoAccessScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-sm text-center space-y-4 px-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Access Restricted</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You don't have permission to access the Knowledge Base.
          Please contact your workspace administrator to request access.
        </p>
      </div>
    </div>
  );
}
