export interface Contact {
  id: string;
  name: string;
  nameAr: string;
  company: string;
  companyAr: string;
  initials: string;
  lastActivity: string;
}

export interface Conversation {
  id: string;
  channel: 'whatsapp' | 'email' | 'phone';
  preview: string;
  previewAr: string;
  status: 'open' | 'pending' | 'closed';
  contact: string;
}

export interface Action {
  id: string;
  name: string;
  nameAr: string;
  module: string;
  moduleAr: string;
}

export interface Source {
  id: string;
  title: string;
  titleAr: string;
  type: string;
  typeAr: string;
  meta: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

export interface SavedPreset {
  id: string;
  name: string;
  nameAr: string;
  filters: { label: string; labelAr: string }[];
}

export const contacts: Contact[] = [
  { id: 'CNT-45210', name: 'Ahmed Hassan', nameAr: 'أحمد حسن', company: 'Acme Corp', companyAr: 'شركة أكمي', initials: 'AH', lastActivity: '2 min ago' },
  { id: 'CNT-45211', name: 'Sarah Miller', nameAr: 'سارة ميلر', company: 'TechFlow Inc', companyAr: 'تك فلو', initials: 'SM', lastActivity: '15 min ago' },
  { id: 'CNT-45212', name: 'Omar Al-Rashid', nameAr: 'عمر الراشد', company: 'Gulf Solutions', companyAr: 'حلول الخليج', initials: 'OR', lastActivity: '1 hour ago' },
  { id: 'CNT-45213', name: 'Fatima Zahra', nameAr: 'فاطمة زهراء', company: 'DataBridge', companyAr: 'داتا بريدج', initials: 'FZ', lastActivity: 'Yesterday' },
  { id: 'CNT-45214', name: 'James Chen', nameAr: 'جيمس تشين', company: 'NovaTech', companyAr: 'نوفا تك', initials: 'JC', lastActivity: '3 days ago' },
];

export const conversations: Conversation[] = [
  { id: 'CONV-1001', channel: 'whatsapp', preview: 'Hi, I need help with my subscription renewal...', previewAr: 'مرحبا، أحتاج مساعدة في تجديد اشتراكي...', status: 'open', contact: 'Ahmed Hassan' },
  { id: 'CONV-1002', channel: 'email', preview: 'Re: Invoice #4523 - Payment confirmation needed', previewAr: 'رد: فاتورة #4523 - تأكيد الدفع مطلوب', status: 'pending', contact: 'Sarah Miller' },
  { id: 'CONV-1003', channel: 'phone', preview: 'Missed call - Follow up on support ticket #891', previewAr: 'مكالمة فائتة - متابعة تذكرة الدعم #891', status: 'closed', contact: 'Omar Al-Rashid' },
  { id: 'CONV-1004', channel: 'whatsapp', preview: 'Thank you for the quick response! Everything is working now.', previewAr: 'شكراً على الرد السريع! كل شيء يعمل الآن.', status: 'open', contact: 'Fatima Zahra' },
];

export const actions: Action[] = [
  { id: 'ACT-1', name: 'Add Customer', nameAr: 'إضافة عميل', module: 'CRM', moduleAr: 'إدارة العملاء' },
  { id: 'ACT-2', name: 'Export Report', nameAr: 'تصدير تقرير', module: 'Analytics', moduleAr: 'التحليلات' },
  { id: 'ACT-3', name: 'Invite Team Member', nameAr: 'دعوة عضو فريق', module: 'Settings', moduleAr: 'الإعدادات' },
];

export const sources: Source[] = [
  { id: 'SRC-1', title: 'Getting Started with Contact Management', titleAr: 'البدء في إدارة جهات الاتصال', type: 'Help Docs', typeAr: 'مستندات المساعدة', meta: '5 min read' },
  { id: 'SRC-2', title: 'Q3 Performance Report.pdf', titleAr: 'تقرير أداء الربع الثالث.pdf', type: 'File', typeAr: 'ملف', meta: '2.4 MB' },
];

export const recentSearches: RecentSearch[] = [
  { id: 'RS-1', query: 'Ahmed Hassan', timestamp: '2 min ago' },
  { id: 'RS-2', query: 'subscription renewal', timestamp: '1 hour ago' },
  { id: 'RS-3', query: 'export contacts', timestamp: 'Yesterday' },
];

export const savedPresets: SavedPreset[] = [
  {
    id: 'SP-1',
    name: 'My open tickets this week',
    nameAr: 'تذاكري المفتوحة هذا الأسبوع',
    filters: [
      { label: 'Inbox', labelAr: 'البريد الوارد' },
      { label: 'Open', labelAr: 'مفتوح' },
      { label: 'This week', labelAr: 'هذا الأسبوع' },
    ],
  },
];
