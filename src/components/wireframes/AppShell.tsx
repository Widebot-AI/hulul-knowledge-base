import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Screen } from "@/pages/Index";
import {
  Home, Inbox, Users, Bot, BookOpen, Settings, Sun, Moon, Code2,
  Menu as MenuIcon, Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ─── Icon sidebar items ─── */
const sidebarIcons = [
  { icon: Home, label: "Home" },
  { icon: Inbox, label: "Inbox" },
  { icon: Users, label: "CRM" },
  { icon: Bot, label: "AI Agent" },
  { icon: BookOpen, label: "Knowledge Base", active: true },
  { icon: Settings, label: "Settings" },
];

/* ─── Mobile bottom-nav items ─── */
const bottomNavItems = [
  { icon: Home, label: "Home", id: "home" as const },
  { icon: Inbox, label: "Inbox", id: "inbox" as const },
  { icon: Users, label: "CRM", id: "crm" as const },
  { icon: Bot, label: "AI Agent", id: "agent" as const },
  { icon: BookOpen, label: "KB", id: "kb" as const },
  { icon: Settings, label: "Settings", id: "settings" as const },
];

/* ─── Breadcrumb helper ─── */
function getBreadcrumb(screen: Screen, screens: { id: Screen; label: string; group: string }[]) {
  const s = screens.find((x) => x.id === screen);
  if (!s) return ["Hulul", "Knowledge Base"];
  return ["Hulul", "Knowledge Base", s.label];
}

type Props = {
  screens: { id: Screen; label: string; group: string }[];
  activeScreen: Screen;
  onSelect: (s: Screen) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
};

export function AppShell({ screens, activeScreen, onSelect, isDark, onToggleTheme, children }: Props) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const breadcrumb = getBreadcrumb(activeScreen, screens);

  const groups = screens.reduce<Record<string, typeof screens>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  /* Shared dev screen list */
  const DevScreenList = (
    <ScrollArea className="max-h-[70vh]">
      <div className="p-2 space-y-3">
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
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* ─── Top Header ─── */}
      <header className="h-12 shrink-0 border-b border-border flex items-center gap-2 px-3 bg-card">
        {/* Hamburger (mobile only — opens screen list) */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
                <MenuIcon className="w-4 h-4 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="px-4 py-3 border-b border-border text-sm font-semibold">
                KB Wireframes
              </SheetTitle>
              <div onClick={() => setMobileMenuOpen(false)}>
                {DevScreenList}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Breadcrumb */}
        <Breadcrumb className="flex-1 min-w-0 overflow-hidden">
          <BreadcrumbList className="text-xs flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-muted-foreground hover:text-foreground">
                Hulul
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-muted-foreground hover:text-foreground">
                Knowledge Base
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumb.length > 2 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium truncate max-w-[200px]">
                    {breadcrumb[2]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search (desktop only) */}
        {!isMobile && (
          <div className="flex items-center gap-2 bg-secondary rounded-md px-3 py-1.5 w-60">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search...</span>
          </div>
        )}

        {/* Header actions */}
        <div className="flex items-center gap-1">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark
              ? <Sun className="w-3.5 h-3.5 text-foreground" />
              : <Moon className="w-3.5 h-3.5 text-foreground" />}
          </button>

          {/* Dev screens popover (desktop) */}
          {!isMobile && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-1.5 rounded-md hover:bg-accent transition-colors border border-dashed border-border"
                  title="Dev: Switch wireframe screen"
                >
                  <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground">Dev — Wireframe Screens</p>
                  <p className="text-[10px] text-muted-foreground">US-001 → US-012</p>
                </div>
                {DevScreenList}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      {/* ─── Body: Icon sidebar + content ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon sidebar — desktop only */}
        {!isMobile && (
          <aside className="w-12 shrink-0 border-r border-border bg-card flex flex-col items-center py-3 gap-1">
            {sidebarIcons.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={cn(
                  "relative w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* User avatar */}
            <Avatar className="w-7 h-7 rounded-md cursor-pointer">
              <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs font-medium">
                R
              </AvatarFallback>
            </Avatar>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* ─── Mobile bottom nav ─── */}
      {isMobile && (
        <nav className="h-14 shrink-0 border-t border-border bg-card flex items-stretch">
          {bottomNavItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
                id === "kb"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
