import React, { useState, FormEvent } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { FinanceConnection, Workspace, DepartmentItem, ProjectItem } from './commandCenterTypes';

interface FinanceConnectionViewProps {
  financeEntries: FinanceConnection[];
  workspaces: Workspace[];
  departments: DepartmentItem[];
  projects: ProjectItem[];
  selectedWorkspaceId: string;
  onAddFinanceEntry: (entry: Omit<FinanceConnection, 'id'>) => void;
  onDeleteFinanceEntry: (id: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function FinanceConnectionView({
  financeEntries,
  workspaces,
  departments,
  projects,
  selectedWorkspaceId,
  onAddFinanceEntry,
  onDeleteFinanceEntry,
  onOpenConnectModal
}: FinanceConnectionViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Marketing');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWsIds, setSelectedWsIds] = useState<string[]>(
    selectedWorkspaceId !== 'all' ? [selectedWorkspaceId] : ['ws-ai-earning']
  );

  const filteredEntries = financeEntries.filter((f) => {
    if (selectedWorkspaceId === 'all') return true;
    return f.workspaceIds.includes(selectedWorkspaceId);
  });

  const totalIncome = filteredEntries
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpense = filteredEntries
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddFinanceEntry({
      title,
      amount,
      type,
      category,
      date,
      workspaceIds: selectedWsIds,
      departmentIds: [],
      projectIds: [],
      personIds: ['p-1']
    });

    setTitle('');
    setIsAddOpen(false);
  };

  const toggleWs = (id: string) => {
    if (selectedWsIds.includes(id)) {
      setSelectedWsIds(selectedWsIds.filter((w) => w !== id));
    } else {
      setSelectedWsIds([...selectedWsIds, id]);
    }
  };

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Connected Financial Allocation Hub</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Track expenses and revenue streams allocated across multiple businesses & projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Total Income</span>
            <span className="font-bold text-emerald-600 text-sm">+${totalIncome.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Total Expenses</span>
            <span className="font-bold text-rose-600 text-sm">-${totalExpense.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[10px] flex items-center gap-1 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Financial Record</span>
          </button>
        </div>
      </div>

      {/* Add Entry Modal */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-emerald-300 uppercase tracking-wide text-[11px]">
              Add Financial Record
            </h3>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Title / Expense Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Facebook Ads - Summer Campaign"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none text-[11px]"
                >
                  <option value="expense">Expense (-)</option>
                  <option value="income">Income (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-emerald-500 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">
                Allocate to Businesses / Workspaces
              </label>
              <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded max-h-24 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    type="button"
                    key={ws.id}
                    onClick={() => toggleWs(ws.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-medium transition ${
                      selectedWsIds.includes(ws.id) ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {ws.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] shadow"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Finance Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs max-h-[500px] overflow-y-auto">
        <div className="space-y-1">
          {filteredEntries.map((f) => {
            const connectedWs = workspaces.filter((w) => f.workspaceIds.includes(w.id));
            const isInc = f.type === 'income';

            return (
              <div
                key={f.id}
                className="bg-slate-50 border border-slate-200 p-2 rounded text-[11px] flex items-center justify-between gap-2"
              >
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isInc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {f.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{f.date}</span>
                    {connectedWs.map((ws) => (
                      <span
                        key={ws.id}
                        className="text-[8px] px-1.5 py-0.2 text-white font-medium rounded truncate"
                        style={{ backgroundColor: ws.color }}
                      >
                        {ws.name}
                      </span>
                    ))}
                  </div>
                  <p className="font-bold text-slate-900 truncate">{f.title}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-mono font-bold text-sm ${
                      isInc ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isInc ? '+' : '-'}${f.amount.toLocaleString()}
                  </span>

                  <button
                    onClick={() => onOpenConnectModal('finance', f.id)}
                    className="px-2 py-0.5 bg-white border text-slate-700 text-[9px] font-medium rounded hover:border-indigo-500"
                  >
                    + Connect
                  </button>

                  <button
                    onClick={() => onDeleteFinanceEntry(f.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
