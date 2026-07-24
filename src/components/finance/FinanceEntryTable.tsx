import { useState } from 'react';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Sparkles,
  Paperclip,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X
} from 'lucide-react';
import { FinanceEntry } from '../../types';
import { AdminDataTable, Column } from '../AdminDataTable';

interface FinanceEntryTableProps {
  entries: FinanceEntry[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange: (newSize: number) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onEdit: (entry: FinanceEntry) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  totalIncome?: number;
  totalExpense?: number;
  netProfit?: number;
}

export function FinanceEntryTable({
  entries,
  total,
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSortChange,
  onEdit,
  onDelete,
  isLoading = false,
  totalIncome = 0,
  totalExpense = 0,
  netProfit = 0
}: FinanceEntryTableProps) {
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; type?: string; name?: string } | null>(null);

  const confirmDelete = async () => {
    if (!deleteCandidateId) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteCandidateId);
      setDeleteCandidateId(null);
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-600 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-600 font-bold" />
    );
  };

  const columns: Column<FinanceEntry>[] = [
    {
      id: 'date',
      header: (
        <div 
          className="flex items-center space-x-1 cursor-pointer select-none group"
          onClick={() => onSortChange('date')}
        >
          <span>Date</span>
          {renderSortIcon('date')}
        </div>
      ),
      cell: (entry) => (
        <span className="font-mono font-bold text-slate-900 whitespace-nowrap text-[11px]">
          {entry.date}
        </span>
      ),
      width: '100px',
    },
    {
      id: 'type',
      header: 'Type',
      cell: (entry) => {
        const isIncome = entry.type === 'income';
        return (
          <span
            className={`inline-flex items-center space-x-1 px-2 py-0.2 rounded-full text-[9px] font-black uppercase border ${
              isIncome
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {isIncome ? (
              <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 text-rose-600" />
            )}
            <span>{entry.type}</span>
          </span>
        );
      },
      width: '95px',
    },
    {
      id: 'category',
      header: 'Category',
      cell: (entry) => (
        <span className="font-bold text-slate-800 whitespace-nowrap text-[11px]">
          {entry.category}
        </span>
      ),
      width: '120px',
    },
    {
      id: 'amount',
      header: (
        <div 
          className="flex items-center justify-end space-x-1 cursor-pointer select-none group"
          onClick={() => onSortChange('amount')}
        >
          <span>Amount</span>
          {renderSortIcon('amount')}
        </div>
      ),
      cell: (entry) => {
        const isIncome = entry.type === 'income';
        return (
          <span className={`text-right block w-full font-mono font-black text-xs whitespace-nowrap ${
            isIncome ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {isIncome ? '+' : '-'}{formatCurrency(entry.amount)}
          </span>
        );
      },
      headerClassName: 'text-right',
      width: '110px',
    },
    {
      id: 'note',
      header: 'Note / Description',
      cell: (entry) => (
        <span className="text-slate-600 truncate text-[11px] block max-w-xs" title={entry.note}>
          {entry.note || <span className="text-slate-300 italic">—</span>}
        </span>
      ),
    },
    {
      id: 'attachment',
      header: 'Doc / Attachment',
      headerClassName: 'text-center',
      className: 'text-center',
      cell: (entry) => (
        entry.attachmentUrl ? (
          <button
            type="button"
            onClick={() =>
              setPreviewAttachment({
                url: entry.attachmentUrl!,
                type: entry.attachmentType,
                name: entry.attachmentName || 'Attached Document'
              })
            }
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
          >
            {entry.attachmentType === 'image' ? (
              <ImageIcon className="w-3 h-3 text-indigo-600 shrink-0" />
            ) : entry.attachmentType === 'pdf' ? (
              <FileText className="w-3 h-3 text-rose-600 shrink-0" />
            ) : (
              <Paperclip className="w-3 h-3 text-teal-600 shrink-0" />
            )}
            <span className="max-w-[80px] truncate">{entry.attachmentName || 'Doc'}</span>
          </button>
        ) : (
          <span className="text-slate-300 italic text-[10px]">—</span>
        )
      ),
      width: '130px',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      cell: (entry) => (
        <span className="text-slate-400 text-[10px] font-mono whitespace-nowrap">
          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
      width: '90px',
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      className: 'text-center',
      cell: (entry) => (
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
            title="Edit Transaction"
          >
            <Edit2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDeleteCandidateId(entry.id)}
            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
            title="Delete Transaction"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
      width: '80px',
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-0 flex-1 flex flex-col min-h-0">
      {/* Table Header Summary Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 min-h-[30px] py-1 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">
            Transaction Records ({total} Total)
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded">
            +{formatCurrency(totalIncome)}
          </span>
          <span className="text-rose-700 bg-rose-50 border border-rose-200 font-bold px-2 py-0.5 rounded">
            -{formatCurrency(totalExpense)}
          </span>
          <span
            className={`font-black px-2 py-0.5 rounded border ${
              netProfit >= 0
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                : 'text-amber-700 bg-amber-50 border-amber-200'
            }`}
          >
            Net: {formatCurrency(netProfit)}
          </span>
        </div>
      </div>

      {/* Replaced Table with AdminDataTable */}
      <AdminDataTable<FinanceEntry>
        columns={columns}
        data={entries}
        loading={isLoading}
        emptyText="No transaction records found."
        rowHeight={30}
        zebra={true}
        externalPagination={{
          currentPage: page,
          pageSize: pageSize,
          totalCount: total,
          onPageChange: onPageChange,
          onPageSizeChange: onPageSizeChange
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-slate-900">Confirm Transaction Delete</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this finance entry? This action will update your database records.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                disabled={isDeleting}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-5 shadow-2xl space-y-4 animate-scale-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {previewAttachment.name || 'Document Preview'}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              {previewAttachment.url.startsWith('data:image') || previewAttachment.type === 'image' ? (
                <img
                  src={previewAttachment.url}
                  alt="Attachment"
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : previewAttachment.type === 'pdf' || previewAttachment.url.includes('.pdf') ? (
                <div className="text-center space-y-3 py-6">
                  <FileText className="w-16 h-16 text-rose-600 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{previewAttachment.name || 'PDF Document'}</p>
                    <p className="text-[11px] text-slate-500">Click below to open or download PDF document.</p>
                  </div>
                  <a
                    href={previewAttachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open / Download PDF</span>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 py-6">
                  <Paperclip className="w-16 h-16 text-indigo-600 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{previewAttachment.name || 'External Document'}</p>
                    <p className="text-[11px] text-slate-500 break-all max-w-md mx-auto">{previewAttachment.url}</p>
                  </div>
                  <a
                    href={previewAttachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open External Document Link</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
