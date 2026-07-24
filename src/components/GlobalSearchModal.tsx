import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ShoppingBag,
  Share2,
  DollarSign,
  KeyRound,
  Zap,
  Mail,
  Box,
  FileText,
  Workflow,
  Database,
  Bot,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Sliders,
  Grid,
  CheckCircle2,
  Building2,
  FolderKanban,
  FileCode,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Department, Supplier, ProductItem, EmailMessage, CredentialVaultItem, Brand, SEOArticle, AIAgent } from '../types';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'panel' | 'supplier' | 'product' | 'credential' | 'email' | 'social' | 'seo' | 'workflow' | 'agent';
  targetTab: Department;
  targetSubTab?: string;
  icon: React.ElementType;
  badge?: string;
  meta?: string;
  isExactMatch?: boolean;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: Department) => void;
  setActiveSubTab?: (subTab: string) => void;
  onPerformFullSearch?: (query: string) => void;
  suppliers?: Supplier[];
  products?: ProductItem[];
  emails?: EmailMessage[];
  credentials?: CredentialVaultItem[];
  brands?: Brand[];
  seoArticles?: SEOArticle[];
  workflows?: any[];
  agents?: AIAgent[];
}

// Menu Panels Index
const ALL_MENU_PANELS: { tab: Department; subTab?: string; label: string; desc: string; icon: React.ElementType; category: string; keywords: string[] }[] = [
  { tab: 'rc_supplier_list', subTab: 'all_contacts', label: 'Supplier Directory (RC Master)', desc: 'Master supplier database, contacts & compliance', icon: ShoppingBag, category: 'Database Admin Panels', keywords: ['supplier', 'contacts', 'vendor', 'rc', 'directory', 'list', 'factory'] },
  { tab: 'rc_supplier_list', subTab: 'clean_suppliers', label: 'Clean Suppliers', desc: 'Verified clean supplier records', icon: CheckCircle2, category: 'Database Admin Panels', keywords: ['clean', 'verified', 'supplier'] },
  { tab: 'rc_supplier_list', subTab: 'usa_suppliers', label: 'USA Suppliers', desc: 'Domestic USA supplier list', icon: Building2, category: 'Database Admin Panels', keywords: ['usa', 'domestic', 'american', 'supplier'] },
  { tab: 'rc_supplier_list', subTab: 'wholesalers', label: 'Wholesalers & Distributors', desc: 'Wholesale product distributors', icon: Box, category: 'Database Admin Panels', keywords: ['wholesale', 'distributor', 'bulk'] },
  { tab: 'rc_supplier_list', subTab: 'fabric_suppliers', label: 'Fabric & Raw Mills', desc: 'Textile and raw material mills', icon: Grid, category: 'Database Admin Panels', keywords: ['fabric', 'mill', 'textile', 'raw'] },
  { tab: 'rc_supplier_list', subTab: 'real_brands', label: 'Real Brands DB', desc: 'Brand relationships and manufacturer links', icon: Share2, category: 'Database Admin Panels', keywords: ['brands', 'real', 'manufacturer'] },
  { tab: 'credentials_vault', label: 'Credentials Vault', desc: 'Secure passwords, API keys & account credentials', icon: KeyRound, category: 'Security & Auth', keywords: ['credential', 'password', 'key', 'login', 'vault', 'auth', 'secret', 'pass'] },
  { tab: 'emails', label: 'Email Command Center', desc: 'AI Email inbox, customer logs & drafts', icon: Mail, category: 'Communications', keywords: ['email', 'inbox', 'mail', 'message', 'draft', 'reply'] },
  { tab: 'catalog', label: 'Product Catalog Studio', desc: 'SKUs, pricing, inventory items & product database', icon: Box, category: 'Products & Inventory', keywords: ['product', 'catalog', 'sku', 'item', 'inventory', 'pricing'] },
  { tab: 'inventory', label: 'Inventory Sync Engine', desc: 'Multi-channel stock synchronization', icon: Sliders, category: 'Products & Inventory', keywords: ['inventory', 'stock', 'sync', 'warehouse'] },
  { tab: 'social', label: 'Social Media Hub', desc: 'Brand channels, social accounts & posts', icon: Share2, category: 'Marketing & Brand', keywords: ['social', 'brand', 'instagram', 'facebook', 'tiktok', 'handle', 'post'] },
  { tab: 'finance', label: 'Financial Ledger & P&L', desc: 'Revenue, expenses, balance sheets & transactions', icon: DollarSign, category: 'Finance', keywords: ['finance', 'money', 'ledger', 'cost', 'revenue', 'bank', 'cash', 'profit'] },
  { tab: 'command_center', label: 'AI Command Center', desc: 'AI Fleet agents, live executions & tasks', icon: Zap, category: 'AI Fleet', keywords: ['command', 'ai', 'agent', 'bot', 'fleet', 'task', 'automation'] },
  { tab: 'workflows', label: 'Workflow Automation Engine', desc: 'Automated triggers, rules & background jobs', icon: Workflow, category: 'Automation', keywords: ['workflow', 'rule', 'automation', 'trigger', 'job'] },
  { tab: 'seo', label: 'SEO & Content Studio', desc: 'Articles, keywords & content publishing', icon: FileText, category: 'Marketing & Brand', keywords: ['seo', 'article', 'content', 'blog', 'keyword'] },
  { tab: 'sheets_db', label: 'Google Sheets DB Hub', desc: 'Departmental sheet database tables', icon: Database, category: 'Database Admin Panels', keywords: ['sheet', 'google', 'table', 'database', 'row'] },
  { tab: 'db_diagnostics', label: 'Database Diagnostics', desc: 'Database health, metrics & schema validator', icon: FileCode, category: 'Developer Tools', keywords: ['database', 'health', 'diagnostics', 'schema', 'sql'] },
  { tab: 'tech_ops', label: 'TechOps & System Monitor', desc: 'Server health, logs & infrastructure status', icon: ShieldAlert, category: 'Developer Tools', keywords: ['techops', 'monitor', 'server', 'logs', 'system'] },
];

const SYNONYM_MAP: Record<string, string[]> = {
  mail: ['email', 'inbox', 'message', 'draft'],
  email: ['mail', 'inbox', 'message'],
  pass: ['credentials', 'password', 'key', 'login', 'vault'],
  password: ['credentials', 'key', 'login', 'vault'],
  key: ['credentials', 'password', 'vault'],
  money: ['finance', 'ledger', 'cost', 'revenue', 'bank'],
  cash: ['finance', 'ledger'],
  supplier: ['vendor', 'factory', 'contacts', 'rc'],
  vendor: ['supplier', 'contacts'],
  product: ['item', 'sku', 'catalog', 'stock'],
  sku: ['product', 'item', 'catalog'],
  social: ['instagram', 'facebook', 'brand', 'post', 'tiktok', 'handle'],
  bot: ['agent', 'command', 'ai'],
  ai: ['agent', 'command', 'bot'],
};

export function GlobalSearchModal({
  isOpen,
  onClose,
  setActiveTab,
  setActiveSubTab,
  onPerformFullSearch,
  suppliers = [],
  products = [],
  emails = [],
  credentials = [],
  brands = [],
  seoArticles = [],
  workflows = [],
  agents = [],
}: GlobalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = searchQuery.trim().toLowerCase();
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  const expandedTokens = new Set<string>();
  tokens.forEach((t) => {
    expandedTokens.add(t);
    if (SYNONYM_MAP[t]) {
      SYNONYM_MAP[t].forEach((syn) => expandedTokens.add(syn));
    }
  });

  const exactMatches: SearchItem[] = [];
  const suggestedItems: SearchItem[] = [];

  if (cleanQuery.length > 0) {
    // 1. Search Menu Panels
    ALL_MENU_PANELS.forEach((panel) => {
      const isDirectMatch = panel.label.toLowerCase().includes(cleanQuery) || panel.desc.toLowerCase().includes(cleanQuery);
      const isSynonymMatch = Array.from(expandedTokens).some((token) => panel.keywords.some((k) => k.includes(token)));

      if (isDirectMatch) {
        exactMatches.push({
          id: `panel-${panel.tab}-${panel.subTab || 'default'}`,
          title: panel.label,
          subtitle: panel.desc,
          category: panel.category,
          type: 'panel',
          targetTab: panel.tab,
          targetSubTab: panel.subTab,
          icon: panel.icon,
          badge: 'Admin Panel',
          isExactMatch: true,
        });
      } else if (isSynonymMatch) {
        suggestedItems.push({
          id: `panel-suggested-${panel.tab}-${panel.subTab || 'default'}`,
          title: panel.label,
          subtitle: `Related Panel: ${panel.desc}`,
          category: panel.category,
          type: 'panel',
          targetTab: panel.tab,
          targetSubTab: panel.subTab,
          icon: panel.icon,
          badge: 'Suggested',
          isExactMatch: false,
        });
      }
    });

    // 2. Search Credentials Vault DB
    credentials.forEach((c) => {
      const directMatch = c.accountName.toLowerCase().includes(cleanQuery) || c.username.toLowerCase().includes(cleanQuery);
      const categoryMatch = (c.category || '').toLowerCase().includes(cleanQuery) || (c.notes || '').toLowerCase().includes(cleanQuery);
      if (directMatch) {
        exactMatches.push({
          id: c.id,
          title: c.accountName,
          subtitle: `User: ${c.username} • Category: ${c.category || 'Personal'}`,
          category: 'Credentials Vault',
          type: 'credential',
          targetTab: 'credentials_vault',
          icon: KeyRound,
          badge: 'Credential',
          meta: c.lastUpdated,
          isExactMatch: true,
        });
      } else if (categoryMatch || Array.from(expandedTokens).some((t) => (c.accountName + c.username + c.category).toLowerCase().includes(t))) {
        suggestedItems.push({
          id: `suggested-${c.id}`,
          title: c.accountName,
          subtitle: `User: ${c.username}`,
          category: 'Credentials Vault',
          type: 'credential',
          targetTab: 'credentials_vault',
          icon: KeyRound,
          badge: 'Suggested',
          meta: c.lastUpdated,
          isExactMatch: false,
        });
      }
    });

    // 3. Search Suppliers DB
    suppliers.forEach((s) => {
      const matchText = `${s.name} ${s.contactEmail} ${s.niche} ${s.contactPhone}`.toLowerCase();
      if (s.name.toLowerCase().includes(cleanQuery) || s.contactEmail.toLowerCase().includes(cleanQuery)) {
        exactMatches.push({
          id: s.id,
          title: s.name,
          subtitle: `Niche: ${s.niche} • ${s.contactEmail}`,
          category: 'Supplier Directory',
          type: 'supplier',
          targetTab: 'rc_supplier_list',
          targetSubTab: 'all_contacts',
          icon: ShoppingBag,
          badge: s.status,
          meta: s.shippingOrigin,
          isExactMatch: true,
        });
      } else if (Array.from(expandedTokens).some((t) => matchText.includes(t))) {
        suggestedItems.push({
          id: `suggested-${s.id}`,
          title: s.name,
          subtitle: `Niche: ${s.niche}`,
          category: 'Supplier Directory',
          type: 'supplier',
          targetTab: 'rc_supplier_list',
          targetSubTab: 'all_contacts',
          icon: ShoppingBag,
          badge: 'Vendor',
          isExactMatch: false,
        });
      }
    });

    // 4. Search Products DB
    products.forEach((p) => {
      const matchText = `${p.title} ${p.sku} ${p.category}`.toLowerCase();
      if (p.title.toLowerCase().includes(cleanQuery) || p.sku.toLowerCase().includes(cleanQuery)) {
        exactMatches.push({
          id: p.id,
          title: p.title,
          subtitle: `SKU: ${p.sku} • Category: ${p.category} • $${p.sellingPrice}`,
          category: 'Product Catalog',
          type: 'product',
          targetTab: 'catalog',
          icon: Box,
          badge: `Stock: ${p.stockQuantity}`,
          isExactMatch: true,
        });
      } else if (Array.from(expandedTokens).some((t) => matchText.includes(t))) {
        suggestedItems.push({
          id: `suggested-${p.id}`,
          title: p.title,
          subtitle: `SKU: ${p.sku}`,
          category: 'Product Catalog',
          type: 'product',
          targetTab: 'catalog',
          icon: Box,
          badge: 'SKU',
          isExactMatch: false,
        });
      }
    });

    // 5. Search Brands & Social Channels
    brands.forEach((b) => {
      if (b.name.toLowerCase().includes(cleanQuery)) {
        exactMatches.push({
          id: b.id,
          title: b.name,
          subtitle: `Brand with ${b.accounts?.length || 0} channels`,
          category: 'Social Media & Brands',
          type: 'social',
          targetTab: 'social',
          icon: Share2,
          badge: 'Brand',
          isExactMatch: true,
        });
      }
      b.accounts?.forEach((acc) => {
        if (acc.handle.toLowerCase().includes(cleanQuery)) {
          exactMatches.push({
            id: acc.id,
            title: `@${acc.handle} (${acc.platform.toUpperCase()})`,
            subtitle: `Brand: ${b.name}`,
            category: 'Social Media',
            type: 'social',
            targetTab: 'social',
            icon: Share2,
            badge: acc.platform,
            isExactMatch: true,
          });
        }
      });
    });

    // 6. Search Email Messages DB
    emails.forEach((m) => {
      if (m.subject.toLowerCase().includes(cleanQuery) || m.senderEmail.toLowerCase().includes(cleanQuery)) {
        exactMatches.push({
          id: m.id,
          title: m.subject,
          subtitle: `From: ${m.sender} <${m.senderEmail}>`,
          category: 'Email Inbox',
          type: 'email',
          targetTab: 'emails',
          icon: Mail,
          badge: m.replyStatus,
          isExactMatch: true,
        });
      }
    });

    // 7. Search SEO Articles
    seoArticles.forEach((a) => {
      if (a.title.toLowerCase().includes(cleanQuery) || a.targetKeyword.toLowerCase().includes(cleanQuery)) {
        exactMatches.push({
          id: a.id,
          title: a.title,
          subtitle: `Keyword: ${a.targetKeyword}`,
          category: 'SEO Studio',
          type: 'seo',
          targetTab: 'seo',
          icon: FileText,
          badge: a.status,
          isExactMatch: true,
        });
      }
    });
  }

  const handleSelectResult = (item: SearchItem) => {
    setActiveTab(item.targetTab);
    if (item.targetSubTab && setActiveSubTab) {
      setActiveSubTab(item.targetSubTab);
    }
    onClose();
  };

  const handlePerformFullSearch = () => {
    if (onPerformFullSearch) {
      onPerformFullSearch(searchQuery);
    } else {
      setActiveTab('search_results');
    }
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePerformFullSearch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-2 sm:px-4">
      {/* Backdrop scrim */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Search Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 max-h-[85vh]">
        {/* Search Header Input */}
        <div className="p-2 sm:p-3 bg-slate-900 border-b border-slate-800 flex items-center space-x-2 shrink-0">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type search term (e.g. 'Peshadari')... Press Enter ↵ or click Search"
            className="w-full bg-transparent text-white text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer shrink-0"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* EXPLICIT CLICKABLE SEARCH BUTTON */}
          <button
            type="button"
            onClick={handlePerformFullSearch}
            className="h-[30px] px-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-xs rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer shrink-0 transition-all border border-indigo-400 hover:scale-[1.02]"
            title="Click to view all search results on dedicated Search Page"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Search</span>
          </button>

          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-1 rounded border border-slate-700 shrink-0 hidden sm:inline">
            ESC
          </span>
        </div>

        {/* Live Status Bar */}
        <div className="px-3 py-1 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {cleanQuery.length === 0
                ? 'Instant Sensitive Indexing • Start typing to view exact matches & suggestions'
                : `Exact Matches: ${exactMatches.length} • Suggestions: ${suggestedItems.length}`}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-500 font-mono">
            <span>Press ESC to exit</span>
          </div>
        </div>

        {/* Results List View */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cleanQuery.length === 0 ? (
            <div className="py-2 space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
                Quick Jump Master Database Admin Panels
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {ALL_MENU_PANELS.slice(0, 10).map((panel) => {
                  const Icon = panel.icon;
                  return (
                    <button
                      key={panel.tab + (panel.subTab || '')}
                      onClick={() => {
                        setActiveTab(panel.tab);
                        if (panel.subTab && setActiveSubTab) setActiveSubTab(panel.subTab);
                        onClose();
                      }}
                      className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-md bg-white border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-900 truncate">
                          {panel.label}
                        </h4>
                        <p className="text-[9px] text-slate-500 truncate">{panel.desc}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: Exact Found Matches First */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Exact Found Matches ({exactMatches.length})</span>
                  </span>
                </div>

                {exactMatches.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic px-2 py-1 bg-slate-50 rounded border border-slate-100">
                    No direct exact matches found for "{searchQuery}". See intelligent suggestions below.
                  </p>
                ) : (
                  exactMatches.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all cursor-pointer group shadow-2xs h-[32px] sm:h-[30px]"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className="p-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="min-w-0 flex-1 flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 truncate max-w-[200px]">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate hidden sm:inline">
                              • {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                          {item.badge && (
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                              {item.badge}
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 hidden sm:inline">
                            {item.category}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Section 2: Intelligent Suggestions Below */}
              {(suggestedItems.length > 0 || exactMatches.length === 0) && (
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Intelligent Suggestions & Related Panels ({suggestedItems.length || ALL_MENU_PANELS.slice(0, 4).length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {(suggestedItems.length > 0 ? suggestedItems : ALL_MENU_PANELS.slice(0, 4).map(p => ({
                      id: `suggested-panel-${p.tab}`,
                      title: p.label,
                      subtitle: p.desc,
                      category: p.category,
                      type: 'panel' as const,
                      targetTab: p.tab,
                      targetSubTab: p.subTab,
                      icon: p.icon,
                      badge: 'Suggested'
                    }))).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="flex items-center justify-between p-1.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-amber-50 hover:border-amber-200 text-left transition-all cursor-pointer group h-[32px] sm:h-[30px]"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="p-1 rounded bg-white border border-slate-200 text-slate-700 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-amber-950 truncate">
                                {item.title}
                              </h4>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-2 bg-slate-900 text-white border-t border-slate-800 text-[10px] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Press <kbd className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded border border-slate-700">↵ Enter</kbd> to search</span>
            <span>Press <kbd className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded border border-slate-700">ESC</kbd> to exit</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePerformFullSearch}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors border border-indigo-500 shadow-2xs"
            >
              <Search className="w-3 h-3" />
              <span>Dedicated Search Page ↵</span>
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors border border-slate-700"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
