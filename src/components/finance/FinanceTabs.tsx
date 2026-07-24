import { ReceiptText, BarChart3, Download } from 'lucide-react';

export type FinanceTab = 'entry' | 'dashboard' | 'export';

interface FinanceTabsProps {
  activeTab: FinanceTab;
  setActiveTab: (tab: FinanceTab) => void;
  totalEntriesCount?: number;
}

export function FinanceTabs({ activeTab, setActiveTab, totalEntriesCount = 0 }: FinanceTabsProps) {
  const tabs = [
    {
      id: 'entry' as FinanceTab,
      label: '1. Entry & Transactions',
      icon: ReceiptText,
      badge: totalEntriesCount ? `${totalEntriesCount}` : null,
    },
    {
      id: 'dashboard' as FinanceTab,
      label: '2. Dashboard & Analysis',
      icon: BarChart3,
      badge: 'Live',
    },
    {
      id: 'export' as FinanceTab,
      label: '3. Export & Reports',
      icon: Download,
      badge: 'CSV',
    }
  ];

  return (
    <div className="filter-bar-28 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs flex items-center space-x-1 overflow-x-auto my-1.5">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`micro-pill-22 px-2.5 flex items-center space-x-1.5 font-bold transition-all cursor-pointer whitespace-nowrap text-[10px] ${
              isActive
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Icon className="w-3 h-3 shrink-0" />
            <span>{t.label}</span>
            {t.badge && (
              <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
