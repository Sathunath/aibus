import { useState, FormEvent } from 'react';
import {
  Building2,
  FileText,
  Send,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  Mail,
  Sparkles,
  Bot
} from 'lucide-react';
import { Supplier } from '../types';
import { useTableViewportFill, PlaceholderRows } from './ViewportTable';

interface SupplierStudioProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplierStatus: (id: string, status: Supplier['status']) => void;
  onDraftFollowUpEmail: (supplier: Supplier) => void;
}

export function SupplierStudio({
  suppliers,
  onAddSupplier,
  onUpdateSupplierStatus,
  onDraftFollowUpEmail,
}: SupplierStudioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierNiche, setNewSupplierNiche] = useState('Home Decor');
  const [newSupplierEmail, setNewSupplierEmail] = useState('');
  const [newSupplierMinOrder, setNewSupplierMinOrder] = useState('0');
  const [newSupplierShipping, setNewSupplierShipping] = useState('USA 2-Day');

  // Auto-fill documents simulator state
  const [autoFormSuccess, setAutoFormSuccess] = useState('');

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const { containerRef: supplierTableRef, blankRowsCount: supplierBlankRows } = useTableViewportFill({
    actualRowCount: filteredSuppliers.length,
    rowHeight: 28,
    headerHeight: 28,
  });

  const handleCreateSupplier = (e: FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    const created: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplierName,
      niche: newSupplierNiche,
      contactEmail: newSupplierEmail || `sales@${newSupplierName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      contactPhone: '+1 (800) 555-0199',
      website: `https://${newSupplierName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      status: 'discovered',
      minOrderValue: parseFloat(newSupplierMinOrder) || 0,
      shippingOrigin: newSupplierShipping,
      documentsSubmitted: [],
      notes: 'Newly discovered supplier. AI Agent prepared initial dealer application.',
      leadScore: 92,
      lastContactDate: new Date().toISOString().split('T')[0],
      catalogSize: 1200
    };

    onAddSupplier(created);
    setSelectedSupplier(created);
    setShowAddModal(false);
    setNewSupplierName('');
  };

  const handleAutoFillForm = () => {
    if (!selectedSupplier) return;
    setAutoFormSuccess(`[Apex-SupplierAgent]: Auto-filled 2026 Reseller Exemption, W-9 Form, and FEIN Tax Cert for ${selectedSupplier.name}. Package ready for transmission.`);
    onUpdateSupplierStatus(selectedSupplier.id, 'form_drafted');
    setTimeout(() => setAutoFormSuccess(''), 5000);
  };

  const getStatusBadge = (status: Supplier['status']) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved & Active</span>;
      case 'submitted':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted</span>;
      case 'form_drafted':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FileText className="w-3 h-3" /> Form Drafted</span>;
      case 'follow_up':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Mail className="w-3 h-3" /> Follow-Up Sent</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">Discovered</span>;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Bar (Single 30px Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            USA Supplier CRM & Application Auto-Filler
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Automated discovery, document generation (Reseller Permit, W-9), application submission
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-[26px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New USA Supplier</span>
        </button>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{suppliers.length}</span> TOTAL SUPPLIERS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{suppliers.filter((s) => s.status === 'approved').length}</span> APPROVED & ACTIVE
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{suppliers.filter((s) => s.status === 'submitted' || s.status === 'form_drafted').length}</span> APPLICATIONS IN PROGRESS
        </div>
      </div>

      {/* Main Grid: Supplier List + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Supplier Directory List */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col space-y-2 shadow-xs">
          <div className="flex flex-col space-y-1.5">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search supplier or niche..."
                className="w-full h-[22px] bg-slate-50 text-slate-900 text-[10px] rounded pl-6 pr-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="h-[28px] flex items-center space-x-1 overflow-x-auto pb-0.5 text-xs">
              {['all', 'approved', 'submitted', 'form_drafted', 'discovered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`h-[22px] px-2 rounded-full capitalize whitespace-nowrap text-[10px] font-bold transition cursor-pointer ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[520px] flex-1 overflow-y-auto" ref={supplierTableRef}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="h-[28px] bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-1 px-2.5">Supplier / Niche</th>
                  <th className="py-1 px-2">Score</th>
                  <th className="py-1 px-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredSuppliers.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSupplier(s)}
                    className={`h-[28px] hover:bg-slate-50 transition cursor-pointer ${
                      selectedSupplier?.id === s.id ? 'bg-indigo-50/80 font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{s.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{s.niche}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {s.leadScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {getStatusBadge(s.status)}
                    </td>
                  </tr>
                ))}
                <PlaceholderRows count={supplierBlankRows} colCount={3} rowHeight={28} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Supplier Workspace */}
        {selectedSupplier ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedSupplier.name}</h3>
                  <a
                    href={selectedSupplier.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedSupplier.niche} • {selectedSupplier.shippingOrigin}</p>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusBadge(selectedSupplier.status)}
                <select
                  value={selectedSupplier.status}
                  onChange={(e) => onUpdateSupplierStatus(selectedSupplier.id, e.target.value as any)}
                  className="bg-slate-50 text-slate-800 text-xs rounded-xl px-2.5 py-1.5 border border-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="discovered">Discovered</option>
                  <option value="form_drafted">Form Drafted</option>
                  <option value="submitted">Submitted</option>
                  <option value="follow_up">Follow Up Sent</option>
                  <option value="approved">Approved & Active</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Min Order</span>
                <p className="text-sm font-bold text-slate-900 mt-1">${selectedSupplier.minOrderValue}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Catalog Size</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{selectedSupplier.catalogSize.toLocaleString()} SKUs</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Shipping Speed</span>
                <p className="text-sm font-bold text-emerald-700 mt-1">{selectedSupplier.shippingOrigin}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Lead Quality Score</span>
                <p className="text-sm font-bold text-amber-600 mt-1">{selectedSupplier.leadScore}/100</p>
              </div>
            </div>

            {/* AI Agent Automated Form Generator Panel */}
            <div className="bg-slate-50 border border-indigo-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Apex-SupplierAgent Application Suite</h4>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                  Automated USA Exemption Ready
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically attaches Reseller Permit, W-9 Tax Form, FEIN Registration, and MAP Agreement documents tailored to {selectedSupplier.name}.
              </p>

              {autoFormSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{autoFormSuccess}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={handleAutoFillForm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Auto-Fill Application Forms</span>
                </button>

                <button
                  onClick={() => onDraftFollowUpEmail(selectedSupplier)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Follow-Up Email</span>
                </button>

                <button
                  onClick={() => onUpdateSupplierStatus(selectedSupplier.id, 'submitted')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mark Application Submitted</span>
                </button>
              </div>
            </div>

            {/* Contact Information & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact Coordinates</h5>
                <p className="text-xs text-slate-700"><strong className="text-slate-500">Email:</strong> {selectedSupplier.contactEmail}</p>
                <p className="text-xs text-slate-700"><strong className="text-slate-500">Phone:</strong> {selectedSupplier.contactPhone}</p>
                <p className="text-xs text-slate-700"><strong className="text-slate-500">Last Contact:</strong> {selectedSupplier.lastContactDate}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agent Activity Notes</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedSupplier.notes}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-500">Select a supplier from the list to view details</p>
          </div>
        )}
      </div>

      {/* Add New Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add USA Supplier Target</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  required
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="e.g. Apex Tactical Wholesale USA"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Product Niche</label>
                <select
                  value={newSupplierNiche}
                  onChange={(e) => setNewSupplierNiche(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
                >
                  <option value="Home Decor & Lighting">Home Decor & Lighting</option>
                  <option value="Tactical & Survival">Tactical & Survival</option>
                  <option value="Beauty & Skincare">Beauty & Skincare</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Pet Supplies USA">Pet Supplies USA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">B2B Email Address</label>
                <input
                  type="email"
                  value={newSupplierEmail}
                  onChange={(e) => setNewSupplierEmail(e.target.value)}
                  placeholder="partnerships@supplier.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    value={newSupplierMinOrder}
                    onChange={(e) => setNewSupplierMinOrder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Shipping Speed</label>
                  <input
                    type="text"
                    value={newSupplierShipping}
                    onChange={(e) => setNewSupplierShipping(e.target.value)}
                    placeholder="e.g. Texas 1-Day"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                >
                  Save & Trigger AI Form Fill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
