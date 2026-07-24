import React, { useState } from 'react';
import {
  Link2,
  X,
  Check,
  Building2,
  FolderKanban,
  CheckCircle2,
  DollarSign,
  Target,
  Users,
  Layers,
  Sparkles
} from 'lucide-react';
import { Workspace, DepartmentItem, ProjectItem, UniversalTask, FinanceConnection, CommandGoal } from './commandCenterTypes';

interface UniversalConnectModalProps {
  isOpen: boolean;
  sourceType: string;
  sourceId: string;
  workspaces: Workspace[];
  departments: DepartmentItem[];
  projects: ProjectItem[];
  tasks: UniversalTask[];
  financeEntries: FinanceConnection[];
  goals: CommandGoal[];
  onClose: () => void;
  onAddLink: (link: {
    sourceType: any;
    sourceId: string;
    targetType: any;
    targetId: string;
    note?: string;
  }) => void;
}

export function UniversalConnectModal({
  isOpen,
  sourceType,
  sourceId,
  workspaces,
  departments,
  projects,
  tasks,
  financeEntries,
  goals,
  onClose,
  onAddLink
}: UniversalConnectModalProps) {
  if (!isOpen) return null;

  const [targetType, setTargetType] = useState<'workspace' | 'department' | 'project' | 'task' | 'finance' | 'goal'>('workspace');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [linkNote, setLinkNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleConnect = () => {
    if (!selectedTargetId) return;

    onAddLink({
      sourceType: sourceType as any,
      sourceId,
      targetType,
      targetId: selectedTargetId,
      note: linkNote || 'Universal Connection'
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 z-50 text-[11px]">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg max-w-lg w-full p-3 shadow-2xl space-y-3">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-600/30 text-indigo-400 rounded border border-indigo-500/30">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-[12px] uppercase tracking-wide">
                Universal Connection Engine (+ Connect)
              </h3>
              <p className="text-[10px] text-slate-400">
                Link <strong className="text-indigo-400 uppercase">{sourceType} #{sourceId}</strong> to any entity ("Create Once. Connect Everywhere").
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Target Entity Category Selection */}
        <div>
          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
            1. Select Target Category to Link
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => { setTargetType('workspace'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'workspace' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => { setTargetType('department'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'department' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Department</span>
            </button>
            <button
              onClick={() => { setTargetType('project'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'project' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FolderKanban className="w-3 h-3" />
              <span>Project</span>
            </button>
            <button
              onClick={() => { setTargetType('task'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'task' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Task</span>
            </button>
            <button
              onClick={() => { setTargetType('finance'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'finance' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>Finance</span>
            </button>
            <button
              onClick={() => { setTargetType('goal'); setSelectedTargetId(''); }}
              className={`p-1.5 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition ${
                targetType === 'goal' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>Goal</span>
            </button>
          </div>
        </div>

        {/* Step 2: Target Selection Box */}
        <div>
          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
            2. Choose Item to Link
          </label>
          <div className="bg-slate-800 border border-slate-700 rounded p-1.5 max-h-40 overflow-y-auto space-y-1">
            {targetType === 'workspace' &&
              workspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedTargetId(w.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === w.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{w.name} ({w.type})</span>
                  {selectedTargetId === w.id && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}

            {targetType === 'department' &&
              departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedTargetId(d.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === d.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{d.name} [{d.code}]</span>
                  {selectedTargetId === d.id && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}

            {targetType === 'project' &&
              projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedTargetId(p.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === p.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{p.name}</span>
                  {selectedTargetId === p.id && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}

            {targetType === 'task' &&
              tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTargetId(t.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === t.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  {selectedTargetId === t.id && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                </button>
              ))}

            {targetType === 'finance' &&
              financeEntries.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedTargetId(f.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === f.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{f.title} (${f.amount})</span>
                  {selectedTargetId === f.id && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}

            {targetType === 'goal' &&
              goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedTargetId(g.id)}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition ${
                    selectedTargetId === g.id ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-700' : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{g.title}</span>
                  {selectedTargetId === g.id && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
          </div>
        </div>

        {/* Step 3: Link Note */}
        <div>
          <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Connection Reason / Note (Optional)</label>
          <input
            type="text"
            value={linkNote}
            onChange={(e) => setLinkNote(e.target.value)}
            placeholder="e.g. Budget allocation & strategy dependency"
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 text-[10px]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedTargetId}
            className={`px-4 py-1.5 font-bold rounded text-[10px] shadow transition flex items-center gap-1 ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : selectedTargetId
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSaved ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            <span>{isSaved ? 'Connected!' : 'Create Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
