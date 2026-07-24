import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Search,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Download,
  Filter,
  X,
  Lock,
  Sparkles,
  Database,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { CredentialVaultItem } from '../types';
import { useTableViewportFill, PlaceholderRows } from './ViewportTable';

interface CredentialsVaultStudioProps {
  credentials: CredentialVaultItem[];
  onAddCredential: (item: Partial<CredentialVaultItem>) => void;
  onUpdateCredential: (item: CredentialVaultItem) => void;
  onDeleteCredential: (id: string) => void;
}

export function CredentialsVaultStudio({
  credentials,
  onAddCredential,
  onUpdateCredential,
  onDeleteCredential,
}: CredentialsVaultStudioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CredentialVaultItem | null>(null);

  const [formState, setFormState] = useState({
    accountName: '',
    username: '',
    passwordHint: '',
    recoveryAccount: '',
    category: 'Personal' as 'Personal' | 'Social' | 'Business' | 'Store' | 'Database',
    notes: '',
  });

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormState({
      accountName: '',
      username: '',
      passwordHint: '',
      recoveryAccount: '',
      category: 'Personal',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CredentialVaultItem) => {
    setEditingItem(item);
    setFormState({
      accountName: item.accountName,
      username: item.username,
      passwordHint: item.passwordHint,
      recoveryAccount: item.recoveryAccount,
      category: item.category || 'Personal',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.accountName) return;

    if (editingItem) {
      onUpdateCredential({
        ...editingItem,
        accountName: formState.accountName,
        username: formState.username || formState.accountName,
        passwordHint: formState.passwordHint,
        recoveryAccount: formState.recoveryAccount,
        category: formState.category,
        notes: formState.notes,
        lastUpdated: 'Just now',
      });
    } else {
      onAddCredential({
        accountName: formState.accountName,
        username: formState.username || formState.accountName,
        passwordHint: formState.passwordHint,
        recoveryAccount: formState.recoveryAccount,
        category: formState.category,
        notes: formState.notes,
        lastUpdated: 'Just now',
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete credentials for "${name}"?`)) {
      onDeleteCredential(id);
    }
  };

  const exportAsText = () => {
    const lines = credentials.map(
      (c) => `${c.accountName}\tPass hint: ${c.passwordHint}\trecovry ac: ${c.recoveryAccount}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'account_credentials_vault.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCredentials = credentials.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.passwordHint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recoveryAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const { containerRef: vaultTableRef, blankRowsCount: vaultBlankRows } = useTableViewportFill({
    actualRowCount: filteredCredentials.length,
    rowHeight: 28,
    headerHeight: 28,
  });

  return (
    <div className="space-y-3">
      {/* Single 30px Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Account Credentials & Hints Database
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Encrypted vault • Password hints & recovery accounts
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={exportAsText}
            className="h-[22px] sm:h-[22px] px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-md transition cursor-pointer flex items-center space-x-1"
          >
            <Download className="w-3 h-3 text-indigo-600" />
            <span>Export List</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="h-[26px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-md transition shadow-xs cursor-pointer flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{credentials.length}</span> TOTAL ACCOUNTS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{credentials.filter((c) => c.recoveryAccount === '888').length}</span> RECOVERY AC 888
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{credentials.filter((c) => c.recoveryAccount !== '888').length}</span> RECOVERY AC 666 / 777
        </div>

        <div className="h-[28px] px-2.5 bg-slate-50 border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" /> VAULT ACTIVE & SYNCED
        </div>
      </div>

      {/* Filter and Search Controls Bar (28px height) */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts, hints, recovery..."
            className="w-full h-[22px] bg-slate-50 border border-slate-200 rounded pl-6 pr-2 text-[10px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filters (22px micro-pills) */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {['all', 'Personal', 'Social', 'Store', 'Business', 'Database'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-[22px] px-2 rounded-full text-[10px] font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Credentials Table (28px Row Height) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 overflow-y-auto" ref={vaultTableRef}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-[28px] bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-1 px-3">Account Name</th>
                <th className="py-1 px-3">Category</th>
                <th className="py-1 px-3">Password Hint</th>
                <th className="py-1 px-3">Recovery AC</th>
                <th className="py-1 px-3">Notes</th>
                <th className="py-1 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCredentials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 font-medium text-xs">
                    No matching account credentials found.
                  </td>
                </tr>
              ) : (
                filteredCredentials.map((item) => {
                  const isRevealed = !!revealedIds[item.id];
                  const hintKey = `hint-${item.id}`;
                  const recKey = `rec-${item.id}`;

                  return (
                    <tr key={item.id} className="h-[28px] hover:bg-slate-50/80 transition">
                      {/* Account Name */}
                      <td className="py-1 px-3 font-extrabold text-slate-900 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{item.accountName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.username})</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-1 px-3">
                        <span className="inline-block px-2 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category || 'Personal'}
                        </span>
                      </td>

                      {/* Password Hint */}
                      <td className="py-1 px-3 font-mono font-bold text-slate-800 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span>{isRevealed ? item.passwordHint : '••••••••'}</span>
                          <button
                            onClick={() => toggleReveal(item.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition cursor-pointer"
                            title={isRevealed ? 'Hide Hint' : 'Reveal Hint'}
                          >
                            {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(item.passwordHint, hintKey)}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition cursor-pointer"
                            title="Copy Password Hint"
                          >
                            {copiedField === hintKey ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Recovery AC */}
                      <td className="py-1 px-3 font-mono font-extrabold text-indigo-700 text-[11px]">
                        <div className="flex items-center space-x-1">
                          <span className="bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 rounded text-[10px]">
                            {item.recoveryAccount}
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.recoveryAccount, recKey)}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition cursor-pointer"
                            title="Copy Recovery AC"
                          >
                            {copiedField === recKey ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-1 px-3 text-slate-500 font-medium max-w-xs truncate text-[11px]">
                        {item.notes || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-1 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Edit Credential"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.accountName)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              <PlaceholderRows count={vaultBlankRows} colCount={6} rowHeight={28} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <span>{editingItem ? 'Edit Credential' : 'Add New Credential'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Name / ID</label>
                <input
                  type="text"
                  required
                  value={formState.accountName}
                  onChange={(e) => setFormState({ ...formState, accountName: e.target.value })}
                  placeholder="e.g. sathunath666 or fb sathunath"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password Hint</label>
                  <input
                    type="text"
                    required
                    value={formState.passwordHint}
                    onChange={(e) => setFormState({ ...formState, passwordHint: e.target.value })}
                    placeholder="e.g. Lvlv44"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recovery Account</label>
                  <input
                    type="text"
                    required
                    value={formState.recoveryAccount}
                    onChange={(e) => setFormState({ ...formState, recoveryAccount: e.target.value })}
                    placeholder="e.g. 888"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formState.category}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                >
                  <option value="Personal">Personal</option>
                  <option value="Social">Social</option>
                  <option value="Store">Store</option>
                  <option value="Business">Business</option>
                  <option value="Database">Database</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Optional notes about this account..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
