import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircle,
  Edit2,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Eye,
  FileUp,
  ExternalLink
} from 'lucide-react';
import { FinanceEntry } from '../../types';

interface FinanceEntryFormProps {
  editingEntry?: FinanceEntry | null;
  onSubmit: (data: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    note?: string;
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf' | 'link';
    attachmentName?: string;
  }) => Promise<void>;
  onCancelEdit?: () => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  layoutMode?: 'card' | 'sticky-bar';
  darkMode?: boolean;
}

const DEFAULT_CATEGORIES = [
  'Supplier Payment',
  'Ads / Marketing',
  'Software',
  'Shipping',
  'Salary',
  'Office',
  'Operations',
  'Shopify Sales',
  'Amazon FBA Payout',
  'Wholesale / B2B',
  'TikTok Shop Sales',
  'Other'
];

export function FinanceEntryForm({
  editingEntry,
  onSubmit,
  onCancelEdit,
  isOpenModal,
  onCloseModal,
  layoutMode = 'card',
  darkMode = false
}: FinanceEntryFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Supplier Payment');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  
  // Document Attachment State
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | 'link'>('image');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [showDocInputPopover, setShowDocInputPopover] = useState<boolean>(false);
  const [pastedLink, setPastedLink] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingEntry) {
      setType(editingEntry.type);
      setAmount(String(editingEntry.amount));
      setDate(editingEntry.date);
      setNote(editingEntry.note || '');
      setAttachmentUrl(editingEntry.attachmentUrl || '');
      setAttachmentType(editingEntry.attachmentType || 'image');
      setAttachmentName(editingEntry.attachmentName || '');
      
      if (DEFAULT_CATEGORIES.includes(editingEntry.category)) {
        setCategory(editingEntry.category);
        setIsCustomCategory(false);
      } else {
        setCategory('Other');
        setIsCustomCategory(true);
        setCustomCategory(editingEntry.category);
      }
    } else {
      resetForm();
    }
  }, [editingEntry]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory(type === 'income' ? 'Shopify Sales' : 'Supplier Payment');
    setCustomCategory('');
    setIsCustomCategory(false);
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setAttachmentUrl('');
    setAttachmentType('image');
    setAttachmentName('');
    setPastedLink('');
    setShowDocInputPopover(false);
    setErrorMsg('');
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    if (!editingEntry) {
      if (newType === 'income') {
        setCategory('Shopify Sales');
      } else {
        setCategory('Supplier Payment');
      }
    }
  };

  // Handle local File Upload (Image or PDF)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setErrorMsg('Please select a valid Image (JPG, PNG, WEBP) or PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachmentUrl(dataUrl);
      setAttachmentType(isPdf ? 'pdf' : 'image');
      setAttachmentName(file.name);
      setShowDocInputPopover(false);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Link Pasted Document
  const handleApplyPastedLink = () => {
    if (!pastedLink.trim()) return;
    const linkStr = pastedLink.trim();
    let detectedType: 'image' | 'pdf' | 'link' = 'link';
    if (linkStr.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)($|\?)/)) {
      detectedType = 'image';
    } else if (linkStr.toLowerCase().match(/\.pdf($|\?)/)) {
      detectedType = 'pdf';
    }

    setAttachmentUrl(linkStr);
    setAttachmentType(detectedType);
    setAttachmentName(linkStr.length > 30 ? `${linkStr.substring(0, 27)}...` : linkStr);
    setPastedLink('');
    setShowDocInputPopover(false);
    setErrorMsg('');
  };

  const clearAttachment = () => {
    setAttachmentUrl('');
    setAttachmentType('image');
    setAttachmentName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Please select or specify a transaction category.');
      return;
    }

    if (!date) {
      setErrorMsg('Please select a valid date.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        type,
        amount: Number(parsedAmount.toFixed(2)),
        category: finalCategory,
        date,
        note: note.trim(),
        attachmentUrl: attachmentUrl || undefined,
        attachmentType: attachmentUrl ? attachmentType : undefined,
        attachmentName: attachmentUrl ? attachmentName : undefined
      });

      setSuccessMsg(editingEntry ? 'Transaction updated successfully!' : 'Transaction saved!');
      setTimeout(() => setSuccessMsg(''), 3000);

      if (!editingEntry) {
        resetForm();
      } else if (onCancelEdit) {
        onCancelEdit();
      }

      if (onCloseModal) {
        onCloseModal();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // STICKY BAR HORIZONTAL LAYOUT (Matching user screenshot)
  // -------------------------------------------------------------
  if (layoutMode === 'sticky-bar') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-full overflow-hidden relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="hidden"
        />

        {errorMsg && (
          <div className={`mb-1.5 border text-[10px] font-bold p-1.5 rounded-lg flex items-center justify-between ${
            darkMode ? 'bg-red-950/80 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
            <button type="button" onClick={() => setErrorMsg('')} className="p-0.5 hover:opacity-75 shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
          {/* Label + Header */}
          <div className="flex items-center space-x-1 shrink-0">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              +
            </div>
            <span className={`text-[11px] font-black tracking-tight whitespace-nowrap hidden xl:inline ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {editingEntry ? 'Edit Entry' : 'Add Entry'}
            </span>
          </div>

          {/* Type Selector (INCOME / EXPENSE) */}
          <div className="flex items-center space-x-0.5 shrink-0">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`h-[28px] px-2 rounded-md text-[10px] font-extrabold flex items-center space-x-0.5 border transition cursor-pointer shrink-0 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Income (+)"
            >
              <span>+</span>
              <span className="hidden sm:inline">INC</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`h-[28px] px-2 rounded-md text-[10px] font-extrabold flex items-center space-x-0.5 border transition cursor-pointer shrink-0 ${
                type === 'expense'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-2xs'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Expense (-)"
            >
              <span>-</span>
              <span className="hidden sm:inline">EXP</span>
            </button>
          </div>

          {/* Amount Field */}
          <div className="relative shrink-0 w-20 sm:w-24 md:w-28">
            <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 font-bold text-[11px] ${
              darkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className={`w-full h-[28px] text-[11px] font-mono font-bold rounded-md pl-4 pr-1 focus:outline-none transition-colors ${
                darkMode
                  ? 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-400 focus:bg-slate-900'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
              }`}
            />
          </div>

          {/* Date Picker */}
          <div className="shrink-0 w-24 sm:w-28 md:w-32">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`w-full h-[28px] text-[10px] sm:text-[11px] font-semibold rounded-md px-1 focus:outline-none transition-colors ${
                darkMode
                  ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:bg-slate-900 [color-scheme:dark]'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <div className="shrink-0 w-28 sm:w-36 md:w-40">
            <select
              value={isCustomCategory ? 'Custom' : category}
              onChange={(e) => {
                if (e.target.value === 'Custom') {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setCategory(e.target.value);
                }
              }}
              className={`w-full h-[28px] text-[10px] sm:text-[11px] font-semibold rounded-md px-1 focus:outline-none truncate transition-colors ${
                darkMode
                  ? 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:bg-slate-900'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
              }`}
            >
              {type === 'income' ? (
                <>
                  <option value="Shopify Sales" className={darkMode ? 'bg-slate-900 text-white' : ''}>Shopify Sales</option>
                  <option value="Amazon FBA Payout" className={darkMode ? 'bg-slate-900 text-white' : ''}>Amazon FBA Payout</option>
                  <option value="Wholesale / B2B" className={darkMode ? 'bg-slate-900 text-white' : ''}>Wholesale / B2B</option>
                  <option value="TikTok Shop Sales" className={darkMode ? 'bg-slate-900 text-white' : ''}>TikTok Shop Sales</option>
                  <option value="Affiliate Commission" className={darkMode ? 'bg-slate-900 text-white' : ''}>Affiliate Commission</option>
                  <option value="Other" className={darkMode ? 'bg-slate-900 text-white' : ''}>Other Income</option>
                </>
              ) : (
                <>
                  <option value="Supplier Payment" className={darkMode ? 'bg-slate-900 text-white' : ''}>Supplier Payment</option>
                  <option value="Ads / Marketing" className={darkMode ? 'bg-slate-900 text-white' : ''}>Ads / Marketing</option>
                  <option value="Software" className={darkMode ? 'bg-slate-900 text-white' : ''}>Software & Subscriptions</option>
                  <option value="Shipping" className={darkMode ? 'bg-slate-900 text-white' : ''}>Shipping & Freight</option>
                  <option value="Salary" className={darkMode ? 'bg-slate-900 text-white' : ''}>Salary & VA Operations</option>
                  <option value="Office" className={darkMode ? 'bg-slate-900 text-white' : ''}>Office & Rent</option>
                  <option value="Operations" className={darkMode ? 'bg-slate-900 text-white' : ''}>Operations & Misc</option>
                  <option value="Other" className={darkMode ? 'bg-slate-900 text-white' : ''}>Other Expense</option>
                </>
              )}
            </select>
          </div>

          {/* Note Input */}
          <div className="flex-1 min-w-[80px]">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note/Description..."
              className={`w-full h-[28px] text-[11px] font-medium rounded-md px-2 focus:outline-none transition-colors ${
                darkMode
                  ? 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-400 focus:bg-slate-900'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white'
              }`}
            />
          </div>

          {/* DOCUMENT / RECEIPT UPLOAD / LINK BUTTON */}
          <div className="relative shrink-0">
            {attachmentUrl ? (
              <div className={`h-[28px] px-1.5 border rounded-md flex items-center space-x-1 text-[10px] font-bold ${
                darkMode ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-700'
              }`}>
                {attachmentType === 'image' ? (
                  <ImageIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                ) : attachmentType === 'pdf' ? (
                  <FileText className="w-3 h-3 text-rose-400 shrink-0" />
                ) : (
                  <LinkIcon className="w-3 h-3 text-teal-400 shrink-0" />
                )}
                <span className="max-w-[50px] sm:max-w-[70px] truncate">{attachmentName || 'Doc'}</span>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="p-0.5 hover:bg-indigo-800 text-indigo-300 rounded cursor-pointer shrink-0"
                  title="Remove Attachment"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDocInputPopover(!showDocInputPopover)}
                className={`h-[28px] px-2 border rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors shrink-0 ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title="Attach Document Image, PDF, or Link"
              >
                <Paperclip className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">Attach</span>
              </button>
            )}

            {/* Doc Upload Popover */}
            {showDocInputPopover && (
              <div className={`absolute right-0 top-full mt-1.5 z-50 w-64 border rounded-xl p-2.5 shadow-2xl space-y-2 text-xs ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5">
                  <span className="font-extrabold flex items-center space-x-1 text-[11px]">
                    <FileUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Attach Document / Link</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDocInputPopover(false)}
                    className="p-0.5 text-slate-400 hover:text-white rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option A: Upload Image or PDF File */}
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold block ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Upload File (Image / PDF):
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-[26px] border rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      darkMode ? 'bg-indigo-950 hover:bg-indigo-900 border-indigo-700 text-indigo-200' : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Choose File</span>
                  </button>
                </div>

                <div className="relative text-center my-1">
                  <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div></div>
                  <span className={`relative px-2 text-[9px] font-mono uppercase ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>OR PASTE LINK</span>
                </div>

                {/* Option B: Paste Link URL */}
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold block ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Paste Document URL:
                  </label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="url"
                      value={pastedLink}
                      onChange={(e) => setPastedLink(e.target.value)}
                      placeholder="https://..."
                      className={`flex-1 h-[26px] rounded text-[11px] px-2 focus:outline-none ${
                        darkMode ? 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPastedLink}
                      className="h-[26px] px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px] cursor-pointer"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-[28px] px-3 rounded-md text-[11px] font-black flex items-center justify-center space-x-1 shadow-md transition cursor-pointer shrink-0 disabled:opacity-50 ${
              darkMode
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                : type === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white'
            }`}
          >
            <PlusCircle className="w-3 h-3 stroke-[2.5] shrink-0" />
            <span className="whitespace-nowrap">{isSubmitting ? 'Saving...' : editingEntry ? 'Save' : '+ Add'}</span>
          </button>
        </div>
      </form>
    );
  }

  // -------------------------------------------------------------
  // CARD / MODAL STANDARD FORM LAYOUT
  // -------------------------------------------------------------
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Type Toggle */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Transaction Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              type === 'income'
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">+</span>
            <span>INCOME (Revenue)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              type === 'expense'
                ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-500/20 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">-</span>
            <span>EXPENSE (Outgoing)</span>
          </button>
        </div>
      </div>

      {/* Amount & Date Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Amount ($ USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Transaction Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <select
            value={isCustomCategory ? 'Custom' : category}
            onChange={(e) => {
              if (e.target.value === 'Custom') {
                setIsCustomCategory(true);
              } else {
                setIsCustomCategory(false);
                setCategory(e.target.value);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
          >
            {type === 'income' ? (
              <>
                <option value="Shopify Sales">Shopify Sales</option>
                <option value="Amazon FBA Payout">Amazon FBA Payout</option>
                <option value="Wholesale / B2B">Wholesale / B2B</option>
                <option value="TikTok Shop Sales">TikTok Shop Sales</option>
                <option value="Affiliate Commission">Affiliate Commission</option>
                <option value="Other">Other Income</option>
                <option value="Custom">+ Custom Category...</option>
              </>
            ) : (
              <>
                <option value="Supplier Payment">Supplier Payment</option>
                <option value="Ads / Marketing">Ads / Marketing</option>
                <option value="Software">Software & Subscriptions</option>
                <option value="Shipping">Shipping & Freight</option>
                <option value="Salary">Salary & VA Operations</option>
                <option value="Office">Office & Rent</option>
                <option value="Operations">Operations & Misc</option>
                <option value="Other">Other Expense</option>
                <option value="Custom">+ Custom Category...</option>
              </>
            )}
          </select>

          {isCustomCategory && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category name..."
              required
              className="w-full bg-indigo-50/50 border border-indigo-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>
      </div>

      {/* Note / Description */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Note / Description <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Invoice #SUP-9921 for Air Fryers Batch 4..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
        />
      </div>

      {/* DOCUMENT / RECEIPT ATTACHMENT SECTION */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
            <span>Document / Receipt Attachment</span>
          </label>
          {attachmentUrl && (
            <button
              type="button"
              onClick={clearAttachment}
              className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Remove Attachment
            </button>
          )}
        </div>

        {attachmentUrl ? (
          <div className="p-2 bg-white border border-indigo-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              {attachmentType === 'image' && attachmentUrl.startsWith('data:image') ? (
                <img src={attachmentUrl} alt="Preview" className="w-8 h-8 object-cover rounded border border-slate-200" />
              ) : attachmentType === 'pdf' ? (
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
                  <FileText className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 bg-teal-50 text-teal-600 rounded">
                  <LinkIcon className="w-4 h-4" />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{attachmentName || 'Attached File'}</p>
                <p className="text-[10px] text-slate-500 uppercase font-mono">{attachmentType}</p>
              </div>
            </div>

            {attachmentUrl.startsWith('http') && (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
                title="Open Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3 bg-white border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Upload Image / PDF</span>
            </button>

            <div className="flex items-center space-x-1">
              <input
                type="url"
                value={pastedLink}
                onChange={(e) => setPastedLink(e.target.value)}
                placeholder="Or paste link URL..."
                className="flex-1 bg-white border border-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyPastedLink}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-2.5 rounded-xl cursor-pointer"
              >
                Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
            type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {editingEntry ? <Edit2 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
          <span>{isSubmitting ? 'Saving...' : editingEntry ? 'Save Changes' : 'Add Transaction'}</span>
        </button>

        {editingEntry && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                {editingEntry ? 'Edit Finance Transaction' : 'Add Finance Entry'}
              </h3>
            </div>
            <button
              onClick={onCloseModal}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        {editingEntry ? <Edit2 className="w-4 h-4 text-indigo-600" /> : <PlusCircle className="w-4 h-4 text-indigo-600" />}
        <h3 className="text-sm font-extrabold text-slate-900">
          {editingEntry ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
      </div>
      {formContent}
    </div>
  );
}
