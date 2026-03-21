import { Clock, X, Search, Zap, Users, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { t, type Lang } from '@/components/wireframes/translations';
import type { RecentSearch, SavedPreset } from '@/lib/search-data';

interface Props {
  recentSearches: RecentSearch[];
  presets: SavedPreset[];
  onClearRecent: () => void;
  onRemoveRecent: (id: string) => void;
  onRemovePreset: (id: string) => void;
  onSelectRecent: (query: string) => void;
  lang: Lang;
}

export function SearchDefaultState({ recentSearches, presets, onClearRecent, onRemoveRecent, onRemovePreset, onSelectRecent, lang }: Props) {
  if (presets.length === 0 && recentSearches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">{t("search.emptyTitle", lang)}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{t("search.emptySubtitle", lang)}</p>
      </div>
    );
  }

  const shortcuts = [
    { prefix: '>', label: t("search.shortcutActions", lang), icon: Zap, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { prefix: '@', label: t("search.shortcutPeople", lang), icon: Users, color: 'text-primary bg-primary/10 border-primary/20' },
    { prefix: '#', label: t("search.shortcutIdLookup", lang), icon: Hash, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  ];

  return (
    <div className="p-3 space-y-4">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t("search.shortcuts", lang)}</h3>
        <div className="flex gap-2 flex-wrap px-1">
          {shortcuts.map(s => (
            <button
              key={s.prefix}
              onClick={() => onSelectRecent(s.prefix)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-80 ${s.color}`}
            >
              <s.icon className="h-3 w-3" />
              <kbd className="font-mono font-bold">{s.prefix}</kbd>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {presets.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t("search.savedPresets", lang)}</h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {presets.map(preset => (
              <div key={preset.id} className="flex-shrink-0 relative group rounded-lg border border-border bg-muted/30 p-2.5 pe-8 min-w-[180px]">
                <p className="text-sm font-medium text-foreground mb-1.5">{lang === 'ar' ? preset.nameAr : preset.name}</p>
                <div className="flex gap-1 flex-wrap">
                  {preset.filters.map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {lang === 'ar' ? f.labelAr : f.label}
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={() => onRemovePreset(preset.id)}
                  className="absolute top-1.5 end-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="text-xs font-medium text-muted-foreground">{t("search.recentSearches", lang)}</h3>
            <button onClick={onClearRecent} className="text-xs text-primary hover:underline">{t("search.clearAll", lang)}</button>
          </div>
          <div className="space-y-0.5">
            {recentSearches.map(item => (
              <div
                key={item.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onSelectRecent(item.query)}
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground flex-1">{item.query}</span>
                <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveRecent(item.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
