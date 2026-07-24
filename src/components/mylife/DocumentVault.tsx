import { useState, FormEvent } from 'react';
import {
  FileText,
  Plus,
  Search,
  User,
  Calendar,
  X,
  Trash2,
  Download,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { LifeDocument, Person } from '../../types';

interface DocumentVaultProps {
  documents: LifeDocument[];
  people: Person[];
  onAddDocument: (doc: Omit<LifeDocument, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

export function DocumentVault({
  documents,
  people,
  onAddDocument,
  onDeleteDocument
}: DocumentVaultProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    docType: 'Passport' as LifeDocument['docType'],
    ownerPersonId: people[0]?.id || '',
    issueDate: '',
    expiryDate: '',
    notes: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.ownerPersonId) return;

    onAddDocument(formData);
    setIsModalOpen(false);
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.docType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || d.docType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-amber-600" />
            <span>Family Digital Document Vault ({documents.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure digital repository for Passports, National IDs, Birth/Marriage Certificates, and Property Deeds.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Register Document</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto"
        >
          <option value="all">All Document Types</option>
          <option value="Passport">Passport</option>
          <option value="National ID">National ID</option>
          <option value="Birth Certificate">Birth Certificate</option>
          <option value="Marriage Certificate">Marriage Certificate</option>
          <option value="Insurance Policy">Insurance Policy</option>
          <option value="Property Document">Property Document</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const owner = people.find((p) => p.id === doc.ownerPersonId);

          return (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {doc.docType}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2">{doc.title}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 text-xs space-y-1 text-slate-600">
                  <p className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">
                      Owner: {owner ? `${owner.fullName} (${owner.relationship})` : 'Unassigned'}
                    </span>
                  </p>
                  {doc.issueDate && <p className="text-slate-500">Issued: {doc.issueDate}</p>}
                  {doc.expiryDate && (
                    <p className="font-semibold text-slate-700 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Expires: {doc.expiryDate}</span>
                    </p>
                  )}
                </div>

                {doc.notes && <p className="text-xs text-slate-500 mt-3 italic bg-slate-50 p-2 rounded-lg border border-slate-100">{doc.notes}</p>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Encrypted</span>
                </span>
                <button
                  onClick={() => alert(`Simulating viewing digital attachment for ${doc.title}`)}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Doc</span>
                </button>
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
              <h2 className="text-lg font-extrabold text-slate-900">Register Document</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother's Passport"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={formData.docType}
                    onChange={(e) => setFormData({ ...formData, docType: e.target.value as LifeDocument['docType'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Passport">Passport</option>
                    <option value="National ID">National ID</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Marriage Certificate">Marriage Certificate</option>
                    <option value="Insurance Policy">Insurance Policy</option>
                    <option value="Property Document">Property Document</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Owner *</label>
                  <select
                    value={formData.ownerPersonId}
                    onChange={(e) => setFormData({ ...formData, ownerPersonId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
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
                  <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Location & Storage Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stored in Home Safe #1..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
