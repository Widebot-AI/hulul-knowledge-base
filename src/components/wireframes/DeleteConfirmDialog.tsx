import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteConfirmDialog() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-sm">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Delete Source</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to delete <strong>Q3 Strategy Deck.pdf</strong>? This action is permanent and cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">Cancel</Button>
            <Button variant="destructive" className="flex-1">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
