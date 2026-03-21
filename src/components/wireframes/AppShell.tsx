import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Screen } from "@/pages/Index";
import {
  Home, Inbox, Users, Bot, BookOpen, Settings, Sun, Moon, Code2,
  Menu as MenuIcon, Search, BatteryMedium, Languages, User, ChevronRight, ChevronDown } from
"lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator } from
"@/components/ui/breadcrumb";
import hululLogoIcon from "@/assets/hulul-logo-icon.svg";
import hululLogoEng from "@/assets/hulul-logo-eng.svg";
import hululLogoAr from "@/assets/hulul-logo-ar.svg";
import { useKB } from "./KBContext";
import { SourcePanel } from "./SourcePanel";
import { t } from "./translations";
import { useSearch } from "@/hooks/useSearch";
import { SearchOverlay } from "@/components/search/SearchOverlay";

/* ─── Icon sidebar items ─── */
const sidebarKeys = [
{ icon: Home, labelKey: "nav.home" as const },
{ icon: Inbox, labelKey: "nav.inbox" as const },
{ icon: Users, labelKey: "nav.crm" as const },
{ icon: Bot, labelKey: "nav.agent" as const },
{ icon: BookOpen, labelKey: "nav.kb" as const, active: true },
{ icon: Settings, labelKey: "nav.settings" as const }];


/* ─── Mobile bottom-nav items ─── */
const bottomNavKeys = [
{ icon: Home, labelKey: "nav.home" as const, id: "home" as const },
{ icon: Inbox, labelKey: "nav.inbox" as const, id: "inbox" as const },
{ icon: Search, labelKey: "nav.search" as const, id: "search" as const },
{ icon: BookOpen, labelKey: "nav.kb.short" as const, id: "kb" as const },
{ icon: MenuIcon, labelKey: "nav.menu" as const, id: "menu" as const }];


type Props = {
  screens: {id: Screen;label: string;group: string;}[];
  activeScreen: Screen;
  onSelect: (s: Screen) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
};

export function AppShell({ screens, activeScreen, onSelect, isDark, onToggleTheme, children }: Props) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devDrawerOpen, setDevDrawerOpen] = useState(false);
  const [menuDevView, setMenuDevView] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const { lang, setLang, sources, modal } = useKB();
  const isRtl = lang === "ar";
  const readySelected = sources.filter((s) => s.status === "ready" && s.selected).length;
  const search = useSearch();

  const handleSourceSheetChange = (open: boolean) => {
    if (!open && modal?.kind === "source-preview") return;
    setSourcesOpen(open);
    if (!open) setSheetExpanded(false);
  };

  const groups = screens.reduce<Record<string, typeof screens>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  /* Shared dev screen list */
  const DevScreenList =
  <ScrollArea className="max-h-[70vh]">
      <div className="p-2 space-y-3">
        {Object.entries(groups).map(([group, items]) =>
      <div key={group}>
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group}
            </p>
            {items.map((s) =>
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={cn(
            "w-full text-start px-3 py-1.5 rounded-md text-xs transition-colors",
            activeScreen === s.id ?
            "bg-accent text-accent-foreground font-medium" :
            "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}>
          
                {s.label}
              </button>
        )}
          </div>
      )}
      </div>
    </ScrollArea>;


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* ─── Top Header ─── */}
      <header className="h-12 shrink-0 border-b border-border flex items-center gap-2 px-3 bg-card">
        {/* Logo + Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <img
            src={lang === "ar" ? hululLogoAr : hululLogoEng}
            alt="Hulul"
            className="h-6 shrink-0" />
          
          <span className="text-border mx-1">|</span>
          <Breadcrumb className="min-w-0 overflow-hidden">
            <BreadcrumbList className="text-xs flex-nowrap">
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-muted-foreground hover:text-foreground">
                  {t("nav.kb", lang)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Search (desktop only) */}
        {!isMobile &&
        <button
          onClick={() => search.open()}
          className="flex items-center gap-2 bg-secondary rounded-md px-3 py-1.5 w-60 hover:bg-accent transition-colors cursor-pointer">
          
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t("header.search", lang)}</span>
          </button>
        }

        {/* Sources pill — mobile only */}
        {isMobile &&
        <button
          onClick={() => setSourcesOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border hover:bg-accent transition-colors active:scale-[0.98]">
          
            <BookOpen className="w-3.5 h-3.5 text-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {t("sources.title", lang)}
            </span>
            <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {readySelected}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        }

        {/* Header actions */}
        <div className="flex items-center gap-1">
          {/* Language toggle — desktop only */}
          {!isMobile &&
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            title={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
            
              <Languages className="w-3.5 h-3.5 text-foreground" />
            </button>
          }

          {/* Dark mode toggle — desktop only */}
          {!isMobile &&
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            title={isDark ? "Light mode" : "Dark mode"}>
            
              {isDark ?
            <Sun className="w-3.5 h-3.5 text-foreground" /> :
            <Moon className="w-3.5 h-3.5 text-foreground" />}
            </button>
          }

          {/* Dev screens drawer (desktop) */}
          {!isMobile &&
          <Sheet open={devDrawerOpen} onOpenChange={setDevDrawerOpen}>
              <SheetTrigger asChild>
                <button
                className="p-1.5 rounded-md hover:bg-accent transition-colors border border-dashed border-border"
                title="Dev: Switch wireframe screen">
                
                  <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side={isRtl ? "left" : "right"} className="w-80 p-0">
                <SheetTitle className="px-4 py-3 border-b border-border text-sm font-semibold">
                  {t("header.devScreens", lang)}
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">US-001 → US-012</p>
                </SheetTitle>
                <div onClick={() => setDevDrawerOpen(false)}>
                  {DevScreenList}
                </div>
              </SheetContent>
            </Sheet>
          }
        </div>
      </header>

      {/* ─── Body: Icon sidebar + content ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon sidebar — desktop only */}
        {!isMobile &&
        <aside className="w-12 shrink-0 border-e border-border bg-card flex flex-col items-center py-3 gap-1">
            {/* Hulul icon logo */}
            

          
            {sidebarKeys.map(({ icon: Icon, labelKey, active }) =>
          <button
            key={labelKey}
            className={cn(
              "relative w-8 h-8 flex items-center justify-center rounded-md transition-colors",
              active ?
              "bg-accent text-foreground" :
              "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title={t(labelKey, lang)}>
            
                <Icon className="w-4 h-4" />
              </button>
          )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Energy / Battery indicator */}
            <div className="flex flex-col items-center gap-0.5 cursor-pointer group" title={`${t("header.energy", lang)}: 100%`}>
              <BatteryMedium className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
              <span className="text-[9px] font-medium text-muted-foreground">100%</span>
            </div>

            {/* User avatar */}
            <Avatar className="w-7 h-7 rounded-md cursor-pointer">
              <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs font-medium">
                R
              </AvatarFallback>
            </Avatar>
          </aside>
        }

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* ─── Mobile bottom nav ─── */}
      {isMobile &&
      <nav className="h-14 shrink-0 border-t border-border bg-card flex items-stretch">
          {bottomNavKeys.map(({ icon: Icon, labelKey, id }) => {
          if (id === "menu") {
            return (
              <Sheet key={id} open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground">
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-medium">{t(labelKey, lang)}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl p-0 max-h-[75vh]">
                    <SheetTitle className="px-4 py-3 border-b border-border text-sm font-semibold">
                      {menuDevView ? t("menu.devScreens", lang) : t("nav.menu", lang)}
                    </SheetTitle>
                    {menuDevView ?
                  <div>
                        <button
                      onClick={() => setMenuDevView(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-accent transition-colors border-b border-border">
                      
                          <ChevronRight className={cn("w-3.5 h-3.5", isRtl ? "" : "rotate-180")} />
                          {t("nav.menu", lang)}
                        </button>
                        <div onClick={() => {setMobileMenuOpen(false);setMenuDevView(false);}}>
                          {DevScreenList}
                        </div>
                      </div> :

                  <div className="p-3 space-y-0.5">
                        {/* Profile */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {t("menu.profile", lang)}
                        </button>
                        {/* Language */}
                        <button
                      onClick={() => setLang(lang === "en" ? "ar" : "en")}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                      
                          <span className="flex items-center gap-3">
                            <Languages className="w-4 h-4 text-muted-foreground" />
                            {t("menu.language", lang)}
                          </span>
                          <span className="text-xs text-muted-foreground">{lang === "en" ? "العربية" : "English"}</span>
                        </button>
                        {/* Dark mode */}
                        <button
                      onClick={onToggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                      
                          <span className="flex items-center gap-3">
                            {isDark ?
                        <Sun className="w-4 h-4 text-muted-foreground" /> :
                        <Moon className="w-4 h-4 text-muted-foreground" />}
                            {isDark ? t("menu.lightMode", lang) : t("menu.darkMode", lang)}
                          </span>
                        </button>
                        {/* Settings */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          {t("nav.settings", lang)}
                        </button>
                        {/* Dev screens */}
                        <div className="border-t border-border mt-2 pt-2">
                          <button
                        onClick={() => setMenuDevView(true)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        
                            <span className="flex items-center gap-3">
                              <Code2 className="w-4 h-4" />
                              {t("menu.devScreens", lang)}
                            </span>
                            <ChevronRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
                          </button>
                        </div>
                      </div>
                  }
                  </SheetContent>
                </Sheet>);

          }
          if (id === "search") {
            return (
              <button
                key={id}
                onClick={() => search.open()}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground">
                
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t(labelKey, lang)}</span>
                </button>);

          }
          return (
            <button
              key={id}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
                id === "kb" ? "text-primary" : "text-muted-foreground"
              )}>
              
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{t(labelKey, lang)}</span>
              </button>);

        })}
        </nav>
      }

      {/* Sources bottom sheet — mobile */}
      {isMobile &&
      <Sheet open={sourcesOpen} onOpenChange={handleSourceSheetChange}>
          <SheetContent
          side="bottom"
          className={`p-0 rounded-t-2xl transition-[height] duration-300 ease-in-out ${
          sheetExpanded ? "h-[100dvh] rounded-t-none" : "h-[75vh]"}`
          }>
          
            <SheetTitle className="sr-only">{t("sources.title", lang)}</SheetTitle>
            <div className="h-full">
              <SourcePanel isMobileSheet onExpand={() => setSheetExpanded(true)} />
            </div>
          </SheetContent>
        </Sheet>
      }

      {/* Search overlay */}
      <SearchOverlay search={search} lang={lang} />
    </div>);

}