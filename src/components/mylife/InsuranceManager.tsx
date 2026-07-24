import { useState, FormEvent } from 'react';
import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  Calendar,
  DollarSign,
  User,
  X,
  Trash2,
  Building
} from 'lucide-react';
import { InsurancePolicy, Person } from '../../types';
import { useTableViewportFill, PlaceholderRows } from '../ViewportTable';

interface InsuranceManagerProps {
  insurances: InsurancePolicy[];
  people: Person[];
  onAddInsurance: (insurance: Omit<InsurancePolicy, 'id'>) => void;
  onDeleteInsurance: (id: string) => void;
}

export function InsuranceManager({
  insurances,
  people,
  onAddInsurance,
  onDeleteInsurance
}: InsuranceManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    policyName: '',
    company: '',
    policyNumber: '',
    policyType: 'Health' as InsurancePolicy['policyType'],
    insuredPersonId: people[0]?.id || '',
    beneficiaryPersonId: people[1]?.id || '',
    premiumAmount: 300,
    paymentFrequency: 'Monthly' as InsurancePolicy['paymentFrequency'],
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '2027-12-31',
    nextPaymentDate: new Date().toISOString().split('T')[0],
    status: 'Active' as InsurancePolicy['status'],
    notes: ''
  });

  const { containerRef: insuranceTableRef, blankRowsCount: insuranceBlankRows } = useTableViewportFill({
    actualRowCount: insurances.length,
    rowHeight: 40,
    headerHeight: 28,
  });

  const expiringCount = insurances.filter((i) => i.status === 'Expiring Soon').length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.policyName.trim() || !formData.insuredPersonId) return;

    onAddInsurance(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>Family Insurance & Protection ({insurances.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central vault for health, term life, vehicle, and home insurance coverage for all family members.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Insurance Policy</span>
        </button>
      </div>

      {expiringCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs font-bold">
            Warning: {expiringCount} insurance policy is marked as Expiring Soon. Please review payment renewal dates.
          </p>
        </div>
      )}

      {/* Insurance Policies Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 overflow-y-auto" ref={insuranceTableRef}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Policy Name & Carrier</th>
                <th className="py-3 px-4">Type & Status</th>
                <th className="py-3 px-4">Insured / Beneficiary</th>
                <th className="py-3 px-4">Premium</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {insurances.map((ins) => {
                const insuredPerson = people.find((p) => p.id === ins.insuredPersonId);
                const beneficiaryPerson = people.find((p) => p.id === ins.beneficiaryPersonId);

                return (
                  <tr key={ins.id} className="hover:bg-slate-50 transition">
                    {/* Policy Name & Carrier */}
                    <td className="py-2.5 px-4 font-extrabold text-slate-900">
                      <div>
                        <p className="text-xs text-slate-900 font-extrabold">{ins.policyName}</p>
                        <p className="text-[10px] text-slate-500 font-normal">
                          {ins.company} • #{ins.policyNumber}
                        </p>
                      </div>
                    </td>

                    {/* Type & Status */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {ins.policyType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ins.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ins.status === 'Expiring Soon'
                              ? 'bg-amber-100 text-amber-800 font-extrabold'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ins.status}
                        </span>
                      </div>
                    </td>

                    {/* Insured / Beneficiary */}
                    <td className="py-2.5 px-4 text-[11px]">
                      <div>
                        <span className="text-slate-700 font-bold">
                          {insuredPerson ? insuredPerson.fullName : 'Unassigned'}
                        </span>
                        {beneficiaryPerson && (
                          <span className="text-slate-400 block text-[10px]">
                            Ben: {beneficiaryPerson.fullName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Premium */}
                    <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">
                      ${ins.premiumAmount} <span className="text-[10px] text-slate-400 font-sans">/{ins.paymentFrequency}</span>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-2.5 px-4 font-mono text-slate-700 font-semibold">
                      {ins.expiryDate}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteInsurance(ins.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete policy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <PlaceholderRows count={insuranceBlankRows} colCount={6} rowHeight={40} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Add Insurance Policy</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Health Care Plus"
                  value={formData.policyName}
                  onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BlueCross, GEICO"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BCBS-991823"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.policyType}
                    onChange={(e) => setFormData({ ...formData, policyType: e.target.value as InsurancePolicy['policyType'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Health">Health</option>
                    <option value="Life">Life</option>
                    <option value="Car">Car</option>
                    <option value="Property">Property</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InsurancePolicy['status'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insured Person *</label>
                  <select
                    value={formData.insuredPersonId}
                    onChange={(e) => setFormData({ ...formData, insuredPersonId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beneficiary</label>
                  <select
                    value={formData.beneficiaryPersonId}
                    onChange={(e) => setFormData({ ...formData, beneficiaryPersonId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">None</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.relationship})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Premium ($)</label>
                  <input
                    type="number"
                    value={formData.premiumAmount}
                    onChange={(e) => setFormData({ ...formData, premiumAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Frequency</label>
                  <select
                    value={formData.paymentFrequency}
                    onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value as InsurancePolicy['paymentFrequency'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Next Payment Date</label>
                  <input
                    type="date"
                    value={formData.nextPaymentDate}
                    onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coverage Notes</label>
                <textarea
                  rows={2}
                  placeholder="Deductible details, hospital network..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
