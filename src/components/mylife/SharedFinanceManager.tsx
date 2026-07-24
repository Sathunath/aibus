import { useState, FormEvent } from 'react';
import {
  DollarSign,
  Plus,
  Users,
  PieChart,
  ArrowUpRight,
  ShieldAlert,
  X,
  Trash2,
  Wallet
} from 'lucide-react';
import { LifeSharedFinance, Person } from '../../types';

interface SharedFinanceManagerProps {
  sharedFinances: LifeSharedFinance[];
  people: Person[];
  onAddSharedFinance: (finance: Omit<LifeSharedFinance, 'id' | 'updatedAt'>) => void;
  onDeleteSharedFinance: (id: string) => void;
}

export function SharedFinanceManager({
  sharedFinances,
  people,
  onAddSharedFinance,
  onDeleteSharedFinance
}: SharedFinanceManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Family Support' as LifeSharedFinance['type'],
    memberIds: [] as string[],
    totalAmount: 1000,
    yourContribution: 1000,
    currentBalance: 1000,
    note: ''
  });

  const totalPool = sharedFinances.reduce((acc, sf) => acc + sf.totalAmount, 0);
  const totalYourContribution = sharedFinances.reduce((acc, sf) => acc + sf.yourContribution, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddSharedFinance(formData);
    setIsModalOpen(false);
  };

  const toggleMember = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(personId)
        ? prev.memberIds.filter((id) => id !== personId)
        : [...prev.memberIds, personId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>Shared Family Finances & Allowances</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track joint savings, monthly family support stipends, joint property investments, and shared expenses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shared Finance / Allowance</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 p-5 rounded-2xl text-white shadow-md">
          <div className="flex items-center justify-between text-emerald-200">
            <span className="text-xs font-bold uppercase tracking-wider">Total Shared Pool</span>
            <Wallet className="w-5 h-5 text-emerald-300" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">${totalPool.toLocaleString()}</p>
          <p className="text-xs text-emerald-200 mt-1">Across all active family commitments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Your Total Contribution</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">${totalYourContribution.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Directly provided by you</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Commitments</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{sharedFinances.length}</p>
          <p className="text-xs text-slate-500 mt-1">Accounts & Stipends</p>
        </div>
      </div>

      {/* Shared Finance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sharedFinances.map((sf) => {
          const members = people.filter((p) => sf.memberIds.includes(p.id));
          const pctYourContribution = sf.totalAmount > 0 ? Math.round((sf.yourContribution / sf.totalAmount) * 100) : 0;

          return (
            <div key={sf.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {sf.type}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{sf.title}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteSharedFinance(sf.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {sf.note && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{sf.note}</p>}

                {/* Amount breakdown */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-semibold">Total Pool Amount</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">${sf.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Your Contribution</p>
                    <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                      ${sf.yourContribution.toLocaleString()} ({pctYourContribution}%)
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(pctYourContribution, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Connected members */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Beneficiaries / Members:</span>
                <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                  {members.length === 0 ? (
                    <span className="text-slate-400 italic">None tagged</span>
                  ) : (
                    members.map((m) => (
                      <span key={m.id} className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {m.fullName} ({m.relationship})
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Add Shared Finance / Support</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parents Monthly Allowance, Joint Savings"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as LifeSharedFinance['type'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Family Support">Family Support</option>
                    <option value="Joint Savings">Joint Savings</option>
                    <option value="Shared Asset">Shared Asset</option>
                    <option value="Joint Loan">Joint Loan</option>
                    <option value="Family Expense">Family Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Pool Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Contribution ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.yourContribution}
                  onChange={(e) => setFormData({ ...formData, yourContribution: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tag Beneficiaries / Members</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {people.map((p) => {
                    const isSelected = formData.memberIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleMember(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.fullName} ({p.relationship})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Note / Details</label>
                <textarea
                  rows={2}
                  placeholder="Monthly payment date, bank account info, etc."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
