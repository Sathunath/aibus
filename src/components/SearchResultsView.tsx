import React, { useState } from 'react';
import {
  Search,
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
  ExternalLink,
  Sparkles,
  Filter,
  CheckCircle2,
  Building2,
  X,
  ArrowUpRight,
  Tag,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  Department,
  Supplier,
  ProductItem,
  EmailMessage,
  CredentialVaultItem,
  Brand,
  SEOArticle,
  AIAgent,
  SheetDepartment,
} from '../types';

interface SearchResultsViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: Department) => void;
  setActiveSubTab?: (subTab: string) => void;
  suppliers?: Supplier[];
  products?: ProductItem[];
  emails?: EmailMessage[];
  credentials?: CredentialVaultItem[];
  brands?: Brand[];
  seoArticles?: SEOArticle[];
  workflows?: any[];
  agents?: AIAgent[];
  departments?: SheetDepartment[];
}

export function SearchResultsView({
  searchQuery,
  setSearchQuery,
  setActiveTab,
  setActiveSubTab,
  suppliers = [],
  products = [],
  emails = [],
  credentials = [],
  brands = [],
  seoArticles = [],
  workflows = [],
  agents = [],
  departments = [],
}: SearchResultsViewProps) {
  const [localInput, setLocalInput] = useState(searchQuery);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleRunSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localInput.trim());
  };

  const query = searchQuery.trim().toLowerCase();

  // Search logic across all entities
  const matchedBrands: Array<{ id: string; name: string; type: 'brand' | 'account'; handle?: string; platform?: string; channelCount?: number }> = [];
  if (query) {
    brands.forEach((b) => {
      if (b.name.toLowerCase().includes(query)) {
        matchedBrands.push({ id: b.id, name: b.name, type: 'brand', channelCount: b.accounts?.length || 0 });
      }
      b.accounts?.forEach((acc) => {
        if (acc.handle.toLowerCase().includes(query) || acc.platform.toLowerCase().includes(query)) {
          matchedBrands.push({
            id: acc.id,
            name: `@${acc.handle}`,
            type: 'account',
            handle: acc.handle,
            platform: acc.platform,
          });
        }
      });
    });
  }

  const matchedSuppliers = query
    ? suppliers.filter((s) => `${s.name} ${s.contactEmail} ${s.niche} ${s.contactPhone}`.toLowerCase().includes(query))
    : [];

  const matchedProducts = query
    ? products.filter((p) => `${p.title} ${p.sku} ${p.category}`.toLowerCase().includes(query))
    : [];

  const matchedEmails = query
    ? emails.filter((m) => `${m.subject} ${m.sender} ${m.senderEmail} ${m.fullText}`.toLowerCase().includes(query))
    : [];

  const matchedCredentials = query
    ? credentials.filter((c) => `${c.accountName} ${c.username} ${c.category} ${c.notes}`.toLowerCase().includes(query))
    : [];

  const matchedSeo = query
    ? seoArticles.filter((a) => `${a.title} ${a.targetKeyword} ${a.targetProductCategory}`.toLowerCase().includes(query))
    : [];

  const matchedAgents = query
    ? agents.filter((a) => `${a.name} ${a.role} ${a.department} ${a.currentTask}`.toLowerCase().includes(query))
    : [];

  const matchedSheetTopics: Array<{ topicId: string; topicName: string; deptId: string; deptName: string; status: string }> = [];
  if (query) {
    departments.forEach((dept) => {
      dept.topics?.forEach((top) => {
        if (top.topic.toLowerCase().includes(query) || dept.name.toLowerCase().includes(query)) {
          matchedSheetTopics.push({
            topicId: top.id,
            topicName: top.topic,
            deptId: dept.id,
            deptName: dept.name,
            status: top.status,
          });
        }
      });
    });
  }

  const totalResults =
    matchedBrands.length +
    matchedSuppliers.length +
    matchedProducts.length +
    matchedEmails.length +
    matchedCredentials.length +
    matchedSeo.length +
    matchedAgents.length +
    matchedSheetTopics.length;

  return (
    <div className="w-full space-y-2 p-1 sm:p-2 bg-slate-50 min-h-screen text-slate-900">
      {/* Search Bar Header */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xs">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center space-x-2">
                <span>Dedicated Search Results Studio</span>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {totalResults} Matches Found
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                Live multi-database index across Brands, Social, Suppliers, Catalog, Credentials, Emails & Sheets
              </p>
            </div>
          </div>

          {/* Explicit Search Form */}
          <form onSubmit={handleRunSearch} className="w-full sm:w-auto flex items-center space-x-1.5">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Search anything (e.g. 'Peshadari', 'SKU', 'supplier')..."
                className="w-full pl-8 pr-7 h-[30px] bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900"
              />
              {localInput && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalInput('');
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-[30px] px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
          {[
            { id: 'all', label: 'All Results', count: totalResults },
            { id: 'brands', label: 'Brands & Channels', count: matchedBrands.length },
            { id: 'suppliers', label: 'Suppliers DB', count: matchedSuppliers.length },
            { id: 'products', label: 'Product Catalog', count: matchedProducts.length },
            { id: 'emails', label: 'Emails Inbox', count: matchedEmails.length },
            { id: 'credentials', label: 'Credentials Vault', count: matchedCredentials.length },
            { id: 'sheets', label: 'Sheet Topics', count: matchedSheetTopics.length },
            { id: 'seo', label: 'SEO Articles', count: matchedSeo.length },
            { id: 'agents', label: 'AI Fleet', count: matchedAgents.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`h-[24px] px-2.5 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                activeCategoryFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9px] font-mono px-1 py-0.1 rounded-full ${
                  activeCategoryFilter === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Container */}
      {!query ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Enter a Search Term</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Type any brand name (e.g. <span className="font-mono text-indigo-600 font-bold">Peshadari</span>), supplier, product SKU, email subject, password account, or Google sheet topic above and click Search.
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Direct Results Found for "{searchQuery}"</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for keywords like "Peshadari", "supplier", "gmail", "fabric", "USA", or check spelling.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 1. Brands & Social Channels */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'brands') && matchedBrands.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Brands & Social Channels ({matchedBrands.length})</span>
                </span>
                <button
                  onClick={() => setActiveTab('social')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open Social Media Hub</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {matchedBrands.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {item.type === 'brand' ? `Brand • ${item.channelCount} channels` : `Account • ${item.platform?.toUpperCase()}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('social');
                      }}
                      className="h-[24px] px-2 bg-white border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Suppliers DB */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'suppliers') && matchedSuppliers.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suppliers & Vendors ({matchedSuppliers.length})</span>
                </span>
                <button
                  onClick={() => {
                    setActiveTab('rc_supplier_list');
                    if (setActiveSubTab) setActiveSubTab('all_contacts');
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open RC Supplier Directory</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-extrabold text-slate-600 uppercase">
                      <th className="py-1 px-2">Supplier Name</th>
                      <th className="py-1 px-2">Niche</th>
                      <th className="py-1 px-2">Contact Email</th>
                      <th className="py-1 px-2">Status</th>
                      <th className="py-1 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedSuppliers.map((sup) => (
                      <tr key={sup.id} className="border-b border-slate-100 hover:bg-slate-50 compact-table-row">
                        <td className="py-1 px-2 font-bold text-slate-900">{sup.name}</td>
                        <td className="py-1 px-2 text-slate-600">{sup.niche}</td>
                        <td className="py-1 px-2 font-mono text-[10px] text-indigo-700">{sup.contactEmail}</td>
                        <td className="py-1 px-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 uppercase">
                            {sup.status}
                          </span>
                        </td>
                        <td className="py-1 px-2 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('rc_supplier_list');
                              if (setActiveSubTab) setActiveSubTab('all_contacts');
                            }}
                            className="h-[22px] px-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Open Directory
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Product Catalog */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'products') && matchedProducts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Box className="w-3.5 h-3.5 text-blue-600" />
                  <span>Product Catalog ({matchedProducts.length})</span>
                </span>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open Catalog Studio</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{p.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">${p.sellingPrice}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>SKU: {p.sku}</span>
                      <span>Stock: {p.stockQuantity}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="w-full h-[22px] bg-white border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 text-[10px] font-bold rounded transition-colors cursor-pointer"
                    >
                      View in Catalog Studio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Credentials Vault */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'credentials') && matchedCredentials.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Credentials & Account Hints ({matchedCredentials.length})</span>
                </span>
                <button
                  onClick={() => setActiveTab('credentials_vault')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open Credentials Vault</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {matchedCredentials.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{c.accountName}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {c.category || 'Personal'}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-indigo-700 truncate">Username: {c.username}</p>
                    {c.passwordHint && (
                      <p className="text-[10px] text-slate-500 italic truncate">Hint: {c.passwordHint}</p>
                    )}
                    <button
                      onClick={() => setActiveTab('credentials_vault')}
                      className="w-full h-[22px] bg-white border border-slate-300 hover:border-amber-600 hover:text-amber-700 text-slate-700 text-[10px] font-bold rounded transition-colors cursor-pointer"
                    >
                      Manage in Vault
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Email Inbox */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'emails') && matchedEmails.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Email Messages ({matchedEmails.length})</span>
                </span>
                <button
                  onClick={() => setActiveTab('emails')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open Email Command Center</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                {matchedEmails.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{m.subject}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        From: {m.sender} &lt;{m.senderEmail}&gt;
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('emails')}
                      className="h-[22px] px-2.5 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded text-[10px] font-bold transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      Open Email
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Google Sheet Topics */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'sheets') && matchedSheetTopics.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  <span>Google Sheet Department Topics ({matchedSheetTopics.length})</span>
                </span>
                <button
                  onClick={() => setActiveTab('sheets_db')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Open Sheet DB Hub</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {matchedSheetTopics.map((top) => (
                  <div
                    key={top.topicId}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:border-teal-300 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{top.topicName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Department: {top.deptName}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('sheets_db')}
                      className="h-[22px] px-2 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded text-[10px] font-bold transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      Open Topic
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
