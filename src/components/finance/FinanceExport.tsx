import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface FinanceExportProps {
  onTriggerExport: (startDate: string, endDate: string, format: 'csv' | 'xlsx') => Promise<void>;
  totalEntriesCount: number;
}

export function FinanceExport({ onTriggerExport, totalEntriesCount }: FinanceExportProps) {
  const [exportRange, setExportRange] = useState<'this_month' | 'this_year' | 'all' | 'custom'>('this_month');
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>('');

  const handleRangeSelect = (r: 'this_month' | 'this_year' | 'all' | 'custom') => {
    setExportRange(r);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (r === 'this_month') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      setStartDate(`${year}-${month}-01`);
      setEndDate(todayStr);
    } else if (r === 'this_year') {
      const year = today.getFullYear();
      setStartDate(`${year}-01-01`);
      setEndDate(todayStr);
    } else if (r === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleDownload = async () => {
    setExportError('');
    setDownloadSuccess(false);
    try {
      setIsExporting(true);
      await onTriggerExport(startDate, endDate, format);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      setExportError(err.message || 'Failed to download report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Export Finance Reports & Statement Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate audit-ready spreadsheets containing transaction details and profit/loss summaries.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Ready to Export
        </span>
      </div>

      {exportError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{exportError}</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Finance report file downloaded successfully to your device!</span>
        </div>
      )}

      {/* Step 1: Select Date Range */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          1. Select Statement Date Range
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'this_month', label: 'This Month' },
            { id: 'this_year', label: 'This Year' },
            { id: 'all', label: 'All Time' },
            { id: 'custom', label: 'Custom Range' }
          ].map((r) => {
            const isSelected = exportRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRangeSelect(r.id as any)}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer border text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {exportRange === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Select File Format */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          2. Select File Output Format
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Excel (.xlsx) */}
          <button
            type="button"
            onClick={() => setFormat('xlsx')}
            className={`p-4 rounded-2xl transition border text-left flex items-start space-x-3 cursor-pointer ${
              format === 'xlsx'
                ? 'bg-emerald-50 border-emerald-500 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${format === 'xlsx' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold">Excel Workbook (.xlsx)</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Professional multi-sheet workbook containing structured transaction worksheets and formatted financial summaries.
              </p>
            </div>
          </button>

          {/* CSV (.csv) */}
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`p-4 rounded-2xl transition border text-left flex items-start space-x-3 cursor-pointer ${
              format === 'csv'
                ? 'bg-indigo-50 border-indigo-500 text-slate-900 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${format === 'csv' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold">CSV Statement (.csv)</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Standard comma-separated text file compatible with all accounting applications, Google Sheets, and databases.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Download Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Available dataset size: <strong className="text-slate-900">{totalEntriesCount}</strong> transactions
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating Report...' : `Export ${format.toUpperCase()} Report`}</span>
        </button>
      </div>
    </div>
  );
}
