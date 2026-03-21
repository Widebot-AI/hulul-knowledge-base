import { useState, useCallback, useEffect, useRef } from 'react';
import {
  contacts, conversations, actions, sources,
  recentSearches as defaultRecent, savedPresets as defaultPresets,
  type RecentSearch, type SavedPreset,
} from '@/lib/search-data';

export type EntityType = 'all' | 'contacts' | 'conversations' | 'campaigns' | 'sources';
export type ModuleScope = 'all' | 'crm' | 'inbox' | 'campaigns' | 'analytics';
export type PrefixMode = 'none' | 'actions' | 'people' | 'id';

export interface ActiveFilter {
  key: string;
  label: string;
  labelAr: string;
}

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('all');
  const [moduleScope, setModuleScope] = useState<ModuleScope>('all');
  const [smartScope, setSmartScope] = useState(false);
  const [recentSearchesList, setRecentSearchesList] = useState<RecentSearch[]>(defaultRecent);
  const [presetsList, setPresetsList] = useState<SavedPreset[]>(defaultPresets);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const prefixMode: PrefixMode = query.startsWith('>') ? 'actions'
    : query.startsWith('@') ? 'people'
    : query.startsWith('#') ? 'id'
    : 'none';

  const cleanQuery = prefixMode !== 'none' ? query.slice(1).trim() : query.trim();
  const effectiveQuery = prefixMode !== 'none' ? cleanQuery : debouncedQuery.trim();
  const hasResults = effectiveQuery.length >= 2;

  const filteredContacts = hasResults ? contacts.filter(c =>
    c.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    c.nameAr.includes(effectiveQuery)
  ) : [];

  const filteredConversations = hasResults ? conversations.filter(c =>
    c.preview.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    c.contact.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    c.previewAr.includes(effectiveQuery)
  ) : [];

  const filteredActions = hasResults ? actions.filter(a =>
    a.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    a.module.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    a.nameAr.includes(effectiveQuery)
  ) : [];

  const filteredSources = hasResults ? sources.filter(s =>
    s.title.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    s.titleAr.includes(effectiveQuery)
  ) : [];

  const idMatch = prefixMode === 'id' && cleanQuery.length > 0
    ? contacts.find(c => c.id.toLowerCase() === cleanQuery.toLowerCase())
    : null;

  const allResults: { type: string; id: string }[] = [];
  if (prefixMode === 'actions') {
    filteredActions.forEach(a => allResults.push({ type: 'action', id: a.id }));
  } else if (prefixMode === 'people') {
    filteredContacts.forEach(c => allResults.push({ type: 'contact', id: c.id }));
  } else if (prefixMode === 'id') {
    if (idMatch) allResults.push({ type: 'contact', id: idMatch.id });
  } else {
    filteredActions.forEach(a => allResults.push({ type: 'action', id: a.id }));
    filteredContacts.forEach(c => allResults.push({ type: 'contact', id: c.id }));
    filteredConversations.forEach(c => allResults.push({ type: 'conversation', id: c.id }));
    filteredSources.forEach(s => allResults.push({ type: 'source', id: s.id }));
  }

  const noResults = hasResults && allResults.length === 0;

  const clearRecentSearches = useCallback(() => setRecentSearchesList([]), []);
  const removeRecentSearch = useCallback((id: string) => {
    setRecentSearchesList(prev => prev.filter(s => s.id !== id));
  }, []);
  const removePreset = useCallback((id: string) => {
    setPresetsList(prev => prev.filter(p => p.id !== id));
  }, []);
  const addPreset = useCallback((name: string, nameAr: string, filters: ActiveFilter[]) => {
    setPresetsList(prev => [...prev, {
      id: `SP-${Date.now()}`,
      name,
      nameAr,
      filters: filters.map(f => ({ label: f.label, labelAr: f.labelAr })),
    }]);
  }, []);

  const addFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilters(prev => {
      if (prev.find(f => f.key === filter.key)) return prev;
      return [...prev, filter];
    });
  }, []);
  const removeFilter = useCallback((key: string) => {
    setActiveFilters(prev => prev.filter(f => f.key !== key));
  }, []);

  const open = useCallback(() => { setIsOpen(true); setFocusedIndex(-1); }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setDebouncedQuery('');
    setEntityType('all');
    setModuleScope('all');
    setActiveFilters([]);
    setFocusedIndex(-1);
  }, []);

  return {
    isOpen, open, close,
    query, setQuery,
    effectiveQuery, hasResults, noResults,
    prefixMode, cleanQuery, idMatch,
    entityType, setEntityType,
    moduleScope, setModuleScope,
    smartScope, setSmartScope,
    recentSearchesList, clearRecentSearches, removeRecentSearch,
    presetsList, removePreset, addPreset,
    activeFilters, addFilter, removeFilter,
    focusedIndex, setFocusedIndex,
    filteredContacts, filteredConversations, filteredActions, filteredSources,
    allResults,
  };
}
