import { Crosshair } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { t, type Lang } from '@/components/wireframes/translations';
import type { EntityType, ModuleScope } from '@/hooks/useSearch';

interface Props {
  entityType: EntityType;
  setEntityType: (v: EntityType) => void;
  moduleScope: ModuleScope;
  setModuleScope: (v: ModuleScope) => void;
  smartScope: boolean;
  setSmartScope: (v: boolean) => void;
  lang: Lang;
}

export function SearchFilterBar({ entityType, setEntityType, moduleScope, setModuleScope, smartScope, setSmartScope, lang }: Props) {
  const { toast } = useToast();

  const handleSmartScope = (checked: boolean) => {
    setSmartScope(checked);
    toast({ title: checked ? t("search.smartScopeOn", lang) : t("search.smartScopeOff", lang) });
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-border flex-wrap">
      <Select value={moduleScope} onValueChange={(v) => setModuleScope(v as ModuleScope)}>
        <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("search.allModules", lang)}</SelectItem>
          <SelectItem value="crm">{t("search.crm", lang)}</SelectItem>
          <SelectItem value="inbox">{t("search.inbox", lang)}</SelectItem>
          <SelectItem value="campaigns">{t("search.campaigns", lang)}</SelectItem>
          <SelectItem value="analytics">{t("search.analytics", lang)}</SelectItem>
        </SelectContent>
      </Select>

      <ToggleGroup type="single" value={entityType} onValueChange={(v) => v && setEntityType(v as EntityType)} className="gap-0.5">
        {(['all', 'contacts', 'conversations', 'campaigns', 'sources'] as const).map(val => (
          <ToggleGroupItem key={val} value={val} className="h-7 px-2.5 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            {t(`search.${val === 'all' ? 'all' : val}` as any, lang)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="ms-auto flex items-center gap-1.5">
        <Crosshair className="h-3.5 w-3.5 text-muted-foreground" />
        <Label htmlFor="smart-scope" className="text-xs text-muted-foreground cursor-pointer">{t("search.smartScope", lang)}</Label>
        <Switch id="smart-scope" checked={smartScope} onCheckedChange={handleSmartScope} className="scale-75" />
      </div>
    </div>
  );
}
