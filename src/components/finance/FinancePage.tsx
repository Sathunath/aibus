import { useState, useEffect, useCallback } from 'react';
import { FinanceTabs, FinanceTab } from './FinanceTabs';
import { FinanceEntryForm } from './FinanceEntryForm';
import { FinanceEntryTable } from './FinanceEntryTable';
import { FinanceFilters, QuickPeriod } from './FinanceFilters';
import { FinanceSummaryCards } from './FinanceSummaryCards';
import { FinanceTrendChart } from './FinanceTrendChart';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { FinanceComparison } from './FinanceComparison';
import { FinanceExport } from './FinanceExport';
import { FinanceEntry, FinanceSummary } from '../../types';
import { PlusCircle, RefreshCw, Check, AlertCircle, DollarSign, Database } from 'lucide-react';

const CATEGORIES_LIST = [
  'Supplier Payment',
  'Ads / Marketing',
  'Software',
  'Shipping',
  'Salary',
  'Office',
  'Operations',
  'Shopify Sales',
  'Amazon FBA Payout',
  'Wholesale / B2B',
  'TikTok Shop Sales',
  'Other'
];

interface FinancePageProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export function FinancePage({ activeSubTab: externalSubTab, onSubTabChange }: FinancePageProps = {}) {
  const [internalTab, setInternalTab] = useState<FinanceTab>('entry');
  const activeTab = (externalSubTab as FinanceTab) || internalTab;

  const handleTabChange = (tab: FinanceTab) => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [quickPeriod, setQuickPeriod] = useState<QuickPeriod>('this_month');
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>('2026-07-31');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form / Editing State
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Analytics Summary State
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    transactionCount: 0,
    trend: [],
    expenseBreakdown: [],
    monthComparison: {
      currentMonth: { income: 0, expense: 0, net: 0 },
      previousMonth: { income: 0, expense: 0, net: 0 },
      percentageChange: { income: 0, expense: 0, net: 0 }
    },
    yearComparison: {
      currentYear: { income: 0, expense: 0, net: 0 },
      previousYear: { income: 0, expense: 0, net: 0 },
      percentageChange: { income: 0, expense: 0, net: 0 }
    }
  });

  // Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Entries from Backend REST API
  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/finance/entries?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load finance entries from server.');
      const data = await res.json();

      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching entries:', err);
      showToast('error', err.message || 'Error fetching finance entries');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, typeFilter, categoryFilter, searchQuery, page, pageSize, sortBy, sortOrder]);

  // Fetch Summary Analytics from Backend REST API
  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/finance/summary?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load summary analytics.');
      const data = await res.json();

      if (data.success) {
        setSummary({
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          netProfit: data.netProfit || 0,
          transactionCount: data.transactionCount || 0,
          trend: data.trend || [],
          expenseBreakdown: data.expenseBreakdown || [],
          monthComparison: data.monthComparison || summary.monthComparison,
          yearComparison: data.yearComparison || summary.yearComparison
        });
      }
    } catch (err: any) {
      console.error('Error fetching summary:', err);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchEntries();
    fetchSummary();
  }, [fetchEntries, fetchSummary]);

  // Reset Filters
  const handleResetFilters = () => {
    setQuickPeriod('all');
    setStartDate('');
    setEndDate('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    setPage(1);
    setSortBy('date');
    setSortOrder('desc');
  };

  // Add or Edit Submission Handler
  const handleFormSubmit = async (formData: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    note?: string;
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf' | 'link';
    attachmentName?: string;
  }) => {
    if (editingEntry) {
      // PUT update
      const res = await fetch(`/api/finance/entries/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update transaction.');
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Transaction updated successfully!');
        setEditingEntry(null);
        setIsModalOpen(false);
        fetchEntries();
        fetchSummary();
      }
    } else {
      // POST create
      const res = await fetch('/api/finance/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to add transaction.');
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Transaction saved to MySQL database!');
        setIsModalOpen(false);
        fetchEntries();
        fetchSummary();
      }
    }
  };

  // Delete Handler
  const handleDeleteEntry = async (id: string) => {
    const res = await fetch(`/api/finance/entries/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete transaction.');
    const data = await res.json();
    if (data.success) {
      showToast('success', 'Transaction deleted successfully.');
      fetchEntries();
      fetchSummary();
    }
  };

  // Export Trigger Handler
  const handleExport = async (eStartDate: string, eEndDate: string, format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams();
    if (eStartDate) params.append('startDate', eStartDate);
    if (eEndDate) params.append('endDate', eEndDate);
    params.append('format', format);

    const response = await fetch(`/api/finance/export?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to download report.');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_report_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Sort toggle handler
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex-grow flex-1 min-h-0 w-full flex flex-col overflow-hidden space-y-2 pb-2 p-1">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border text-xs font-bold flex items-center space-x-2 animate-bounce-in ${
            toast.type === 'success'
              ? 'bg-slate-900 text-emerald-400 border-slate-800'
              : 'bg-rose-900 text-rose-100 border-rose-800'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* STICKY TOP DARK FREEZE ENTRY PANEL */}
      <div className="shrink-0 bg-slate-900/98 backdrop-blur-md rounded-xl p-2 border border-slate-800 shadow-xl text-white transition-all duration-200">
        <FinanceEntryForm
          layoutMode="sticky-bar"
          darkMode={true}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* Tabs Switcher */}
      <div className="shrink-0">
        <FinanceTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          totalEntriesCount={total}
        />
      </div>

      {/* TAB 1: ENTRY & TRANSACTIONS */}
      {activeTab === 'entry' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-4">
          {/* Summary Cards Overview for selected date range */}
          <div className="shrink-0">
            <FinanceSummaryCards
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              netProfit={summary.netProfit}
              transactionCount={summary.transactionCount}
              selectedPeriodLabel={
                quickPeriod === 'all'
                  ? 'All Time Records'
                  : startDate && endDate
                  ? `${startDate} to ${endDate}`
                  : 'Current Range'
              }
            />
          </div>

          {/* Filters & Transaction Table */}
          <div className="flex-grow flex-1 min-h-0 flex flex-col overflow-hidden space-y-2">
            <div className="shrink-0">
              <FinanceFilters
                quickPeriod={quickPeriod}
                setQuickPeriod={setQuickPeriod}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoriesList={CATEGORIES_LIST}
                onResetFilters={handleResetFilters}
              />
            </div>

            <div className="flex-grow flex-1 min-h-0">
              <FinanceEntryTable
                entries={entries}
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                pageSize={pageSize}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setPage(1);
                }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                onEdit={(entry) => {
                  setEditingEntry(entry);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteEntry}
                isLoading={isLoading}
                totalIncome={summary.totalIncome}
                totalExpense={summary.totalExpense}
                netProfit={summary.netProfit}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DASHBOARD / ANALYSIS */}
      {activeTab === 'dashboard' && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* Period Selector & Top Summary Cards */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Period Analytics Filter</h3>
                <p className="text-[11px] text-slate-500">Select period to dynamically update summary cards, trend lines, and expense breakdown.</p>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {(['today', 'this_month', 'this_year', 'all'] as const).map((p) => {
                  const labels = {
                    today: 'Today',
                    this_month: 'This Month',
                    this_year: 'This Year',
                    all: 'All Time'
                  };
                  const isSel = quickPeriod === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setQuickPeriod(p);
                        const todayStr = new Date().toISOString().split('T')[0];
                        if (p === 'today') {
                          setStartDate(todayStr);
                          setEndDate(todayStr);
                        } else if (p === 'this_month') {
                          const y = new Date().getFullYear();
                          const m = String(new Date().getMonth() + 1).padStart(2, '0');
                          setStartDate(`${y}-${m}-01`);
                          setEndDate(todayStr);
                        } else if (p === 'this_year') {
                          setStartDate(`${new Date().getFullYear()}-01-01`);
                          setEndDate(todayStr);
                        } else if (p === 'all') {
                          setStartDate('');
                          setEndDate('');
                        }
                      }}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        isSel
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            <FinanceSummaryCards
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              netProfit={summary.netProfit}
              transactionCount={summary.transactionCount}
              selectedPeriodLabel={
                quickPeriod === 'all' ? 'All Time' : `${startDate || 'Start'} to ${endDate || 'Today'}`
              }
            />
          </div>

          {/* Income vs Expense Trend Chart */}
          <FinanceTrendChart data={summary.trend} />

          {/* Expense Breakdown + Comparisons Grid */}
          <div className="space-y-6">
            <ExpenseBreakdownChart data={summary.expenseBreakdown} />

            <FinanceComparison
              monthComparison={summary.monthComparison}
              yearComparison={summary.yearComparison}
            />
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT */}
      {activeTab === 'export' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <FinanceExport
            onTriggerExport={handleExport}
            totalEntriesCount={total}
          />
        </div>
      )}

      {/* Edit Modal (Popup view when edit clicked) */}
      {isModalOpen && editingEntry && (
        <FinanceEntryForm
          editingEntry={editingEntry}
          onSubmit={handleFormSubmit}
          onCancelEdit={() => {
            setEditingEntry(null);
            setIsModalOpen(false);
          }}
          isOpenModal={true}
          onCloseModal={() => {
            setEditingEntry(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
