import { useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, X } from 'lucide-react';
import { type useSearch } from '@/hooks/useSearch';
import { SearchDefaultState } from './SearchDefaultState';
import { SearchResults } from './SearchResults';
import { SearchNoResults } from './SearchNoResults';
import { SearchFilterBar } from './SearchFilterBar';
import { SearchPrefixBanner } from './SearchPrefixBanner';
import { SearchIdLookup } from './SearchIdLookup';
import { SearchActiveFilters } from './SearchActiveFilters';
import { useToast } from '@/hooks/use-toast';
import { t, type Lang } from '@/components/wireframes/translations';

type SearchState = ReturnType<typeof useSearch>;

interface SearchOverlayProps {
  search: SearchState;
  lang: Lang;
}

export function SearchOverlay({ search, lang }: SearchOverlayProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [search.isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const total = search.allResults.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      search.setFocusedIndex(prev => (prev + 1) % Math.max(total, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      search.setFocusedIndex(prev => (prev - 1 + total) % Math.max(total, 1));
    } else if (e.key === 'Enter' && search.focusedIndex >= 0 && search.focusedIndex < total) {
      e.preventDefault();
      const item = search.allResults[search.focusedIndex];
      toast({ title: `${t("search.navigatingTo", lang)} ${item.type} ${item.id}` });
    }
  }, [search, toast, lang]);

  const showDefault = !search.hasResults && search.prefixMode === 'none';
  const showIdLookup = search.prefixMode === 'id' && search.cleanQuery.length >= 2;
  const showResults = search.hasResults && !search.noResults && search.prefixMode !== 'id';
  const showNoResults = search.noResults && search.prefixMode !== 'id';
  const showFilterBar = search.hasResults && search.prefixMode === 'none';

  return (
    <Dialog open={search.isOpen} onOpenChange={(open) => !open && search.close()}>
      <DialogContent className="max-w-2xl p-0 gap-0 top-[20%] translate-y-0 rounded-xl border border-border shadow-2xl bg-card overflow-hidden [&>button]:hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder", lang)}
            className="flex-1 h-12 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="shrink-0 inline-flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Esc
          </kbd>
        </div>

        {search.prefixMode !== 'none' && (
          <SearchPrefixBanner mode={search.prefixMode} lang={lang} />
        )}

        {showFilterBar && (
          <SearchFilterBar
            entityType={search.entityType}
            setEntityType={search.setEntityType}
            moduleScope={search.moduleScope}
            setModuleScope={search.setModuleScope}
            smartScope={search.smartScope}
            setSmartScope={search.setSmartScope}
            lang={lang}
          />
        )}

        {search.activeFilters.length > 0 && (
          <SearchActiveFilters
            filters={search.activeFilters}
            onRemove={search.removeFilter}
            onAdd={search.addFilter}
            onSavePreset={search.addPreset}
            lang={lang}
          />
        )}

        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {showDefault && (
            <SearchDefaultState
              recentSearches={search.recentSearchesList}
              presets={search.presetsList}
              onClearRecent={search.clearRecentSearches}
              onRemoveRecent={search.removeRecentSearch}
              onRemovePreset={search.removePreset}
              onSelectRecent={(q) => search.setQuery(q)}
              lang={lang}
            />
          )}

          {showIdLookup && (
            <SearchIdLookup match={search.idMatch} onClose={search.close} lang={lang} />
          )}

          {showResults && (
            <SearchResults
              prefixMode={search.prefixMode}
              contacts={search.filteredContacts}
              conversations={search.filteredConversations}
              actions={search.filteredActions}
              sources={search.filteredSources}
              focusedIndex={search.focusedIndex}
              allResults={search.allResults}
              lang={lang}
            />
          )}

          {showNoResults && (
            <SearchNoResults query={search.effectiveQuery} lang={lang} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
