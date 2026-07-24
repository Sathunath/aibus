import { Calendar, Search, Filter, RefreshCw, X } from 'lucide-react';

export type QuickPeriod = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom' | 'all';

interface FinanceFiltersProps {
  quickPeriod: QuickPeriod;
  setQuickPeriod: (p: QuickPeriod) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  typeFilter: 'all' | 'income' | 'expense';
  setTypeFilter: (t: 'all' | 'income' | 'expense') => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoriesList: string[];
  onResetFilters: () => void;
}

export function FinanceFilters({
  quickPeriod,
  setQuickPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  categoriesList,
  onResetFilters,
}: FinanceFiltersProps) {
  const handlePeriodClick = (p: QuickPeriod) => {
    setQuickPeriod(p);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (p === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (p === 'this_week') {
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      setStartDate(firstDayOfWeek.toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
    } else if (p === 'this_month') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      setStartDate(`${year}-${month}-01`);
      setEndDate(todayStr);
    } else if (p === 'this_year') {
      const year = today.getFullYear();
      setStartDate(`${year}-01-01`);
      setEndDate(todayStr);
    } else if (p === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const hasActiveFilters =
    quickPeriod !== 'all' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs space-y-1.5">
      {/* Top single row: Period Pills + Search + Type + Category */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-1 overflow-x-auto pb-0.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-600" />
            Period:
          </span>

          {(['today', 'this_week', 'this_month', 'this_year', 'custom', 'all'] as const).map((p) => {
            const labelMap: Record<QuickPeriod, string> = {
              today: 'Today',
              this_week: 'This Week',
              this_month: 'This Month',
              this_year: 'This Year',
              custom: 'Custom',
              all: 'All'
            };

            const isSelected = quickPeriod === p;
            return (
              <button
                key={p}
                onClick={() => handlePeriodClick(p)}
                className={`h-[22px] px-2 rounded font-bold transition cursor-pointer text-[10px] shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {labelMap[p]}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="h-[22px] text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 px-2 rounded transition cursor-pointer shrink-0 border border-slate-200"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Date Pickers (Shown for custom date range) */}
      {quickPeriod === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-indigo-50/50 p-1.5 rounded border border-indigo-100">
          <div className="flex items-center space-x-1">
            <label className="text-[10px] font-bold text-slate-600 shrink-0">Start:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-[22px] w-full bg-white border border-slate-200 text-slate-900 text-[10px] font-semibold rounded px-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-1">
            <label className="text-[10px] font-bold text-slate-600 shrink-0">End:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-[22px] w-full bg-white border border-slate-200 text-slate-900 text-[10px] font-semibold rounded px-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Controls Row: Search + Type + Category */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search note or category..."
            className="h-[22px] w-full bg-slate-50 border border-slate-200 text-slate-900 text-[10px] rounded pl-6 pr-6 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type Filter Micro-Pills */}
        <div className="flex items-center space-x-0.5 bg-slate-100 p-0.5 rounded border border-slate-200 shrink-0">
          <button
            onClick={() => setTypeFilter('all')}
            className={`h-[20px] px-2 text-[10px] font-bold rounded transition ${
              typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`h-[20px] px-2 text-[10px] font-bold rounded transition ${
              typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`h-[20px] px-2 text-[10px] font-bold rounded transition ${
              typeFilter === 'expense' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0 min-w-[130px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-[22px] w-full bg-slate-50 border border-slate-200 text-slate-900 text-[10px] font-semibold rounded px-1.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
