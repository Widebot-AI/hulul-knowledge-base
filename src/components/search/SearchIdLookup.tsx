import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { t, type Lang } from '@/components/wireframes/translations';
import type { Contact } from '@/lib/search-data';

interface Props {
  match: Contact | null;
  onClose: () => void;
  lang: Lang;
}

export function SearchIdLookup({ match, onClose, lang }: Props) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!match) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({ title: `${t("search.navigatingTo", lang)} ${lang === 'ar' ? match.nameAr : match.name}` });
          onClose();
          return 100;
        }
        return prev + 100 / 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [match, toast, lang, onClose]);

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-sm text-muted-foreground">{t("search.noResults", lang)} ID</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <Card className="w-full max-w-sm p-4 shadow-lg border-primary/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{match.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{lang === 'ar' ? match.nameAr : match.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{match.id}</p>
          </div>
          <Badge variant="secondary">{lang === 'ar' ? match.companyAr : match.company}</Badge>
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">{t("search.navigatingIn", lang)}</p>
      <Progress value={progress} className="w-48 h-1" />
    </div>
  );
}
