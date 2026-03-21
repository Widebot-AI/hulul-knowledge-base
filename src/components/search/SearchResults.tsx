import { Zap, Users, MessageCircle, BookOpen, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { t, type Lang } from '@/components/wireframes/translations';
import type { Contact, Conversation, Action, Source } from '@/lib/search-data';
import type { PrefixMode } from '@/hooks/useSearch';

interface Props {
  prefixMode: PrefixMode;
  contacts: Contact[];
  conversations: Conversation[];
  actions: Action[];
  sources: Source[];
  focusedIndex: number;
  allResults: { type: string; id: string }[];
  lang: Lang;
}

const statusColors = {
  open: 'bg-green-500/10 text-green-600',
  pending: 'bg-orange-500/10 text-orange-600',
  closed: 'bg-muted text-muted-foreground',
};

export function SearchResults({ prefixMode, contacts, conversations, actions, sources, focusedIndex, allResults, lang }: Props) {
  const { toast } = useToast();

  const isFocused = (type: string, id: string) => {
    if (focusedIndex < 0) return false;
    const item = allResults[focusedIndex];
    return item?.type === type && item?.id === id;
  };

  const navigate = (label: string) => {
    toast({ title: `${t("search.navigatingTo", lang)} ${label}` });
  };

  const showActions = prefixMode === 'none' || prefixMode === 'actions';
  const showContacts = prefixMode === 'none' || prefixMode === 'people';
  const showConversations = prefixMode === 'none';
  const showSources = prefixMode === 'none';

  return (
    <div className="py-1">
      {showActions && actions.length > 0 && (
        <ResultGroup icon={<Zap className="h-3.5 w-3.5" />} label={t("search.actions", lang)} count={actions.length}>
          {actions.map(a => (
            <div
              key={a.id}
              onClick={() => navigate(lang === 'ar' ? a.nameAr : a.name)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${isFocused('action', a.id) ? 'bg-accent' : ''}`}
            >
              <Zap className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="text-sm flex-1">{lang === 'ar' ? a.nameAr : a.name}</span>
              <Badge variant="secondary" className="text-[10px]">{lang === 'ar' ? a.moduleAr : a.module}</Badge>
            </div>
          ))}
        </ResultGroup>
      )}

      {showContacts && contacts.length > 0 && (
        <ResultGroup icon={<Users className="h-3.5 w-3.5" />} label={t("search.contacts", lang)} count={contacts.length}>
          {contacts.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(lang === 'ar' ? c.nameAr : c.name)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${isFocused('contact', c.id) ? 'bg-accent' : ''}`}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{c.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{lang === 'ar' ? c.nameAr : c.name}</span>
                <span className="text-xs text-muted-foreground ms-2">{lang === 'ar' ? c.companyAr : c.company}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{c.lastActivity}</span>
            </div>
          ))}
        </ResultGroup>
      )}

      {showConversations && conversations.length > 0 && (
        <ResultGroup icon={<MessageCircle className="h-3.5 w-3.5" />} label={t("search.conversations", lang)} count={conversations.length}>
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(c.contact)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${isFocused('conversation', c.id) ? 'bg-accent' : ''}`}
            >
              <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                c.channel === 'whatsapp' ? 'bg-green-500' : c.channel === 'email' ? 'bg-blue-500' : 'bg-orange-500'
              }`} />
              <span className="text-sm flex-1 truncate">{lang === 'ar' ? c.previewAr : c.preview}</span>
              <Badge className={`text-[10px] ${statusColors[c.status]}`}>
                {t(`search.${c.status}` as any, lang)}
              </Badge>
            </div>
          ))}
        </ResultGroup>
      )}

      {showSources && sources.length > 0 && (
        <ResultGroup icon={<BookOpen className="h-3.5 w-3.5" />} label={t("search.sources", lang)} count={sources.length}>
          {sources.map(s => (
            <div
              key={s.id}
              onClick={() => navigate(lang === 'ar' ? s.titleAr : s.title)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${isFocused('source', s.id) ? 'bg-accent' : ''}`}
            >
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm flex-1 truncate">{lang === 'ar' ? s.titleAr : s.title}</span>
              <Badge variant="outline" className="text-[10px]">{lang === 'ar' ? s.typeAr : s.type}</Badge>
              <span className="text-xs text-muted-foreground">{s.meta}</span>
            </div>
          ))}
        </ResultGroup>
      )}
    </div>
  );
}

function ResultGroup({ icon, label, count, children }: { icon: React.ReactNode; label: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">{count}</Badge>
      </div>
      {children}
    </div>
  );
}
