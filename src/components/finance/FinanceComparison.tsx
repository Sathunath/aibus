import { ArrowUpRight, ArrowDownRight, Calendar, Scale } from 'lucide-react';

interface ComparisonMetric {
  currentMonth: { income: number; expense: number; net: number };
  previousMonth: { income: number; expense: number; net: number };
  percentageChange: { income: number; expense: number; net: number };
}

interface YearComparisonMetric {
  currentYear: { income: number; expense: number; net: number };
  previousYear: { income: number; expense: number; net: number };
  percentageChange: { income: number; expense: number; net: number };
}

interface FinanceComparisonProps {
  monthComparison: ComparisonMetric;
  yearComparison: YearComparisonMetric;
}

export function FinanceComparison({ monthComparison, yearComparison }: FinanceComparisonProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const renderBadge = (pct: number, isExpense = false) => {
    const isPositive = pct >= 0;
    // For income/net: positive is good (green). For expense: positive means cost increased (amber/red).
    let badgeColor = isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
    if (isExpense) {
      badgeColor = isPositive ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }

    return (
      <span className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[10px] font-black border ${badgeColor}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span>{Math.abs(pct)}%</span>
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Month Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">This Month vs Last Month</h3>
              <p className="text-[11px] text-slate-500">July 2026 vs June 2026 Monthly Delta</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
            Monthly
          </span>
        </div>

        <div className="space-y-3">
          {/* Income row */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Income</p>
              <p className="text-sm font-black font-mono text-slate-900">
                {formatCurrency(monthComparison.currentMonth.income)}
              </p>
              <p className="text-[10px] text-slate-500">Prev: {formatCurrency(monthComparison.previousMonth.income)}</p>
            </div>
            {renderBadge(monthComparison.percentageChange.income, false)}
          </div>

          {/* Expense row */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Expenses</p>
              <p className="text-sm font-black font-mono text-slate-900">
                {formatCurrency(monthComparison.currentMonth.expense)}
              </p>
              <p className="text-[10px] text-slate-500">Prev: {formatCurrency(monthComparison.previousMonth.expense)}</p>
            </div>
            {renderBadge(monthComparison.percentageChange.expense, true)}
          </div>

          {/* Net Profit row */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-indigo-600 uppercase">Net Profit / Loss</p>
              <p className="text-base font-black font-mono text-indigo-950">
                {formatCurrency(monthComparison.currentMonth.net)}
              </p>
              <p className="text-[10px] text-indigo-500">Prev: {formatCurrency(monthComparison.previousMonth.net)}</p>
            </div>
            {renderBadge(monthComparison.percentageChange.net, false)}
          </div>
        </div>
      </div>

      {/* Year Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">This Year vs Last Year</h3>
              <p className="text-[11px] text-slate-500">FY 2026 vs FY 2025 Annual Performance</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
            Annual
          </span>
        </div>

        <div className="space-y-3">
          {/* Income row */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Annual Income</p>
              <p className="text-sm font-black font-mono text-slate-900">
                {formatCurrency(yearComparison.currentYear.income)}
              </p>
              <p className="text-[10px] text-slate-500">Prev: {formatCurrency(yearComparison.previousYear.income)}</p>
            </div>
            {renderBadge(yearComparison.percentageChange.income, false)}
          </div>

          {/* Expense row */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Annual Expenses</p>
              <p className="text-sm font-black font-mono text-slate-900">
                {formatCurrency(yearComparison.currentYear.expense)}
              </p>
              <p className="text-[10px] text-slate-500">Prev: {formatCurrency(yearComparison.previousYear.expense)}</p>
            </div>
            {renderBadge(yearComparison.percentageChange.expense, true)}
          </div>

          {/* Net Profit row */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-emerald-700 uppercase">Annual Net Profit</p>
              <p className="text-base font-black font-mono text-emerald-950">
                {formatCurrency(yearComparison.currentYear.net)}
              </p>
              <p className="text-[10px] text-emerald-600">Prev: {formatCurrency(yearComparison.previousYear.net)}</p>
            </div>
            {renderBadge(yearComparison.percentageChange.net, false)}
          </div>
        </div>
      </div>
    </div>
  );
}
