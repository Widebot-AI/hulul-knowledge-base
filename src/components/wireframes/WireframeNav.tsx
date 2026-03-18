import { cn } from "@/lib/utils";
import type { Screen } from "@/pages/Index";
import { Moon, Sun } from "lucide-react";

type Props = {
  screens: { id: Screen; label: string; group: string }[];
  activeScreen: Screen;
  onSelect: (s: Screen) => void;
  isDark: boolean;
  onToggleTheme: () => void;
};

export function WireframeNav({ screens, activeScreen, onSelect, isDark, onToggleTheme }: Props) {
  const groups = screens.reduce<Record<string, typeof screens>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-panel overflow-y-auto flex flex-col">
      <div className="px-4 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">KB Wireframes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">US-001 → US-012</p>
        </div>
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-md border border-border hover:bg-accent transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-foreground" /> : <Moon className="w-3.5 h-3.5 text-foreground" />}
        </button>
      </div>
      <nav className="p-2 space-y-4 flex-1 overflow-y-auto">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group}
            </p>
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                  activeScreen === s.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}