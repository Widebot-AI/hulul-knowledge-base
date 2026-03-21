import { Zap, Users, Hash } from 'lucide-react';
import { t, type Lang } from '@/components/wireframes/translations';
import type { PrefixMode } from '@/hooks/useSearch';

const config = {
  actions: { icon: Zap, key: 'search.actionsOnly' as const, color: 'text-orange-500' },
  people: { icon: Users, key: 'search.peopleOnly' as const, color: 'text-primary' },
  id: { icon: Hash, key: 'search.idLookup' as const, color: 'text-green-500' },
} as const;

export function SearchPrefixBanner({ mode, lang }: { mode: Exclude<PrefixMode, 'none'>; lang: Lang }) {
  const { icon: Icon, key, color } = config[mode];

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/50 border-b border-border">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="text-xs font-medium text-foreground">{t(key, lang)}</span>
    </div>
  );
}
