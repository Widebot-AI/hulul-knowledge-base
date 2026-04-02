export type Lang = "en" | "ar";

const translations = {
  // AppShell
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.inbox": { en: "Inbox", ar: "البريد" },
  "nav.crm": { en: "CRM", ar: "إدارة العملاء" },
  "nav.agent": { en: "AI Agent", ar: "الوكيل الذكي" },
  "nav.kb": { en: "Knowledge Base", ar: "قاعدة المعرفة" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "nav.kb.short": { en: "KB", ar: "المعرفة" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "menu.profile": { en: "Profile", ar: "الملف الشخصي" },
  "menu.language": { en: "Language", ar: "اللغة" },
  "menu.darkMode": { en: "Dark Mode", ar: "الوضع الداكن" },
  "menu.lightMode": { en: "Light Mode", ar: "الوضع الفاتح" },
  "menu.devScreens": { en: "Dev Screens", ar: "شاشات التطوير" },
  "header.search": { en: "Search...", ar: "بحث..." },
  "header.energy": { en: "Energy", ar: "الطاقة" },
  "header.devScreens": { en: "Dev — Wireframe Screens", ar: "المطور — شاشات العرض" },
  "header.kbWireframes": { en: "KB Wireframes", ar: "شاشات قاعدة المعرفة" },

  // Sources
  "sources.title": { en: "Sources", ar: "المصادر" },
  "sources.add": { en: "Add sources", ar: "إضافة مصادر" },
  "sources.addSource": { en: "Add Source", ar: "إضافة مصدر" },
  "sources.storageUsed": { en: "Storage Used", ar: "التخزين المستخدم" },
  "sources.filesAdded": { en: "Files Added", ar: "الملفات المضافة" },
  "sources.noSources": { en: "No sources yet", ar: "لا توجد مصادر بعد" },
  "sources.noSourcesDesc": { en: "Add your first source to start asking questions.", ar: "أضف مصدرك الأول لبدء طرح الأسئلة." },
  "sources.filter": { en: "Filter sources...", ar: "تصفية المصادر..." },
  "sources.preview": { en: "Preview", ar: "معاينة" },
  "sources.rename": { en: "Rename", ar: "إعادة تسمية" },
  "sources.delete": { en: "Delete", ar: "حذف" },
  "sources.retry": { en: "Retry", ar: "إعادة المحاولة" },
  "sources.retryCleanup": { en: "Retry cleanup", ar: "إعادة التنظيف" },
  "sources.maxRetries": { en: "Max retries reached — contact support", ar: "تم الوصول للحد الأقصى — تواصل مع الدعم" },
  "sources.notQueryable": { en: "No longer queryable — partial deletion", ar: "لم يعد قابلاً للاستعلام — حذف جزئي" },
  "sources.attempts": { en: "attempts", ar: "محاولات" },
  "sources.selected": { en: "sources selected", ar: "مصادر محددة" },
  "sources.viewAll": { en: "View all sources", ar: "عرض كل المصادر" },

  // Status labels
  "status.fetching": { en: "Fetching", ar: "جلب" },
  "status.uploading": { en: "Uploading", ar: "رفع" },
  "status.pending": { en: "Pending", ar: "قيد الانتظار" },
  "status.indexing": { en: "Indexing", ar: "فهرسة" },
  "status.ready": { en: "Ready", ar: "جاهز" },
  "status.failed": { en: "Failed", ar: "فشل" },
  "status.archived": { en: "Archived", ar: "مؤرشف" },
  "status.cleanupPending": { en: "Cleanup Pending", ar: "بانتظار التنظيف" },

  // Chat
  "chat.askQuestion": { en: "Ask a question about your sources...", ar: "اطرح سؤالاً حول مصادرك..." },
  "chat.addSourcesToStart": { en: "Add sources to start chatting", ar: "أضف مصادر لبدء المحادثة" },
  "chat.askAboutSources": { en: "Ask a question about your sources", ar: "اطرح سؤالاً حول مصادرك" },
  "chat.sourcesGroundAI": { en: "Your selected sources will be used to ground AI responses", ar: "سيتم استخدام المصادر المحددة لتأسيس إجابات الذكاء الاصطناعي" },
  "chat.uploadFilesOrUrls": { en: "Upload files or add URLs to your Knowledge Base", ar: "ارفع ملفات أو أضف روابط إلى قاعدة المعرفة" },
  "chat.sessionWarning": { en: "This conversation is getting long. Consider resetting to maintain response quality.", ar: "المحادثة أصبحت طويلة. فكر في إعادة التعيين للحفاظ على جودة الإجابات." },
  "chat.sessionLimit": { en: "Session limit reached. Please reset your conversation to continue chatting.", ar: "تم الوصول لحد الجلسة. يرجى إعادة تعيين المحادثة للمتابعة." },
  "chat.sessionLimitShort": { en: "Session limit reached. Reset to continue.", ar: "تم الوصول للحد. أعد التعيين للمتابعة." },
  "chat.addAndSelect": { en: "Add and select sources to start chatting.", ar: "أضف وحدد المصادر لبدء المحادثة." },
  "chat.reset": { en: "Reset", ar: "إعادة تعيين" },
  "chat.resetSession": { en: "Reset Session", ar: "إعادة تعيين الجلسة" },
  "chat.resetConversation": { en: "Reset Conversation", ar: "إعادة تعيين المحادثة" },
  "chat.resetConfirmMsg": { en: "Your conversation history will be cleared and a fresh session will begin. Selected sources will remain unchanged.", ar: "سيتم مسح سجل المحادثة وبدء جلسة جديدة. ستبقى المصادر المحددة كما هي." },
  "chat.cancel": { en: "Cancel", ar: "إلغاء" },
  "chat.thinking": { en: "Thinking...", ar: "جارٍ التفكير..." },
  "chat.addNote": { en: "Add note", ar: "إضافة ملاحظة" },
  "chat.interrupted": { en: "Response interrupted — partial content shown", ar: "تم مقاطعة الإجابة — يُعرض محتوى جزئي" },
  "chat.citation": { en: "Citation", ar: "اقتباس" },
  "chat.source": { en: "Source", ar: "المصدر" },
  "chat.type": { en: "Type", ar: "النوع" },
  "chat.status": { en: "Status", ar: "الحالة" },
  "chat.uploaded": { en: "Uploaded", ar: "تاريخ الرفع" },
  "chat.excerpt": { en: "Excerpt", ar: "مقتطف" },
  "chat.sourceDeleted": { en: "This source is no longer available.", ar: "هذا المصدر لم يعد متاحاً." },
  "chat.deleted": { en: "Deleted", ar: "محذوف" },

  // Activation
  "activation.title": { en: "Knowledge Base", ar: "قاعدة المعرفة" },
  "activation.desc": { en: "Add sources to create a knowledge base AI can reference.", ar: "أضف مصادر لإنشاء قاعدة معرفة يمكن للذكاء الاصطناعي الرجوع إليها." },
  "activation.dropOrClick": { en: "Drop files here or click to upload", ar: "اسحب الملفات هنا أو انقر للرفع" },
  "activation.dropHere": { en: "Drop files here", ar: "اسحب الملفات هنا" },
  "activation.supported": { en: "Supported: PDF, DOCX, PPTX, TXT, MD, and more", ar: "المدعوم: PDF, DOCX, PPTX, TXT, MD, والمزيد" },
  "activation.indexed": { en: "Sources are indexed for AI-powered search and citation", ar: "تتم فهرسة المصادر للبحث والاقتباس بالذكاء الاصطناعي" },
  "activation.pdf": { en: "PDF", ar: "PDF" },
  "activation.website": { en: "Website", ar: "موقع ويب" },
  "activation.pasteText": { en: "Paste text", ar: "لصق نص" },

  // No Access
  "noAccess.title": { en: "Access Restricted", ar: "الوصول مقيد" },
  "noAccess.desc": { en: "You don't have permission to access the Knowledge Base. Please contact your workspace administrator to request access.", ar: "ليس لديك صلاحية الوصول إلى قاعدة المعرفة. يرجى التواصل مع مسؤول مساحة العمل لطلب الوصول." },

  // Add Source Modal
  "addSource.title": { en: "Add Source", ar: "إضافة مصدر" },
  "addSource.fileUpload": { en: "File Upload", ar: "رفع ملف" },
  "addSource.url": { en: "URL", ar: "رابط" },
  "addSource.dropOrBrowse": { en: "Drop files here or click to browse", ar: "اسحب الملفات هنا أو انقر للتصفح" },
  "addSource.fileFormats": { en: "PDF, DOCX, PPTX, XLSX, TXT, MD, HTML, code files — up to 10 files, 10 MB each", ar: "PDF, DOCX, PPTX, XLSX, TXT, MD, HTML, ملفات برمجية — حتى 10 ملفات، 10 ميجابايت لكل ملف" },
  "addSource.unsupported": { en: "Unsupported file type", ar: "نوع ملف غير مدعوم" },
  "addSource.upload": { en: "Upload", ar: "رفع" },
  "addSource.uploadFiles": { en: "Upload Files", ar: "رفع الملفات" },
  "addSource.uploadDemo": { en: "Upload Demo File", ar: "رفع ملف تجريبي" },
  "addSource.urlLabel": { en: "Web Page URL", ar: "رابط صفحة الويب" },
  "addSource.urlPlaceholder": { en: "https://example.com/docs/guide", ar: "https://example.com/docs/guide" },
  "addSource.urlRequired": { en: "Please enter a URL", ar: "يرجى إدخال رابط" },
  "addSource.urlInvalid": { en: "Please enter a valid URL starting with http:// or https://", ar: "يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://" },
  "addSource.urlNote": { en: "Only publicly accessible pages are supported.", ar: "يتم دعم الصفحات العامة فقط." },
  "addSource.addUrl": { en: "Add URL", ar: "إضافة رابط" },

  // Delete Confirm
  "delete.title": { en: "Delete Source", ar: "حذف المصدر" },
  "delete.confirm": { en: "Are you sure you want to delete", ar: "هل أنت متأكد من حذف" },
  "delete.permanent": { en: "This action is permanent and cannot be undone.", ar: "هذا الإجراء دائم ولا يمكن التراجع عنه." },

  // Source Preview
  "preview.added": { en: "Added", ar: "تمت الإضافة" },
  "preview.notAvailable": { en: "Preview Not Available", ar: "المعاينة غير متاحة" },
  "preview.notAvailableDesc": { en: "This file type cannot be previewed in the browser. Download the file to view its contents.", ar: "لا يمكن معاينة هذا النوع من الملفات في المتصفح. حمّل الملف لعرض محتوياته." },
  "preview.download": { en: "Download File", ar: "تحميل الملف" },
  "preview.pdfArea": { en: "PDF preview rendering area", ar: "منطقة معاينة PDF" },
  "preview.pdfViewer": { en: "Inline PDF viewer for browser-renderable files", ar: "عارض PDF مدمج للملفات القابلة للعرض" },

  // Stack Settings
  "stack.title": { en: "Conversational AI Models", ar: "نماذج الذكاء الاصطناعي للمحادثات" },
  "stack.desc": { en: "Configure AI stacks for your workspace channels.", ar: "اضبط حزم الذكاء الاصطناعي لقنوات مساحة العمل." },
  "stack.readOnly": { en: "You have view-only access. Contact your workspace Owner or Admin to make changes.", ar: "لديك صلاحية العرض فقط. تواصل مع مالك أو مسؤول مساحة العمل لإجراء تغييرات." },
  "stack.kbTitle": { en: "Knowledge Base", ar: "قاعدة المعرفة" },
  "stack.kbDesc": { en: "Ground responses in your indexed sources", ar: "اربط الإجابات بمصادرك المفهرسة" },
  "stack.active": { en: "Active", ar: "نشط" },
  "stack.channels": { en: "Connected Channels", ar: "القنوات المتصلة" },
  "stack.channelHint": { en: "All enabled channels are auto-connected. Per-channel opt-out coming soon.", ar: "جميع القنوات المفعلة متصلة تلقائياً. إلغاء الاشتراك لكل قناة قريباً." },
  "stack.streaming": { en: "Streaming", ar: "البث المباشر" },
  "stack.streamingDesc": { en: "In-app KB chat always uses streaming. Channel streaming depends on capability.", ar: "محادثة قاعدة المعرفة تستخدم البث دائماً. بث القنوات يعتمد على القدرة." },
  "stack.perChannel": { en: "Per-channel", ar: "لكل قناة" },
  "stack.prompt": { en: "Custom System Prompt", ar: "رسالة النظام المخصصة" },
  "stack.promptHint": { en: "A platform-level system prompt is always prepended and cannot be edited.", ar: "يتم دائماً إضافة رسالة نظام على مستوى المنصة ولا يمكن تعديلها." },
  "stack.disableWarning": { en: "Disabling the KB stack will route subsequent channel queries to the previously active stack. If no fallback stack exists, channels will stop receiving AI responses.", ar: "تعطيل حزمة قاعدة المعرفة سيحول استعلامات القنوات إلى الحزمة النشطة السابقة. إذا لم توجد حزمة بديلة، ستتوقف القنوات عن تلقي إجابات الذكاء الاصطناعي." },

  // Token Reporting
  "token.breadcrumb": { en: "Settings → Subscription → Billing", ar: "الإعدادات → الاشتراك → الفوترة" },
  "token.title": { en: "AI Services", ar: "خدمات الذكاء الاصطناعي" },
  "token.desc": { en: "Knowledge Base usage against your workspace plan.", ar: "استخدام قاعدة المعرفة مقابل خطة مساحة العمل." },
  "token.errorTitle": { en: "Failed to Load Usage Data", ar: "فشل تحميل بيانات الاستخدام" },
  "token.errorDesc": { en: "We couldn't retrieve your usage data. Please try again.", ar: "لم نتمكن من استرداد بيانات الاستخدام. يرجى المحاولة مرة أخرى." },
  "token.usage": { en: "Token Usage", ar: "استخدام التوكنات" },
  "token.storage": { en: "Storage", ar: "التخزين" },
  "token.files": { en: "Files", ar: "الملفات" },
  "token.consumed": { en: "consumed this billing cycle", ar: "مستهلك هذه الدورة" },
  "token.ofCapacity": { en: "Of total storage capacity", ar: "من إجمالي سعة التخزين" },
  "token.fileLimit": { en: "of file limit used", ar: "من حد الملفات مستخدم" },
  "token.breakdown": { en: "Token Consumption Breakdown", ar: "تفصيل استهلاك التوكنات" },
  "token.sourceCol": { en: "Source", ar: "المصدر" },
  "token.inputTokens": { en: "Input Tokens", ar: "توكنات الإدخال" },
  "token.outputTokens": { en: "Output Tokens", ar: "توكنات الإخراج" },
  "token.totalTokens": { en: "Total Tokens", ar: "إجمالي التوكنات" },
  "token.inAppChat": { en: "In-App KB Chat", ar: "محادثة قاعدة المعرفة" },
  "token.channelSessions": { en: "Channel Sessions", ar: "جلسات القنوات" },
  "token.summarization": { en: "Summarization", ar: "التلخيص" },
  "token.total": { en: "Total", ar: "الإجمالي" },

  // Retention
  "retention.inactivity": { en: "Inactivity notice:", ar: "إشعار عدم النشاط:" },
  "retention.archiveDate": { en: "Your Knowledge Base sources will be archived on", ar: "سيتم أرشفة مصادر قاعدة المعرفة في" },
  "retention.dueToInactivity": { en: "due to inactivity.", ar: "بسبب عدم النشاط." },
  "retention.finalReminder": { en: "Final reminder:", ar: "تذكير أخير:" },
  "retention.archiveIn": { en: "Your sources will be archived in", ar: "سيتم أرشفة مصادرك خلال" },
  "retention.3days": { en: "3 days", ar: "3 أيام" },
  "retention.subExpired": { en: "Subscription expired:", ar: "انتهى الاشتراك:" },
  "retention.archiveOnDate": { en: "Sources will be archived on", ar: "سيتم أرشفة المصادر في" },
  "retention.alsoActive": { en: "Also active:", ar: "نشط أيضاً:" },
  "retention.inactivityCountdown": { en: "Inactivity countdown — archival on April 15, 2026.", ar: "العد التنازلي لعدم النشاط — الأرشفة في 15 أبريل 2026." },
  "retention.sourcesArchived": { en: "Sources archived.", ar: "تم أرشفة المصادر." },
  "retention.renewDesc": { en: "Renew your subscription and reactivate sources to resume querying.", ar: "جدد اشتراكك وأعد تفعيل المصادر لاستئناف الاستعلام." },
  "retention.upgradePlan": { en: "Upgrade plan", ar: "ترقية الخطة" },

  // Common
  "common.note": { en: "Note:", ar: "ملاحظة:" },

  // Search
  "nav.search": { en: "Search", ar: "بحث" },
  "search.placeholder": { en: "Search records, actions, help docs...", ar: "بحث في السجلات، الإجراءات، المستندات..." },
  "search.savedPresets": { en: "Saved Presets", ar: "الإعدادات المحفوظة" },
  "search.recentSearches": { en: "Recent Searches", ar: "عمليات البحث الأخيرة" },
  "search.clearAll": { en: "Clear all", ar: "مسح الكل" },
  "search.emptyTitle": { en: "Start typing to search across CRM, Inbox, Analytics", ar: "ابدأ الكتابة للبحث في إدارة العملاء، البريد، التحليلات" },
  "search.emptySubtitle": { en: "Use Cmd+K from any page", ar: "استخدم Cmd+K من أي صفحة" },
  "search.actions": { en: "Actions", ar: "الإجراءات" },
  "search.contacts": { en: "Contacts", ar: "جهات الاتصال" },
  "search.conversations": { en: "Conversations", ar: "المحادثات" },
  "search.sources": { en: "Sources", ar: "المصادر" },
  "search.allModules": { en: "All Modules", ar: "جميع الوحدات" },
  "search.crm": { en: "CRM", ar: "إدارة العملاء" },
  "search.inbox": { en: "Inbox", ar: "البريد الوارد" },
  "search.campaigns": { en: "Campaigns", ar: "الحملات" },
  "search.analytics": { en: "Analytics", ar: "التحليلات" },
  "search.all": { en: "All", ar: "الكل" },
  "search.smartScope": { en: "Smart Scope", ar: "النطاق الذكي" },
  "search.smartScopeOn": { en: "Smart Scope ON", ar: "النطاق الذكي مُفعل" },
  "search.smartScopeOff": { en: "Smart Scope OFF", ar: "النطاق الذكي مُعطل" },
  "search.viewAll": { en: "View all", ar: "عرض الكل" },
  "search.results": { en: "results", ar: "نتائج" },
  "search.noResults": { en: "No results for", ar: "لا توجد نتائج لـ" },
  "search.tryDifferent": { en: "Try different keywords or check spelling", ar: "جرب كلمات مختلفة أو تحقق من الإملاء" },
  "search.aiHelp": { en: "Need help? Ask the AI assistant", ar: "تحتاج مساعدة؟ اسأل مساعد الذكاء الاصطناعي" },
  "search.createRequest": { en: "Create a request", ar: "إنشاء طلب" },
  "search.actionsOnly": { en: "Searching actions only", ar: "البحث في الإجراءات فقط" },
  "search.peopleOnly": { en: "Searching people only", ar: "البحث في الأشخاص فقط" },
  "search.idLookup": { en: "Exact ID lookup", ar: "بحث دقيق بالمعرف" },
  "search.navigatingTo": { en: "Navigating to", ar: "الانتقال إلى" },
  "search.navigatingIn": { en: "Navigating in 1.5s... Press Esc to cancel", ar: "الانتقال خلال 1.5 ثانية... اضغط Esc للإلغاء" },
  "search.saveAsPreset": { en: "Save as preset", ar: "حفظ كإعداد مسبق" },
  "search.presetName": { en: "Preset name", ar: "اسم الإعداد" },
  "search.open": { en: "Open", ar: "مفتوح" },
  "search.pending": { en: "Pending", ar: "قيد الانتظار" },
  "search.closed": { en: "Closed", ar: "مغلق" },
  "search.shortcutActions": { en: "Actions", ar: "الإجراءات" },
  "search.shortcutPeople": { en: "People", ar: "الأشخاص" },
  "search.shortcutIdLookup": { en: "ID Lookup", ar: "بحث بالمعرف" },
  "search.shortcuts": { en: "Shortcuts", ar: "اختصارات" },

  // Activation Error
  "activation.errorMsg": { en: "Something went wrong. Please try again.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى." },
  "activation.retry": { en: "Retry", ar: "إعادة المحاولة" },

  // Upload & Validation
  "upload.unsupportedType": { en: "Unsupported file type", ar: "نوع ملف غير مدعوم" },
  "upload.fileTooLarge": { en: "Exceeds 10 MB limit", ar: "يتجاوز حد 10 ميجابايت" },
  "upload.duplicateName": { en: "File already exists — delete or rename", ar: "الملف موجود بالفعل — احذفه أو أعد تسميته" },
  "upload.storageCapExceeded": { en: "Would exceed storage cap. Manage sources or upgrade.", ar: "سيتجاوز حد التخزين. أدِر المصادر أو قم بالترقية." },
  "upload.fileLimitExceeded": { en: "Would exceed 50 file limit. Delete sources or upgrade.", ar: "سيتجاوز حد 50 ملفاً. احذف مصادر أو قم بالترقية." },
  "upload.batchMixed": { en: "Some files have validation errors", ar: "بعض الملفات بها أخطاء تحقق" },
  "upload.validFile": { en: "Ready to upload", ar: "جاهز للرفع" },
  "upload.processingFailed": { en: "Processing failed", ar: "فشلت المعالجة" },
  "upload.firstSourceReady": { en: "First source ready — chat is now available", ar: "المصدر الأول جاهز — المحادثة متاحة الآن" },
  "upload.storeExhausted": { en: "Unable to process upload. Please contact support.", ar: "تعذر معالجة الرفع. يرجى التواصل مع الدعم." },
  "upload.storeExhaustedDesc": { en: "Our storage infrastructure is temporarily at capacity.", ar: "البنية التحتية للتخزين في حالة امتلاء مؤقت." },

  // Plan Limits
  "warn.storageApproaching": { en: "Storage usage is approaching your plan limit. Manage sources or upgrade.", ar: "استخدام التخزين يقترب من حد خطتك. أدِر المصادر أو قم بالترقية." },
  "warn.filecountApproaching": { en: "File count is approaching your plan limit. Delete sources or upgrade.", ar: "عدد الملفات يقترب من حد خطتك. احذف مصادر أو قم بالترقية." },
  "warn.tokenApproaching": { en: "Token usage is approaching your plan limit. Consider upgrading.", ar: "استخدام التوكنات يقترب من حد خطتك. فكر في الترقية." },
  "warn.multiLimit": { en: "Multiple plan limits are approaching. Manage sources or upgrade.", ar: "عدة حدود للخطة تقترب. أدِر المصادر أو قم بالترقية." },
  "warn.storageDepleted": { en: "Storage limit reached. New uploads are blocked until you free space or upgrade.", ar: "تم الوصول لحد التخزين. الرفع محظور حتى تحرر مساحة أو تقوم بالترقية." },
  "warn.filecountDepleted": { en: "File limit reached. New uploads are blocked until you delete sources or upgrade.", ar: "تم الوصول لحد الملفات. الرفع محظور حتى تحذف مصادر أو تقوم بالترقية." },
  "warn.tokenDepleted": { en: "Token quota exhausted. All KB querying is disabled. Upgrade to continue.", ar: "نفدت حصة التوكنات. تم تعطيل جميع استعلامات قاعدة المعرفة. قم بالترقية للمتابعة." },
  "warn.dismiss": { en: "Dismiss", ar: "إخفاء" },
  "warn.upgrade": { en: "Upgrade", ar: "ترقية" },
  "warn.quotaRestored": { en: "Quota restored. KB querying is available again.", ar: "تم استعادة الحصة. استعلامات قاعدة المعرفة متاحة مرة أخرى." },

  // Source Selection
  "select.deselectBlocked": { en: "At least one source must be selected", ar: "يجب تحديد مصدر واحد على الأقل" },
  "select.autoSelected": { en: "Auto-selected next available source", ar: "تم تحديد المصدر المتاح التالي تلقائياً" },
  "select.noReady": { en: "No ready sources available", ar: "لا توجد مصادر جاهزة" },

  // Plan Data Loading
  "plan.loading": { en: "Loading plan data...", ar: "جارٍ تحميل بيانات الخطة..." },
  "plan.stripeFailed": { en: "Unable to load plan data. Retrying in background.", ar: "تعذر تحميل بيانات الخطة. إعادة المحاولة في الخلفية." },

  // Deletion States
  "delete.blockedProcessing": { en: "Cannot delete while source is processing", ar: "لا يمكن الحذف أثناء معالجة المصدر" },
  "delete.failed": { en: "Deletion failed. Please try again.", ar: "فشل الحذف. يرجى المحاولة مرة أخرى." },
  "delete.pendingCleanup": { en: "No longer queryable — partial deletion", ar: "لم يعد قابلاً للاستعلام — حذف جزئي" },
  "delete.retryCleanup": { en: "Retry cleanup", ar: "إعادة التنظيف" },
  "delete.cleanupLocked": { en: "Max retries reached — contact support", ar: "تم الوصول للحد الأقصى — تواصل مع الدعم" },
  "delete.attempts": { en: "attempts", ar: "محاولات" },

  // Chat Errors
  "chatError.aiServiceError": { en: "Something went wrong. Please try again.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى." },
  "chatError.sessionCreateFailed": { en: "Unable to start session.", ar: "تعذر بدء الجلسة." },
  "chatError.resetFailed": { en: "Reset failed. Your conversation is unchanged.", ar: "فشل إعادة التعيين. محادثتك لم تتغير." },
  "chatError.retryReset": { en: "Retry Reset", ar: "إعادة محاولة التعيين" },

  // Token Quota
  "quota.exhausted": { en: "Token quota exhausted", ar: "نفدت حصة التوكنات" },
  "quota.upgradePrompt": { en: "Upgrade your plan to continue querying.", ar: "قم بترقية خطتك لمتابعة الاستعلام." },
  "quota.midSession": { en: "Your workspace token quota has been fully exhausted during this session.", ar: "تم استنفاد حصة التوكنات الخاصة بمساحة العمل بالكامل خلال هذه الجلسة." },
  "quota.preSession": { en: "Your workspace token quota was exhausted before this session.", ar: "تم استنفاد حصة التوكنات قبل هذه الجلسة." },

  // Citation Edge Cases
  "citationEdge.deletedSource": { en: "Source no longer available", ar: "المصدر لم يعد متاحاً" },
  "citationEdge.noGrounding": { en: "Response generated without source citations", ar: "تم إنشاء الإجابة بدون اقتباسات من المصادر" },
  "citationEdge.snapshotData": { en: "Showing data from when this citation was created", ar: "عرض البيانات من وقت إنشاء هذا الاقتباس" },

  // Tagging
  "tag.addTag": { en: "Add tag", ar: "إضافة وسم" },
  "tag.removeTag": { en: "Remove", ar: "إزالة" },
  "tag.key": { en: "Key", ar: "المفتاح" },
  "tag.value": { en: "Value", ar: "القيمة" },
  "tag.limitReached": { en: "Maximum 10 tags per source", ar: "الحد الأقصى 10 وسوم لكل مصدر" },
  "tag.duplicateKey": { en: "Tag key already exists", ar: "مفتاح الوسم موجود بالفعل" },
  "tag.immutableNotice": { en: "Tags cannot be edited after upload", ar: "لا يمكن تعديل الوسوم بعد الرفع" },
  "tag.locked": { en: "Tags (locked)", ar: "الوسوم (مقفلة)" },

  // URL Ingestion Errors
  "url.success": { en: "URL source added successfully", ar: "تمت إضافة مصدر الرابط بنجاح" },
  "url.notFound": { en: "Page not found (404). Check the URL and try again.", ar: "الصفحة غير موجودة (404). تحقق من الرابط وحاول مرة أخرى." },
  "url.blocked": { en: "This page could not be accessed. It may be blocked or behind a firewall.", ar: "تعذر الوصول لهذه الصفحة. قد تكون محظورة أو خلف جدار حماية." },
  "url.noContent": { en: "No readable content could be extracted from this page. JavaScript-heavy or dynamically loaded pages may not be supported.", ar: "تعذر استخراج محتوى قابل للقراءة من هذه الصفحة. الصفحات المعتمدة على JavaScript أو المحملة ديناميكياً قد لا تكون مدعومة." },
  "url.authRequired": { en: "This page requires login or a subscription. Only publicly accessible pages are supported.", ar: "هذه الصفحة تتطلب تسجيل دخول أو اشتراك. يتم دعم الصفحات العامة فقط." },
  "url.rateLimited": { en: "Too many requests. Please try again in a moment.", ar: "طلبات كثيرة جداً. يرجى المحاولة بعد لحظة." },
  "url.timeout": { en: "The page took too long to load. Try again or use a different URL.", ar: "استغرقت الصفحة وقتاً طويلاً للتحميل. حاول مرة أخرى أو استخدم رابطاً مختلفاً." },
  "url.serviceUnavailable": { en: "Our URL processing service is temporarily unavailable. Please try again shortly.", ar: "خدمة معالجة الروابط غير متاحة مؤقتاً. يرجى المحاولة قريباً." },
  "url.contentTooLarge": { en: "The extracted content from this URL exceeds the 10 MB file size limit.", ar: "المحتوى المستخرج من هذا الرابط يتجاوز حد حجم الملف 10 ميجابايت." },
  "url.duplicate": { en: "This URL has already been added as a source.", ar: "تمت إضافة هذا الرابط كمصدر بالفعل." },

  // Preview States
  "previewState.textPreview": { en: "Text Preview", ar: "معاينة النص" },
  "previewState.loadFailed": { en: "Preview unavailable", ar: "المعاينة غير متاحة" },
  "previewState.loadFailedDesc": { en: "Unable to load preview. Source indexing and queryability are unaffected.", ar: "تعذر تحميل المعاينة. فهرسة المصدر وقابلية الاستعلام لم تتأثر." },
  "previewState.failedSource": { en: "Source failed to process", ar: "فشلت معالجة المصدر" },
  "previewState.failedSourceDesc": { en: "This source could not be indexed. Try uploading again.", ar: "تعذر فهرسة هذا المصدر. حاول الرفع مرة أخرى." },

  // Stack Settings Variants
  "stack.customPromptLabel": { en: "Custom System Prompt (Active)", ar: "رسالة النظام المخصصة (نشطة)" },
  "stack.disableConfirmTitle": { en: "Disable Knowledge Base Stack?", ar: "تعطيل حزمة قاعدة المعرفة؟" },
  "stack.disableConfirmDesc": { en: "Disabling will route subsequent channel queries to the previously active stack.", ar: "التعطيل سيحول استعلامات القنوات إلى الحزمة النشطة السابقة." },
  "stack.noFallbackTitle": { en: "No Fallback Stack Available", ar: "لا توجد حزمة بديلة" },
  "stack.noFallbackDesc": { en: "No other stack is configured. Channels will stop receiving AI responses until a new stack is set up.", ar: "لم يتم إعداد حزمة أخرى. ستتوقف القنوات عن تلقي إجابات الذكاء الاصطناعي حتى يتم إعداد حزمة جديدة." },
  "stack.disable": { en: "Disable", ar: "تعطيل" },
  "stack.keepEnabled": { en: "Keep Enabled", ar: "إبقاء مُفعّل" },

  // Channel Query States
  "channel.title": { en: "Channel Query Preview", ar: "معاينة استعلام القناة" },
  "channel.noSourcesContext": { en: "Responding from workspace customer context (no KB sources available)", ar: "الرد من سياق عملاء مساحة العمل (لا توجد مصادر قاعدة معرفة)" },
  "channel.noSourcesBare": { en: "Responding with base instructions only (no KB sources or customer context)", ar: "الرد بالتعليمات الأساسية فقط (لا مصادر أو سياق عملاء)" },
  "channel.quotaDepleted": { en: "No response sent — token quota exhausted", ar: "لم يتم إرسال رد — نفدت حصة التوكنات" },
  "channel.quotaAdmin": { en: "Channels are not receiving AI responses. Upgrade your plan.", ar: "القنوات لا تتلقى إجابات الذكاء الاصطناعي. قم بترقية خطتك." },
  "channel.whatsappUser": { en: "WhatsApp User", ar: "مستخدم واتساب" },
  "channel.botReply": { en: "Bot Reply", ar: "رد البوت" },

  // Retention New Variants
  "retention.renewed": { en: "Subscription renewed. All sources retained.", ar: "تم تجديد الاشتراك. تم الاحتفاظ بجميع المصادر." },
  "retention.activityResumed": { en: "Activity detected. Archival cancelled.", ar: "تم اكتشاف نشاط. تم إلغاء الأرشفة." },
  "retention.reactivating": { en: "Reactivating...", ar: "جارٍ إعادة التفعيل..." },
  "retention.reactivationFailed": { en: "Reactivation failed. Please try again.", ar: "فشلت إعادة التفعيل. يرجى المحاولة مرة أخرى." },
  "retention.reactivate": { en: "Reactivate", ar: "إعادة التفعيل" },

  // Activation
  "activation.activate": { en: "Activate Knowledge Base", ar: "تفعيل قاعدة المعرفة" },

  // Phase 1: Warning Banner
  "kb.warn.storageApproaching": { en: "Storage usage is approaching your plan limit.", ar: "استخدام التخزين يقترب من حد خطتك." },
  "kb.warn.filecountApproaching": { en: "File count is approaching your plan limit.", ar: "عدد الملفات يقترب من حد خطتك." },
  "kb.warn.tokenApproaching": { en: "Token usage is approaching your plan limit.", ar: "استخدام التوكنات يقترب من حد خطتك." },
  "kb.warn.multiApproaching": { en: "Multiple plan limits are approaching.", ar: "عدة حدود للخطة تقترب." },
  "kb.warn.storageDepleted": { en: "Storage limit reached. New uploads are blocked until you free space or upgrade.", ar: "تم الوصول لحد التخزين. الرفع محظور حتى تحرر مساحة أو تقوم بالترقية." },
  "kb.warn.filecountDepleted": { en: "File limit reached. New uploads are blocked until you delete sources or upgrade.", ar: "تم الوصول لحد الملفات. الرفع محظور حتى تحذف مصادر أو تقوم بالترقية." },
  "kb.warn.tokenDepleted": { en: "Token quota exhausted. All KB querying is disabled. Upgrade to continue.", ar: "نفدت حصة التوكنات. تم تعطيل جميع استعلامات قاعدة المعرفة. قم بالترقية للمتابعة." },
  "kb.warn.manageOrUpgrade": { en: "Manage sources or upgrade.", ar: "أدِر المصادر أو قم بالترقية." },
  "kb.warn.upgrade": { en: "Upgrade", ar: "ترقية" },
  "kb.warn.dismiss": { en: "Dismiss", ar: "إخفاء" },
  "kb.warn.quotaDepleted": { en: "Upgrade your plan to continue querying.", ar: "قم بترقية خطتك لمتابعة الاستعلام." },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

export default translations;
