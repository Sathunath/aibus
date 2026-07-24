import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Copy,
  RefreshCw,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Tag,
  ExternalLink,
  Bot,
  UserCheck,
  Globe,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Inbox,
  ShieldCheck,
  Send
} from 'lucide-react';
import { RC_SUPPLIER_DATA, RcSupplierEntry } from '../data/rcSupplierData';
import { AdminDataTable, Column } from './AdminDataTable';

interface RcSupplierListStudioProps {
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
  onDraftEmail?: (email: string) => void;
}

export function RcSupplierListStudio({
  activeSubTab = 'all_contacts',
  onSubTabChange,
  onDraftEmail,
}: RcSupplierListStudioProps) {
  const [data, setData] = useState<RcSupplierEntry[]>(RC_SUPPLIER_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUsaStatus, setSelectedUsaStatus] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedBotFilter, setSelectedBotFilter] = useState<string>('All');
  const [activePresetFilter, setActivePresetFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [selectedEntryDetail, setSelectedEntryDetail] = useState<RcSupplierEntry | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New Supplier Form State
  const [newEmail, setNewEmail] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newType, setNewType] = useState<RcSupplierEntry['supplierType']>('Fabric Supplier');
  const [newSubject, setNewSubject] = useState('');

  // Auto-sync activeSubTab with preset filter if changed from sidebar
  React.useEffect(() => {
    if (activeSubTab === 'clean_suppliers') setActivePresetFilter('clean');
    else if (activeSubTab === 'usa_suppliers') setActivePresetFilter('usa');
    else if (activeSubTab === 'wholesalers') setActivePresetFilter('wholesalers');
    else if (activeSubTab === 'fabric_suppliers') setActivePresetFilter('fabric');
    else if (activeSubTab === 'real_brands') setActivePresetFilter('real');
    else if (activeSubTab === 'all_contacts') setActivePresetFilter('all');
  }, [activeSubTab]);

  // Compute Metrics
  const totalEmails = 412; // Master analysis count
  const realBrandCount = 260;
  const cleanSupplierCount = 23;
  const likelyUsaCount = 244;
  const botEmailCount = 152;

  // Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search Text
      const matchesSearch =
        searchQuery === '' ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceFolders.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.sampleSubject.toLowerCase().includes(searchQuery.toLowerCase());

      // Category Dropdown
      const matchesCategory =
        selectedCategory === 'All' || item.supplierType === selectedCategory;

      // USA Status Dropdown
      const matchesUsa =
        selectedUsaStatus === 'All' ||
        (selectedUsaStatus === 'USA' && item.isUsa) ||
        (selectedUsaStatus === 'Non-USA' && !item.isUsa);

      // Bot Status Dropdown
      const matchesBot =
        selectedBotFilter === 'All' ||
        (selectedBotFilter === 'Human' && !item.isBot) ||
        (selectedBotFilter === 'Bot' && item.isBot);

      // Topic Dropdown
      const matchesTopic =
        selectedTopic === 'All' || item.topicTags.includes(selectedTopic);

      // Preset Filter Buttons
      let matchesPreset = true;
      if (activePresetFilter === 'clean') {
        matchesPreset = !item.isBot && item.isUsa && item.isRealBrand;
      } else if (activePresetFilter === 'usa') {
        matchesPreset = item.isUsa;
      } else if (activePresetFilter === 'wholesalers') {
        matchesPreset = item.supplierType === 'Wholesaler';
      } else if (activePresetFilter === 'fabric') {
        matchesPreset = item.supplierType === 'Fabric Supplier';
      } else if (activePresetFilter === 'shipping') {
        matchesPreset = item.topicTags.some((t) => t.includes('Order') || t.includes('Shipping'));
      } else if (activePresetFilter === 'real') {
        matchesPreset = item.isRealBrand;
      } else if (activePresetFilter === 'bot') {
        matchesPreset = item.isBot;
      }

      return matchesSearch && matchesCategory && matchesUsa && matchesBot && matchesTopic && matchesPreset;
    });
  }, [
    data,
    searchQuery,
    selectedCategory,
    selectedUsaStatus,
    selectedBotFilter,
    selectedTopic,
    activePresetFilter,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Export functions
  const handleExportCSV = (all = false) => {
    const exportList = all ? data : filteredData;
    const headers = [
      'Email Address',
      'Domain Name',
      'Supplier Classification',
      'Industry Category',
      'Mail Folders',
      'Email Topics',
      'Message Count',
      'First Seen Date',
      'Last Seen Date',
      'Is Bot',
      'Likely USA',
      'Is Real Brand',
      'Sample Subject Line',
    ];

    const csvRows = exportList.map((item) => [
      `"${item.email}"`,
      `"${item.domain}"`,
      `"${item.supplierType}"`,
      `"${item.industryCategory}"`,
      `"${item.sourceFolders.join(', ')}"`,
      `"${item.topicTags.join(', ')}"`,
      item.occurrences,
      item.firstSeen,
      item.lastSeen,
      item.isBot,
      item.isUsa,
      item.isRealBrand,
      `"${item.sampleSubject.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...csvRows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rc_supplier_list_${all ? 'all' : 'filtered'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyEmailList = () => {
    const emails = filteredData.map((d) => d.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedNotification(`Copied ${filteredData.length} email addresses!`);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleAddNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const domainName = newDomain || newEmail.split('@')[1] || 'domain.com';
    const newEntry: RcSupplierEntry = {
      id: `rc-custom-${Date.now()}`,
      email: newEmail,
      domain: domainName,
      supplierType: newType,
      industryCategory: newType,
      sourceFolders: ['Thunderbird Verified'],
      topicTags: ['Product Inquiry', 'General Communication'],
      occurrences: 1,
      firstSeen: new Date().toISOString().split('T')[0],
      lastSeen: new Date().toISOString().split('T')[0],
      isBot: false,
      isUsa: true,
      isRealBrand: true,
      sampleSubject: newSubject || 'Wholesale Supplier Verification',
    };

    setData((prev) => [newEntry, ...prev]);
    setNewEmail('');
    setNewDomain('');
    setNewSubject('');
    setIsAddingNew(false);
  };

  const columns: Column<RcSupplierEntry>[] = [
    {
      id: 'email',
      header: 'Email Address',
      className: 'py-1 px-3 font-bold text-indigo-600 hover:underline',
      cell: (item) => (
        <div className="flex items-center space-x-1 truncate max-w-[200px]" title={item.email}>
          <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate text-[11px]">{item.email}</span>
        </div>
      ),
    },
    {
      id: 'domain',
      header: 'Domain',
      className: 'py-1 px-2.5 text-slate-600 font-medium',
      cell: (item) => (
        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200">
          {item.domain}
        </span>
      ),
    },
    {
      id: 'supplierType',
      header: 'Supplier Type',
      className: 'py-1 px-2.5',
      cell: (item) => (
        <span
          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
            item.supplierType === 'Fabric Supplier'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : item.supplierType === 'Wholesaler'
              ? 'bg-sky-100 text-sky-800 border border-sky-200'
              : item.supplierType === 'Platform/Service'
              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              : item.supplierType === 'Retail Brand'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {item.supplierType}
        </span>
      ),
    },
    {
      id: 'sourceFolders',
      header: 'Source Folders',
      className: 'py-1 px-2.5 text-slate-600 text-[10px] max-w-[180px] truncate',
      cell: (item) => (
        <span title={item.sourceFolders.join(', ')}>
          {item.sourceFolders.join(', ')}
        </span>
      ),
    },
    {
      id: 'isUsa',
      header: 'USA Status',
      headerClassName: 'text-center',
      className: 'py-1 px-2 text-center',
      cell: (item) =>
        item.isUsa ? (
          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            us USA
          </span>
        ) : (
          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-500">
            Intl
          </span>
        ),
    },
    {
      id: 'isBot',
      header: 'Bot Status',
      headerClassName: 'text-center',
      className: 'py-1 px-2 text-center',
      cell: (item) =>
        !item.isBot ? (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Real</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Bot className="w-2.5 h-2.5 text-slate-400" />
            <span>Bot</span>
          </span>
        ),
    },
    {
      id: 'topicTags',
      header: 'Topic Tags',
      className: 'py-1 px-2.5 max-w-[200px]',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.topicTags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="bg-slate-100 text-slate-600 text-[9px] font-medium px-1 py-0.2 rounded border border-slate-200 truncate"
            >
              {tag}
            </span>
          ))}
          {item.topicTags.length > 2 && (
            <span className="text-[8px] text-slate-400 font-bold self-center">
              +{item.topicTags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'occurrences',
      header: 'Count',
      headerClassName: 'text-right',
      className: 'py-1 px-2.5 text-right font-black text-slate-800 text-[10px] font-mono',
      cell: (item) => item.occurrences.toLocaleString(),
    },
    {
      id: 'action',
      header: 'Action',
      headerClassName: 'text-center',
      className: 'py-1 px-2.5 text-center',
      cell: (item) => (
        <div className="flex items-center justify-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedEntryDetail(item)}
            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[9px] font-bold transition cursor-pointer"
          >
            Details
          </button>
          {onDraftEmail && (
            <button
              onClick={() => onDraftEmail(item.email)}
              className="p-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded transition cursor-pointer"
              title="Draft Email Reply"
            >
              <Send className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-slate-50 p-1.5 space-y-2">
      {/* Page Header (Single 30px Bar) */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
          <h1 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            RC Supplier List & Analysis
          </h1>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Organize, analyze, and filter verified USA suppliers & mail
          </span>
        </div>

        {/* Action Button Bar (22px / 26px CTA) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setIsAddingNew(true)}
            className="h-[26px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold text-[10px] shadow-xs transition flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>

          <button
            onClick={() => handleExportCSV(false)}
            className="h-[22px] sm:h-[22px] px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[10px] border border-slate-200 transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>CSV (Filtered)</span>
          </button>

          <button
            onClick={() => handleExportCSV(true)}
            className="h-[22px] sm:h-[22px] px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[10px] border border-slate-200 transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>CSV (All 412)</span>
          </button>

          <button
            onClick={handleCopyEmailList}
            className="h-[22px] sm:h-[22px] px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md font-bold text-[10px] transition flex items-center space-x-1 cursor-pointer"
          >
            <Copy className="w-3 h-3 text-indigo-600" />
            <span>Copy Emails</span>
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] px-3 py-1 rounded-md font-medium flex items-center space-x-2 animate-fade-in shrink-0">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Inline Stat Chips (28px height, wrap on overflow) */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{totalEmails}</span> TOTAL EMAILS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{realBrandCount}</span> REAL BRAND EMAILS
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 mr-1" />
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{cleanSupplierCount}</span> CLEAN SUPPLIERS
        </div>

        <div className="h-[28px] px-2.5 bg-amber-50 border border-amber-200 rounded-md inline-flex items-center text-[10px] font-bold text-amber-800 shadow-2xs whitespace-nowrap">
          <Globe className="w-3.5 h-3.5 text-amber-600 mr-1" />
          <span className="text-amber-900 font-extrabold text-xs mr-1.5">{likelyUsaCount}</span> LIKELY USA SUPPLIERS
        </div>

        <div className="h-[28px] px-2.5 bg-slate-50 border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-500 shadow-2xs whitespace-nowrap">
          <Bot className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <span className="text-slate-700 font-extrabold text-xs mr-1.5">{botEmailCount}</span> BOT / AUTOMATED
        </div>
      </div>

      {/* Filter and Search Controls Bar (28px height container with 22px micro-inputs) */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-700 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[22px] bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Fabric Supplier">Fabric Supplier</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Platform/Service">Platform/Service</option>
            <option value="Retail Brand">Retail Brand</option>
            <option value="Internal Outgoing">Internal Outgoing</option>
            <option value="Other / Brand">Other / Brand</option>
          </select>

          <select
            value={selectedUsaStatus}
            onChange={(e) => {
              setSelectedUsaStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[22px] bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Locations</option>
            <option value="USA">Likely USA Only</option>
            <option value="Non-USA">International / Non-USA</option>
          </select>

          <select
            value={selectedBotFilter}
            onChange={(e) => {
              setSelectedBotFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[22px] bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Human">Human Contacts</option>
            <option value="Bot">Automated Mail</option>
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[22px] bg-slate-50 border border-slate-200 text-slate-800 rounded px-1.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Topics</option>
            <option value="Order Related">Order Related</option>
            <option value="Shipping Related">Shipping Related</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Pricing/Quote">Pricing / Quote</option>
            <option value="Payment Related">Payment Related</option>
            <option value="Account/Login">Account / Login</option>
            <option value="General Communication">General Communication</option>
          </select>

          <div className="relative flex-1 min-w-[140px]">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1" />
            <input
              type="text"
              placeholder="Search email, domain..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-[22px] bg-slate-50 border border-slate-200 text-slate-800 rounded pl-6 pr-2 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Preset Quick Tabs (22px micro-pills) */}
        <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-1">
          <button
            onClick={() => {
              setActivePresetFilter('all');
              if (onSubTabChange) onSubTabChange('all_contacts');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Contacts ({data.length})
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('clean');
              if (onSubTabChange) onSubTabChange('clean_suppliers');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer ${
              activePresetFilter === 'clean'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Clean Supplier List (23)</span>
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('usa');
              if (onSubTabChange) onSubTabChange('usa_suppliers');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'usa'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Likely USA Suppliers
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('wholesalers');
              if (onSubTabChange) onSubTabChange('wholesalers');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'wholesalers'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Wholesalers
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('fabric');
              if (onSubTabChange) onSubTabChange('fabric_suppliers');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'fabric'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fabric Suppliers
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('shipping');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'shipping'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Order & Shipping
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('real');
              if (onSubTabChange) onSubTabChange('real_brands');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'real'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Real Brands
          </button>

          <button
            onClick={() => {
              setActivePresetFilter('bot');
              setCurrentPage(1);
            }}
            className={`h-[22px] px-2.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
              activePresetFilter === 'bot'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Automated / Bot Mail
          </button>
        </div>
      </div>

      {/* Primary Data Table (Light Clean Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="px-3 py-1.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-800">
              Unique Email Database ({filteredData.length} matching)
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <AdminDataTable<RcSupplierEntry>
            columns={columns}
            data={paginatedData}
            rowHeight={28}
            zebra={true}
            emptyText="No matching supplier emails found"
            externalPagination={{
              currentPage,
              pageSize,
              totalCount: filteredData.length,
              onPageChange: setCurrentPage,
              onPageSizeChange: (size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
          />
        </div>
      </div>

      {/* Entry Detail Drawer / Modal */}
      {selectedEntryDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Supplier Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedEntryDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                <p className="font-bold text-indigo-600 text-sm">{selectedEntryDetail.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Domain Name</label>
                  <p className="font-medium text-slate-800">{selectedEntryDetail.domain}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Classification</label>
                  <p className="font-medium text-slate-800">{selectedEntryDetail.supplierType}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Sample Subject Line</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 italic">
                  "{selectedEntryDetail.sampleSubject || 'No sample subject recorded'}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">First Seen Date</label>
                  <p className="font-medium text-slate-800">{selectedEntryDetail.firstSeen}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Last Seen Date</label>
                  <p className="font-medium text-slate-800">{selectedEntryDetail.lastSeen}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Source Folders</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedEntryDetail.sourceFolders.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium border border-slate-200">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Topic Tags</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedEntryDetail.topicTags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-medium border border-indigo-100">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedEntryDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Supplier Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form
            onSubmit={handleAddNewSupplier}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Supplier Record</h3>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="supplier@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domain Name (Optional)</label>
                <input
                  type="text"
                  placeholder="company.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="Fabric Supplier">Fabric Supplier</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Platform/Service">Platform/Service</option>
                  <option value="Retail Brand">Retail Brand</option>
                  <option value="Internal Outgoing">Internal Outgoing</option>
                  <option value="Other / Brand">Other / Brand</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sample Subject Line</label>
                <input
                  type="text"
                  placeholder="Wholesale pricing inquiry..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition"
              >
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
