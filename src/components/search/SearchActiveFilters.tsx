import { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t, type Lang } from '@/components/wireframes/translations';
import type { ActiveFilter } from '@/hooks/useSearch';

interface Props {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onAdd: (filter: ActiveFilter) => void;
  onSavePreset: (name: string, nameAr: string, filters: ActiveFilter[]) => void;
  lang: Lang;
}

const availableFilters: ActiveFilter[] = [
  { key: 'date', label: 'Date: This week', labelAr: 'التاريخ: هذا الأسبوع' },
  { key: 'status', label: 'Status: Open', labelAr: 'الحالة: مفتوح' },
  { key: 'channel', label: 'Channel: WhatsApp', labelAr: 'القناة: واتساب' },
];

const suggestedFilters: ActiveFilter[] = [
  { key: 'owner', label: 'Owner', labelAr: 'المالك' },
  { key: 'tags', label: 'Tags', labelAr: 'العلامات' },
];

export function SearchActiveFilters({ filters, onRemove, onAdd, onSavePreset, lang }: Props) {
  const [saveName, setSaveName] = useState('');
  const [showSave, setShowSave] = useState(false);

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border flex-wrap">
      {filters.map(f => (
        <Badge key={f.key} variant="default" className="text-[10px] gap-1 pe-1">
          {lang === 'ar' ? f.labelAr : f.label}
          <button onClick={() => onRemove(f.key)} className="hover:bg-primary-foreground/20 rounded-full p-0.5">
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}

      {availableFilters.filter(af => !filters.find(f => f.key === af.key)).map(af => (
        <Badge
          key={af.key}
          variant="outline"
          className="text-[10px] cursor-pointer hover:bg-accent"
          onClick={() => onAdd(af)}
        >
          {lang === 'ar' ? af.labelAr : af.label}
        </Badge>
      ))}

      {suggestedFilters.filter(sf => !filters.find(f => f.key === sf.key)).map(sf => (
        <Popover key={sf.key}>
          <PopoverTrigger asChild>
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent opacity-60">
              {lang === 'ar' ? sf.labelAr : sf.label}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <p className="text-xs text-muted-foreground">No options available</p>
          </PopoverContent>
        </Popover>
      ))}

      <span className="ms-auto" />

      {!showSave ? (
        <button onClick={() => setShowSave(true)} className="text-xs text-primary hover:underline">
          {t("search.saveAsPreset", lang)}
        </button>
      ) : (
        <div className="flex gap-1">
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={t("search.presetName", lang)}
            className="h-6 text-xs w-32"
          />
          <Button
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => {
              if (saveName.trim()) {
                onSavePreset(saveName, saveName, filters);
                setSaveName('');
                setShowSave(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
