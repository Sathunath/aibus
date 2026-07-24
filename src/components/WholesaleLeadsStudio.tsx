import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Play,
  Trash2,
  ExternalLink,
  Edit3,
  RefreshCw,
  SlidersHorizontal,
  KeyRound,
  Filter,
  Layers,
  Sparkles,
  Check,
  X,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LeadItem } from '../types';
import { AdminDataTable, Column } from './AdminDataTable';
import {
  INITIAL_WHOLESALE_LEADS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_RESEARCH_JOBS,
  EmailTemplate,
  ResearchJob
} from '../data/wholesaleLeadsData';

function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100, 500, 1000]
}: {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="h-9 px-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 select-none font-sans shrink-0">
      <div className="flex items-center space-x-1">
        <span>Showing</span>
        <span className="font-bold text-slate-800">{startItem}</span>
        <span>to</span>
        <span className="font-bold text-slate-800">{endItem}</span>
        <span>of</span>
        <span className="font-bold text-slate-800">{totalItems}</span>
        <span>results</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] text-slate-500 font-medium">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="h-[22px] px-1.5 py-0 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-5 h-5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition"
            title="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 text-[10px] font-extrabold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-5 h-5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition"
            title="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface WholesaleLeadsStudioProps {
  vertical?: string;
  onNavigateToCredentials?: () => void;
}

export function WholesaleLeadsStudio({
  vertical = 'wholesale',
  onNavigateToCredentials
}: WholesaleLeadsStudioProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'mail_auto' | 'research_reports'>('pipeline');

  // Database Persistent Leads State
  const [leads, setLeads] = useState<LeadItem[]>(() => {
    try {
      const saved = localStorage.getItem(`haldi_leads_db_${vertical}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load leads from database:', e);
    }
    return INITIAL_WHOLESALE_LEADS.map((l) => ({ ...l, vertical }));
  });

  // Save to persistent database whenever leads change
  useEffect(() => {
    try {
      localStorage.setItem(`haldi_leads_db_${vertical}`, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads database:', e);
    }
  }, [leads, vertical]);

  // Email Templates State
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(`haldi_lead_templates_${vertical}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMAIL_TEMPLATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`haldi_lead_templates_${vertical}`, JSON.stringify(templates));
    } catch (e) {
      console.error(e);
    }
  }, [templates, vertical]);

  // Research Jobs State
  const [researchJobs, setResearchJobs] = useState<ResearchJob[]>(INITIAL_RESEARCH_JOBS);

  // Selected Rows for Bulk Actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Pagination States
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsPageSize, setLeadsPageSize] = useState(50);

  const [queuePage, setQueuePage] = useState(1);
  const [queuePageSize, setQueuePageSize] = useState(10);

  const [jobsPage, setJobsPage] = useState(1);
  const [jobsPageSize, setJobsPageSize] = useState(10);

  // Filter Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [mailStatusFilter, setMailStatusFilter] = useState('All');

  // Reset pagination on filter or vertical change
  useEffect(() => {
    setLeadsPage(1);
  }, [searchQuery, categoryFilter, cityFilter, mailStatusFilter, vertical]);

  useEffect(() => {
    setQueuePage(1);
  }, [vertical]);

  // Quick Add Form State
  const [newCompany, setNewCompany] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState('Fabric & Textiles');
  const [newApplyMethod, setNewApplyMethod] = useState<LeadItem['apply_method']>('Email');
  const [newNote, setNewNote] = useState('');

  // Template Editing State
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id || 'tpl-1');
  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === activeTemplateId) || templates[0],
    [templates, activeTemplateId]
  );
  const [editSubject, setEditSubject] = useState(activeTemplate?.subject || '');
  const [editBody, setEditBody] = useState(activeTemplate?.body || '');

  useEffect(() => {
    if (activeTemplate) {
      setEditSubject(activeTemplate.subject);
      setEditBody(activeTemplate.body);
    }
  }, [activeTemplateId]);

  // Filtered Leads strictly matching vertical
  const verticalLeads = useMemo(
    () => leads.filter((l) => (l.vertical || 'wholesale') === vertical),
    [leads, vertical]
  );

  const categories = useMemo(() => {
    const set = new Set(verticalLeads.map((l) => l.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [verticalLeads]);

  const cities = useMemo(() => {
    const set = new Set(verticalLeads.map((l) => l.city).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [verticalLeads]);

  const filteredLeads = useMemo(() => {
    return verticalLeads.filter((l) => {
      const matchSearch =
        !searchQuery ||
        l.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.city && l.city.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryFilter === 'All' || l.category === categoryFilter;
      const matchCity = cityFilter === 'All' || l.city === cityFilter;
      const matchMailStatus = mailStatusFilter === 'All' || l.mail_status === mailStatusFilter;
      return matchSearch && matchCategory && matchCity && matchMailStatus;
    });
  }, [verticalLeads, searchQuery, categoryFilter, cityFilter, mailStatusFilter]);

  // Paginated lists
  const paginatedLeads = useMemo(() => {
    const start = (leadsPage - 1) * leadsPageSize;
    return filteredLeads.slice(start, start + leadsPageSize);
  }, [filteredLeads, leadsPage, leadsPageSize]);

  const paginatedQueueLeads = useMemo(() => {
    const start = (queuePage - 1) * queuePageSize;
    return verticalLeads.slice(start, start + queuePageSize);
  }, [verticalLeads, queuePage, queuePageSize]);

  const paginatedResearchJobs = useMemo(() => {
    const start = (jobsPage - 1) * jobsPageSize;
    return researchJobs.slice(start, start + jobsPageSize);
  }, [researchJobs, jobsPage, jobsPageSize]);

  // Stats for inline chips
  const totalCount = verticalLeads.length;
  const mailSentCount = verticalLeads.filter((l) => l.mail_status === 'Sent' || l.mail_status === 'Opened').length;
  const needsReviewCount = verticalLeads.filter((l) => l.approval_status === 'Needs Review').length;
  const approvedCount = verticalLeads.filter((l) => l.approval_status === 'Approved').length;

  // Handlers
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      vertical,
      category: newCategory,
      source: 'Direct Quick Add',
      company_name: newCompany.trim(),
      website: newWebsite.trim() || `${newCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      email: newEmail.trim() || `sales@${newCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      apply_method: newApplyMethod,
      city: 'USA City',
      notes: newNote.trim() || 'Quick-added lead entry',
      mail_status: 'Not Sent',
      form_status: 'Draft',
      approval_status: 'Pending',
      reply_status: 'No Reply',
      pipeline_stage: 'New Lead',
      found_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setLeads((prev) => [newLead, ...prev]);
    setNewCompany('');
    setNewWebsite('');
    setNewEmail('');
    setNewNote('');
  };

  const handleResetDB = () => {
    const initial = INITIAL_WHOLESALE_LEADS.map((l) => ({ ...l, vertical }));
    setLeads(initial);
    setSelectedLeadIds([]);
    try {
      localStorage.setItem(`haldi_leads_db_${vertical}`, JSON.stringify(initial));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLeadIds((prev) => prev.filter((i) => i !== id));
  };

  const handleUpdateStatus = (
    id: string,
    field: 'mail_status' | 'form_status' | 'approval_status' | 'reply_status',
    value: any
  ) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, [field]: value, updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) };
          if (field === 'mail_status' && value === 'Sent') {
            updated.mail_sent_at = new Date().toISOString().replace('T', ' ').substring(0, 16);
            updated.pipeline_stage = 'Outreach';
          }
          return updated;
        }
        return l;
      })
    );
  };

  const isAllPaginatedLeadsSelected = useMemo(() => {
    return paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id));
  }, [paginatedLeads, selectedLeadIds]);

  const handleToggleSelectAll = () => {
    if (isAllPaginatedLeadsSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !paginatedLeads.some((pl) => pl.id === id)));
    } else {
      setSelectedLeadIds((prev) => {
        const next = [...prev];
        paginatedLeads.forEach((pl) => {
          if (!next.includes(pl.id)) {
            next.push(pl.id);
          }
        });
        return next;
      });
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'send_mail' | 'schedule_mail' | 'approve' | 'delete') => {
    if (selectedLeadIds.length === 0) return;

    if (action === 'delete') {
      setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
      return;
    }

    setLeads((prev) =>
      prev.map((l) => {
        if (selectedLeadIds.includes(l.id)) {
          if (action === 'send_mail') {
            return {
              ...l,
              mail_status: 'Sent',
              mail_sent_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              pipeline_stage: 'Outreach',
            };
          }
          if (action === 'schedule_mail') {
            return {
              ...l,
              mail_status: 'Scheduled',
              mail_scheduled_at: new Date(Date.now() + 86400000).toISOString().replace('T', ' ').substring(0, 16),
            };
          }
          if (action === 'approve') {
            return { ...l, approval_status: 'Approved', pipeline_stage: 'Approved Supplier' };
          }
        }
        return l;
      })
    );
    setSelectedLeadIds([]);
  };

  const handleSaveTemplate = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === activeTemplateId
          ? { ...t, subject: editSubject, body: editBody, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Company Name',
      'Website',
      'Email',
      'Category',
      'City',
      'Apply Method',
      'Mail Status',
      'Form Status',
      'Approval Status',
      'Reply Status',
    ];
    const rows = verticalLeads.map((l) => [
      l.company_name,
      l.website,
      l.email,
      l.category,
      l.city,
      l.apply_method,
      l.mail_status,
      l.form_status,
      l.approval_status,
      l.reply_status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${vertical}_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<LeadItem>[] = useMemo(() => [
    {
      id: 'select',
      headerClassName: 'w-8 text-center',
      className: 'text-center',
      header: (
        <input
          type="checkbox"
          checked={isAllPaginatedLeadsSelected}
          onChange={handleToggleSelectAll}
          className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
        />
      ),
      cell: (lead) => (
        <input
          type="checkbox"
          checked={selectedLeadIds.includes(lead.id)}
          onChange={() => handleToggleSelectRow(lead.id)}
          className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
        />
      ),
    },
    {
      id: 'company_name',
      header: 'Company Name',
      className: 'px-2 font-bold text-slate-900 truncate max-w-[150px]',
      cell: (lead) => lead.company_name,
    },
    {
      id: 'website_email',
      header: 'Website / Email',
      className: 'px-2 font-mono text-[10px] text-slate-600 truncate max-w-[200px]',
      cell: (lead) => (
        <div onClick={(e) => e.stopPropagation()}>
          <a
            href={`https://${lead.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span>{lead.website}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 inline" />
          </a>
          <span className="text-slate-400 block text-[9px]">{lead.email}</span>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      className: 'px-2 text-slate-700 truncate max-w-[110px]',
      cell: (lead) => lead.category,
    },
    {
      id: 'city',
      header: 'City',
      className: 'px-2 text-slate-600 truncate max-w-[100px]',
      cell: (lead) => lead.city,
    },
    {
      id: 'mail_status',
      header: 'Mail Status',
      className: 'px-2',
      cell: (lead) => (
        <select
          value={lead.mail_status}
          onChange={(e) =>
            handleUpdateStatus(lead.id, 'mail_status', e.target.value)
          }
          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border cursor-pointer focus:outline-none ${
            lead.mail_status === 'Sent' || lead.mail_status === 'Opened'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : lead.mail_status === 'Scheduled'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          <option value="Not Sent">Not Sent</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Sent">Sent</option>
          <option value="Opened">Opened</option>
          <option value="Failed">Failed</option>
        </select>
      ),
    },
    {
      id: 'form_status',
      header: 'Form Status',
      className: 'px-2',
      cell: (lead) => (
        <select
          value={lead.form_status}
          onChange={(e) =>
            handleUpdateStatus(lead.id, 'form_status', e.target.value)
          }
          className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none"
        >
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="In Review">In Review</option>
          <option value="Verified">Verified</option>
        </select>
      ),
    },
    {
      id: 'approval_status',
      header: 'Approval',
      className: 'px-2',
      cell: (lead) => (
        <select
          value={lead.approval_status}
          onChange={(e) =>
            handleUpdateStatus(lead.id, 'approval_status', e.target.value)
          }
          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border cursor-pointer focus:outline-none ${
            lead.approval_status === 'Approved'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : lead.approval_status === 'Needs Review'
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Needs Review">Needs Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      ),
    },
    {
      id: 'reply_status',
      header: 'Reply',
      className: 'px-2',
      cell: (lead) => (
        <span
          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
            lead.reply_status === 'Replied'
              ? 'bg-indigo-100 text-indigo-800'
              : lead.reply_status === 'Follow Up Needed'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {lead.reply_status}
        </span>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      headerClassName: 'w-12 text-center',
      className: 'text-center',
      cell: (lead) => (
        <div className="flex items-center justify-center space-x-1" onClick={(e) => e.stopPropagation()}>
          {onNavigateToCredentials && (
            <button
              onClick={onNavigateToCredentials}
              className="p-1 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
              title="Route account credentials to Passwords Vault"
            >
              <KeyRound className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => handleDeleteLead(lead.id)}
            className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
            title="Instant 1-Click Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ], [
    isAllPaginatedLeadsSelected,
    handleToggleSelectAll,
    selectedLeadIds,
    handleToggleSelectRow,
    handleUpdateStatus,
    onNavigateToCredentials,
    handleDeleteLead,
  ]);

  return (
    <div className="w-full min-h-full bg-white text-slate-800 p-0 flex flex-col font-sans flex-1">
      {/* Module Header Bar — --header-bar-height (30px) */}
      <div className="h-[var(--header-bar-height)] min-h-[30px] px-2 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <h1 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
            Wholesale Leads
          </h1>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline border-l border-slate-200 pl-2">
            Research, Mail & Apply · <span className="font-bold text-indigo-600">{totalCount}</span> Leads
          </span>
        </div>

        {/* Module Sub-Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`h-[var(--micro-pill-height)] px-2.5 text-[10px] font-bold rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Leads & Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab('mail_auto')}
            className={`h-[var(--micro-pill-height)] px-2.5 text-[10px] font-bold rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'mail_auto'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Mail & Auto-Apply</span>
            <span className="text-[8px] bg-emerald-500 text-white font-extrabold px-1 rounded-full uppercase">
              Live
            </span>
          </button>
          <button
            onClick={() => setActiveTab('research_reports')}
            className={`h-[var(--micro-pill-height)] px-2.5 text-[10px] font-bold rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'research_reports'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>Research & Reports</span>
            <span className="text-[8px] bg-indigo-200 text-indigo-800 font-extrabold px-1 rounded-full uppercase">
              CSV
            </span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-[1px] space-y-1 flex-1 overflow-x-hidden bg-white flex flex-col">
        {/* Quick Add Bar — Height = --filter-bar-height (28px) */}
        <form
          onSubmit={handleQuickAdd}
          className="h-[var(--filter-bar-height)] px-1.5 bg-white border border-slate-200 rounded-md flex items-center gap-1 overflow-x-auto"
        >
          <span className="text-[10px] font-extrabold text-slate-700 shrink-0 flex items-center space-x-1">
            <Plus className="w-3 h-3 text-indigo-600" />
            <span>Quick Add</span>
          </span>
          <span className="text-slate-300">|</span>

          <input
            type="text"
            required
            placeholder="Company name"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="h-[var(--micro-input-height)] px-1.5 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none min-w-[110px] flex-1"
          />

          <input
            type="text"
            placeholder="Website"
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
            className="h-[var(--micro-input-height)] px-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none min-w-[100px] flex-1"
          />

          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="h-[var(--micro-input-height)] px-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none min-w-[110px] flex-1"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="h-[var(--micro-input-height)] px-1 text-[10px] font-medium bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none shrink-0"
          >
            <option value="Fabric & Textiles">Fabric & Textiles</option>
            <option value="Apparel & Garments">Apparel & Garments</option>
            <option value="Home & Bedding">Home & Bedding</option>
            <option value="Party & Crafts">Party & Crafts</option>
            <option value="Footwear & Accessories">Footwear & Accessories</option>
          </select>

          <select
            value={newApplyMethod}
            onChange={(e) => setNewApplyMethod(e.target.value as any)}
            className="h-[var(--micro-input-height)] px-1 text-[10px] font-medium bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none shrink-0"
          >
            <option value="Email">Apply: Email</option>
            <option value="Web Form">Apply: Web Form</option>
            <option value="Portal">Apply: Portal</option>
            <option value="Phone / Direct">Apply: Phone / Direct</option>
          </select>

          <input
            type="text"
            placeholder="Note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="h-[var(--micro-input-height)] px-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none min-w-[80px] hidden md:inline flex-1"
          />

          <button
            type="submit"
            className="h-[var(--micro-pill-height)] px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded cursor-pointer shrink-0 flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </form>

        {/* TAB 1 — LEADS & PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-1.5">
            {/* Stat Chips Grid — Height = --stat-chip-height (28px) each */}
            <div className="stat-chips-grid">
              <div className="stat-chip bg-white border border-slate-200 text-slate-800 shadow-2xs">
                <span className="text-indigo-600 font-extrabold mr-1">{totalCount}</span>
                <span className="text-[10px] text-slate-500 uppercase">TOTAL LEADS</span>
              </div>
              <div className="stat-chip bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                <span className="text-emerald-700 font-extrabold mr-1">{mailSentCount}</span>
                <span className="text-[10px] text-emerald-600 uppercase">MAIL SENT</span>
              </div>
              <div className="stat-chip bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
                <span className="text-amber-700 font-extrabold mr-1">{needsReviewCount}</span>
                <span className="text-[10px] text-amber-600 uppercase">NEEDS REVIEW</span>
              </div>
              <div className="stat-chip bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-2xs">
                <span className="text-indigo-700 font-extrabold mr-1">{approvedCount}</span>
                <span className="text-[10px] text-indigo-600 uppercase">APPROVED LEADS</span>
              </div>
            </div>

            {/* Single-Row Filter Bar — Height = --filter-bar-height (28px) */}
            <div className="h-[var(--filter-bar-height)] px-1.5 bg-white border border-slate-200 rounded-md flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center space-x-1 flex-1 min-w-[200px]">
                <div className="relative flex-1">
                  <Search className="w-3 h-3 text-slate-400 absolute left-1.5 top-1.5" />
                  <input
                    type="text"
                    placeholder="Search company, email, website or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-[var(--micro-input-height)] pl-5 pr-1.5 w-full text-[10px] bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-[var(--micro-input-height)] px-1 text-[10px] font-medium bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All">Category: All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="h-[var(--micro-input-height)] px-1 text-[10px] font-medium bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All">City: All</option>
                  {cities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>

                <select
                  value={mailStatusFilter}
                  onChange={(e) => setMailStatusFilter(e.target.value)}
                  className="h-[var(--micro-input-height)] px-1 text-[10px] font-medium bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All">Mail Status: All</option>
                  <option value="Not Sent">Not Sent</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Sent">Sent</option>
                  <option value="Opened">Opened</option>
                </select>

                <div className="flex items-center space-x-1 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="h-[var(--micro-pill-height)] px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-extrabold rounded cursor-pointer flex items-center space-x-1"
                    title="Export leads to CSV file"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDB}
                    className="h-[var(--micro-pill-height)] px-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-[9px] font-extrabold rounded cursor-pointer flex items-center space-x-1"
                    title="Reset leads database to original seed data"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset DB</span>
                  </button>
                </div>
              </div>

              {/* Bulk Actions Controls */}
              {selectedLeadIds.length > 0 && (
                <div className="flex items-center space-x-1 shrink-0 bg-indigo-50 p-0.5 rounded border border-indigo-200">
                  <span className="text-[9px] font-bold text-indigo-700 px-1">
                    {selectedLeadIds.length} Selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('send_mail')}
                    className="h-[var(--micro-pill-height)] px-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold rounded cursor-pointer"
                  >
                    Send Mail
                  </button>
                  <button
                    onClick={() => handleBulkAction('schedule_mail')}
                    className="h-[var(--micro-pill-height)] px-1.5 bg-slate-700 hover:bg-slate-800 text-white text-[9px] font-bold rounded cursor-pointer"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="h-[var(--micro-pill-height)] px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded cursor-pointer"
                  >
                    Approve
                  </button>
                  {/* Destructive confirm action maintains 26px height */}
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="h-[26px] px-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold rounded cursor-pointer flex items-center space-x-1"
                    title="Delete selected items"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Data Table — AdminDataTable with 28px rows */}
            <div className="flex-1 min-h-0 flex flex-col">
              <AdminDataTable<LeadItem>
                columns={columns}
                data={paginatedLeads}
                rowHeight={28}
                zebra={true}
                emptyText="No wholesale leads match your active filters."
                externalPagination={{
                  currentPage: leadsPage,
                  pageSize: leadsPageSize,
                  totalCount: filteredLeads.length,
                  onPageChange: setLeadsPage,
                  onPageSizeChange: (size) => {
                    setLeadsPageSize(size);
                    setLeadsPage(1);
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2 — MAIL & AUTO-APPLY */}
        {activeTab === 'mail_auto' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Left Panel: Email Templates Manager */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-md p-2 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs font-extrabold text-slate-900">Email Templates</h2>
                </div>
                <button
                  onClick={() => {
                    const newTpl: EmailTemplate = {
                      id: `tpl-${Date.now()}`,
                      name: 'New Custom Template',
                      subject: 'Wholesale Inquiry — {{company_name}}',
                      body: 'Hello {{company_name}} team,\n\nBody message...',
                      updatedAt: new Date().toISOString().split('T')[0],
                    };
                    setTemplates((prev) => [...prev, newTpl]);
                    setActiveTemplateId(newTpl.id);
                  }}
                  className="h-[var(--micro-pill-height)] px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Template</span>
                </button>
              </div>

              {/* Template Selector Pills */}
              <div className="flex flex-wrap gap-1">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setActiveTemplateId(tpl.id)}
                    className={`h-[var(--micro-pill-height)] px-2 text-[10px] font-bold rounded-full transition cursor-pointer ${
                      tpl.id === activeTemplateId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>

              {/* Template Editor */}
              <div className="space-y-1.5 pt-1">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="h-[var(--micro-input-height)] px-2 w-full text-[10px] font-bold bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">
                    Email Body Template (supports placeholders: &#123;&#123;company_name&#125;&#125;, &#123;&#123;city&#125;&#125;, &#123;&#123;category&#125;&#125;)
                  </label>
                  <textarea
                    rows={8}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full p-2 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-slate-400">Updated: {activeTemplate?.updatedAt}</span>
                  <button
                    onClick={handleSaveTemplate}
                    className="h-[var(--micro-pill-height)] px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded cursor-pointer flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save Template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Scheduled Sends & Auto-Apply Execution Queue */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-md p-2 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-xs font-extrabold text-slate-900">
                    Auto-Apply Execution & Sending Queue
                  </h2>
                </div>
                <button
                  onClick={() => handleBulkAction('send_mail')}
                  className="h-[var(--micro-pill-height)] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded cursor-pointer flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Dispatch Engine</span>
                </button>
              </div>

              {/* Status Queue Blocks */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-amber-50 border border-amber-200 p-1.5 rounded">
                  <p className="text-[9px] font-extrabold text-amber-800 uppercase">
                    Scheduled / Pending ({verticalLeads.filter((l) => l.mail_status === 'Scheduled' || l.mail_status === 'Not Sent').length})
                  </p>
                  <p className="text-[10px] text-amber-700 mt-0.5 font-medium">Ready for automated mail dispatch.</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded">
                  <p className="text-[9px] font-extrabold text-emerald-800 uppercase">
                    Running / Dispatched ({verticalLeads.filter((l) => l.mail_status === 'Sent' || l.mail_status === 'Opened').length})
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Active outreach dispatches.</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-1.5 rounded">
                  <p className="text-[9px] font-extrabold text-indigo-800 uppercase">
                    Needs Review ({verticalLeads.filter((l) => l.approval_status === 'Needs Review').length})
                  </p>
                  <p className="text-[10px] text-indigo-700 mt-0.5 font-medium">Requires portal review.</p>
                </div>
              </div>

              {/* Queue List Table */}
              <div className="border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="h-[28px] bg-slate-100 text-[9px] font-extrabold text-slate-600 uppercase">
                      <th className="px-2">Target Lead</th>
                      <th className="px-2">Email</th>
                      <th className="px-2">Status</th>
                      <th className="px-2">Sent / Scheduled</th>
                      <th className="px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 text-[10px]">
                    {verticalLeads.slice(0, 8).map((l) => (
                      <tr key={l.id} className="h-[28px] hover:bg-slate-50">
                        <td className="px-2 font-bold text-slate-800">{l.company_name}</td>
                        <td className="px-2 font-mono text-slate-600">{l.email}</td>
                        <td className="px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded font-extrabold text-[8px] ${
                              l.mail_status === 'Sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : l.mail_status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {l.mail_status}
                          </span>
                        </td>
                        <td className="px-2 text-slate-500 font-mono">
                          {l.mail_sent_at || l.mail_scheduled_at || 'Not scheduled'}
                        </td>
                        <td className="px-2 text-center">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                l.id,
                                'mail_status',
                                l.mail_status === 'Sent' ? 'Not Sent' : 'Sent'
                              )
                            }
                            className="h-[var(--micro-pill-height)] px-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 — RESEARCH & REPORTS */}
        {activeTab === 'research_reports' && (
          <div className="space-y-2">
            {/* Top Cards: Saved Research Jobs & CSV Import/Export */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Left Block: Saved Research Jobs */}
              <div className="md:col-span-8 bg-white border border-slate-200 rounded-md p-2 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-xs font-extrabold text-slate-900">
                      Saved Research Job Configurations
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      const newJob: ResearchJob = {
                        id: `job-${Date.now()}`,
                        keyword: 'New Supplier Category Search',
                        location: 'USA Nationwide',
                        requirementSpec: 'Wholesale dealer or manufacturer',
                        targetCount: 25,
                        frequency: 'Manual',
                        lastRun: 'Just now',
                        leadsFound: 0,
                        status: 'Active',
                      };
                      setResearchJobs((prev) => [...prev, newJob]);
                    }}
                    className="h-[var(--micro-pill-height)] px-2 bg-indigo-600 text-white text-[10px] font-bold rounded cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Research Job</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="h-[28px] bg-slate-100 text-[9px] font-extrabold text-slate-600 uppercase">
                        <th className="px-2">Keyword / Target</th>
                        <th className="px-2">Location</th>
                        <th className="px-2">Requirement Spec</th>
                        <th className="px-2">Target</th>
                        <th className="px-2">Frequency</th>
                        <th className="px-2 text-center">Run</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 text-[10px]">
                      {researchJobs.map((job) => (
                        <tr key={job.id} className="h-[28px] hover:bg-slate-50">
                          <td className="px-2 font-bold text-slate-800">{job.keyword}</td>
                          <td className="px-2 text-slate-600">{job.location}</td>
                          <td className="px-2 text-slate-500 font-mono">{job.requirementSpec}</td>
                          <td className="px-2 font-bold text-indigo-600">{job.targetCount}</td>
                          <td className="px-2">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {job.frequency}
                            </span>
                          </td>
                          <td className="px-2 text-center">
                            <button
                              onClick={() => {
                                alert(`Executing research job for "${job.keyword}"...`);
                              }}
                              className="h-[var(--micro-pill-height)] px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded cursor-pointer flex items-center justify-center space-x-1 mx-auto"
                            >
                              <Play className="w-2.5 h-2.5" />
                              <span>Run Now</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Block: Import / Export Options Card */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-md p-2 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5 mb-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-xs font-extrabold text-slate-900">
                      Import / Export Leads Data
                    </h2>
                  </div>

                  {/* CSV Upload Block */}
                  <div className="border-2 border-dashed border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1 mb-2">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <p className="text-[10px] font-bold text-slate-700">CSV / Excel Upload Block</p>
                    <p className="text-[9px] text-slate-500">Upload list of company leads to import</p>
                    <input
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          alert(`Loaded file: ${e.target.files[0].name}. Imported 5 lead entries.`);
                        }
                      }}
                      className="text-[9px] text-slate-500 max-w-[200px] mx-auto block cursor-pointer"
                    />
                  </div>
                </div>

                {/* Two-Option Card Export Button */}
                <div className="p-2 bg-indigo-50/60 border border-indigo-200 rounded space-y-1.5">
                  <p className="text-[10px] font-extrabold text-indigo-900">
                    Download Filtered Leads Report
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExportCSV}
                      className="flex-1 h-[var(--micro-pill-height)] bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="flex-1 h-[var(--micro-pill-height)] bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>Export Excel (.xlsx)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
