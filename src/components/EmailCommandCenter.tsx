import { useState } from 'react';
import { Mail, Sparkles, Send, CheckCircle, Clock, AlertTriangle, ShieldCheck, RefreshCw, Bot } from 'lucide-react';
import { EmailMessage } from '../types';

interface EmailCommandCenterProps {
  emails: EmailMessage[];
  onDraftReplyWithAI: (email: EmailMessage) => Promise<void>;
  onSendEmailReply: (emailId: string) => void;
}

export function EmailCommandCenter({
  emails,
  onDraftReplyWithAI,
  onSendEmailReply,
}: EmailCommandCenterProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDrafting, setIsDrafting] = useState(false);
  const [customDraftText, setCustomDraftText] = useState('');

  const filteredEmails = emails.filter(
    (e) => filterCategory === 'all' || e.category === filterCategory
  );

  const handleAIDraftClick = async () => {
    if (!selectedEmail) return;
    setIsDrafting(true);
    await onDraftReplyWithAI(selectedEmail);
    setIsDrafting(false);
  };

  const getCategoryBadge = (cat: EmailMessage['category']) => {
    switch (cat) {
      case 'supplier_app':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Supplier Application</span>;
      case 'price_alert':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Price / MAP Alert</span>;
      case 'customer_support':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">Customer Support</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">General</span>;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Bar (Single 30px Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Smart Email Command Center & AI Triage
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Reads, categorizes, prioritizes, and auto-drafts B2B responses
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-[10px]">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-700">Auto-Draft: <strong className="text-emerald-700 font-extrabold">ENABLED</strong></span>
          </div>
        </div>
      </div>

      {/* Inline Stat Chips (28px height) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{emails.length}</span> TOTAL INBOX EMAILS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{emails.filter(e => e.replyStatus === 'sent').length}</span> REPLIED / SENT
        </div>

        <div className="h-[28px] px-2.5 bg-amber-50 border border-amber-200 rounded-md inline-flex items-center text-[10px] font-bold text-amber-800 shadow-2xs whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-600 mr-1" />
          <span className="text-amber-900 font-extrabold text-xs mr-1.5">{emails.filter(e => e.replyStatus !== 'sent').length}</span> DRAFTED / PENDING
        </div>
      </div>

      {/* Main Mail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inbox Column */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col space-y-2 shadow-xs">
          {/* Filter Bar (28px) with 22px micro-pills */}
          <div className="h-[28px] flex items-center space-x-1 overflow-x-auto pb-0.5 text-xs">
            {['all', 'supplier_app', 'price_alert', 'customer_support'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`h-[22px] px-2 rounded-full capitalize whitespace-nowrap text-[10px] font-bold transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[540px] pr-1">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  setCustomDraftText(email.suggestedReply || '');
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  selectedEmail?.id === email.id
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{email.sender}</h4>
                    <p className="text-[11px] font-medium text-slate-700 truncate max-w-[180px] mt-0.5">{email.subject}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{email.receivedAt.split(' ')[1]}</span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{email.snippet}</p>

                <div className="mt-2.5 flex items-center justify-between">
                  {getCategoryBadge(email.category)}
                  {email.replyStatus === 'sent' ? (
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Sent
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> Drafted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Email Message & Response Editor Workspace */}
        {selectedEmail ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">From: <strong className="text-slate-800">{selectedEmail.senderEmail}</strong></span>
                <span className="text-xs text-slate-400">{selectedEmail.receivedAt}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedEmail.subject}</h3>
              <div className="flex items-center space-x-2">
                {getCategoryBadge(selectedEmail.category)}
                <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-medium">
                  Priority: {selectedEmail.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
              {selectedEmail.fullText}
            </div>

            {/* AI Response Generator Box */}
            <div className="bg-slate-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Pulse-EmailAgent Auto-Drafted Response</h4>
                </div>

                <button
                  onClick={handleAIDraftClick}
                  disabled={isDrafting}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDrafting ? 'animate-spin' : ''}`} />
                  <span>Regenerate with AI</span>
                </button>
              </div>

              <textarea
                rows={5}
                value={customDraftText || selectedEmail.suggestedReply || ''}
                onChange={(e) => setCustomDraftText(e.target.value)}
                placeholder="AI response draft..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-mono"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Status: <strong className="text-amber-600">{selectedEmail.replyStatus.toUpperCase()}</strong>
                </span>

                <button
                  onClick={() => onSendEmailReply(selectedEmail.id)}
                  disabled={selectedEmail.replyStatus === 'sent'}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedEmail.replyStatus === 'sent' ? 'Response Sent' : 'Approve & Send Email'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 shadow-sm">
            <Mail className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-500">Select an email to view body and AI response draft</p>
          </div>
        )}
      </div>
    </div>
  );
}
