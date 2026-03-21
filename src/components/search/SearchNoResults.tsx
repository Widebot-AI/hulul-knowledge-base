import { Search, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { t, type Lang } from '@/components/wireframes/translations';

export function SearchNoResults({ query, lang }: { query: string; lang: Lang }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm font-medium text-foreground">
        {t("search.noResults", lang)} "{query}"
      </p>
      <p className="text-xs text-muted-foreground mt-1">{t("search.tryDifferent", lang)}</p>

      <Separator className="my-5 w-48" />

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm text-foreground">{t("search.aiHelp", lang)}</span>
      </div>
      <div className="flex gap-2 w-full max-w-xs">
        <Input placeholder="Ask a follow-up..." className="h-8 text-xs" />
        <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
          {t("search.createRequest", lang)}
        </Button>
      </div>
    </div>
  );
}
