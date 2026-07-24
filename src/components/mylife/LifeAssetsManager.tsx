import { useState, FormEvent } from 'react';
import {
  Home,
  Plus,
  DollarSign,
  User,
  Calendar,
  X,
  Trash2,
  Building
} from 'lucide-react';
import { LifeAsset, Person } from '../../types';
import { useTableViewportFill, PlaceholderRows } from '../ViewportTable';

interface LifeAssetsManagerProps {
  assets: LifeAsset[];
  people: Person[];
  onAddAsset: (assetItem: Omit<LifeAsset, 'id'>) => void;
  onDeleteAsset: (id: string) => void;
}

export function LifeAssetsManager({
  assets,
  people,
  onAddAsset,
  onDeleteAsset
}: LifeAssetsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    assetName: '',
    type: 'House' as LifeAsset['type'],
    value: 500000,
    ownerIds: [] as string[],
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const totalAssetValue = assets.reduce((acc, a) => acc + a.value, 0);

  const { containerRef: assetsTableRef, blankRowsCount: assetsBlankRows } = useTableViewportFill({
    actualRowCount: assets.length,
    rowHeight: 40,
    headerHeight: 28,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.assetName.trim()) return;

    onAddAsset(formData);
    setIsModalOpen(false);
  };

  const toggleOwner = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      ownerIds: prev.ownerIds.includes(personId)
        ? prev.ownerIds.filter((id) => id !== personId)
        : [...prev.ownerIds, personId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Home className="w-6 h-6 text-indigo-600" />
            <span>Family Assets & Real Estate Portfolio ({assets.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track homes, vacation properties, vehicles, and joint family capital holdings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Total Portfolio Value</span>
          <p className="text-3xl font-extrabold text-white mt-1">${totalAssetValue.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
          <Home className="w-6 h-6" />
        </div>
      </div>

      {/* Assets Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 overflow-y-auto" ref={assetsTableRef}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Co-Owners</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {assets.map((ast) => {
                const owners = people.filter((p) => ast.ownerIds.includes(p.id));

                return (
                  <tr key={ast.id} className="hover:bg-slate-50 transition">
                    {/* Asset Name */}
                    <td className="py-2.5 px-4 font-extrabold text-slate-900">
                      {ast.assetName}
                    </td>

                    {/* Type */}
                    <td className="py-2.5 px-4">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {ast.type}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-2.5 px-4 font-mono font-bold text-indigo-700 text-sm">
                      ${ast.value.toLocaleString()}
                    </td>

                    {/* Co-Owners */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                        {owners.length === 0 ? (
                          <span className="text-slate-400 italic text-[11px]">Self Owned</span>
                        ) : (
                          owners.map((o) => (
                            <span key={o.id} className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              {o.fullName} ({o.relationship})
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-2.5 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                      {ast.notes || '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteAsset(ast.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <PlaceholderRows count={assetsBlankRows} colCount={6} rowHeight={40} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Add Family Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco Primary Residence, Tesla Model Y"
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as LifeAsset['type'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="House">House / Real Estate</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Land">Land</option>
                    <option value="Business">Business</option>
                    <option value="Gold / Investment">Gold / Investment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tag Co-Owners / Beneficiaries</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {people.map((p) => {
                    const isSelected = formData.ownerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleOwner(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
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
                <label className="block font-bold text-slate-700 mb-1">Notes / Address</label>
                <textarea
                  rows={2}
                  placeholder="Address, deed registration details..."
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
