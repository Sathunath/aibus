import { DollarSign, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface FinanceSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactionCount: number;
  selectedPeriodLabel?: string;
}

export function FinanceSummaryCards({
  totalIncome,
  totalExpense,
  netProfit,
  transactionCount,
  selectedPeriodLabel = 'Selected Period'
}: FinanceSummaryCardsProps) {
  const isProfit = netProfit >= 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="stat-chips-grid my-1.5">
      <div className="stat-chip bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
        <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
        <span className="font-mono font-extrabold mr-1.5">{formatCurrency(totalIncome)}</span>
        <span className="text-emerald-700 opacity-80 uppercase text-[9px]">TOTAL INCOME</span>
      </div>

      <div className="stat-chip bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
        <TrendingDown className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />
        <span className="font-mono font-extrabold mr-1.5">{formatCurrency(totalExpense)}</span>
        <span className="text-rose-700 opacity-80 uppercase text-[9px]">TOTAL EXPENSE</span>
      </div>

      <div className={`stat-chip border shadow-2xs ${
        isProfit
          ? 'bg-indigo-900 text-white border-indigo-950'
          : 'bg-rose-900 text-white border-rose-950'
      }`}>
        <DollarSign className={`w-3.5 h-3.5 mr-1 shrink-0 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`} />
        <span className="font-mono font-extrabold mr-1.5">{formatCurrency(netProfit)}</span>
        <span className="opacity-90 uppercase text-[9px]">{isProfit ? 'NET PROFIT' : 'NET LOSS'}</span>
      </div>

      <div className="stat-chip bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
        <Layers className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
        <span className="font-mono font-extrabold mr-1.5">{transactionCount}</span>
        <span className="text-slate-600 uppercase text-[9px]">TRANSACTIONS</span>
      </div>
    </div>
  );
}
