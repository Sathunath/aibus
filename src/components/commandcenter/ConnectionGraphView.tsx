import React, { useState } from 'react';
import {
  Network,
  Building2,
  FolderKanban,
  Layers,
  CheckCircle2,
  DollarSign,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Workspace, DepartmentItem, ProjectItem, UniversalTask, FinanceConnection, CommandGoal } from './commandCenterTypes';

interface ConnectionGraphViewProps {
  workspaces: Workspace[];
  departments: DepartmentItem[];
  projects: ProjectItem[];
  tasks: UniversalTask[];
  financeEntries: FinanceConnection[];
  goals: CommandGoal[];
  onSelectWorkspace: (id: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function ConnectionGraphView({
  workspaces,
  departments,
  projects,
  tasks,
  financeEntries,
  goals,
  onSelectWorkspace,
  onOpenConnectModal
}: ConnectionGraphViewProps) {
  const [selectedWsId, setSelectedWsId] = useState<string>('ws-ai-earning');

  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];
  const wsDepts = departments.filter((d) => d.workspaceIds.includes(ws.id));
  const wsProjects = projects.filter((p) => p.workspaceIds.includes(ws.id));
  const wsTasks = tasks.filter((t) => t.workspaceIds.includes(ws.id));
  const wsFinance = financeEntries.filter((f) => f.workspaceIds.includes(ws.id));
  const wsGoals = goals.filter((g) => g.workspaceIds.includes(ws.id));

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Network className="w-4 h-4 text-indigo-600" />
            <span>Interactive Connection Graph & Network Explorer</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Visual relationship map connecting Business → Dept → Project → Tasks → Finance → Goal.
          </p>
        </div>

        {/* Workspace Switcher Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-md py-0.5">
          {workspaces.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWsId(w.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                selectedWsId === w.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Relationship Flow Node Map */}
      <div className="bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-lg shadow-inner overflow-x-auto">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ws.color }} />
            <span className="font-bold text-white text-[13px] uppercase">{ws.name}</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">{ws.type}</span>
          </div>

          <button
            onClick={() => onOpenConnectModal('workspace', ws.id)}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px]"
          >
            + Link Entity
          </button>
        </div>

        {/* 5 Column Flow: Business -> Depts -> Projects -> Tasks -> Goals */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 min-w-[750px]">
          {/* Column 1: Departments */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded space-y-1">
            <div className="text-[9px] uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>1. Departments</span>
            </div>
            {wsDepts.map((d) => (
              <div key={d.id} className="p-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-200">
                {d.name}
              </div>
            ))}
          </div>

          {/* Column 2: Projects */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded space-y-1">
            <div className="text-[9px] uppercase font-bold text-sky-400 mb-1 flex items-center gap-1">
              <FolderKanban className="w-3 h-3" />
              <span>2. Projects</span>
            </div>
            {wsProjects.map((p) => (
              <div key={p.id} className="p-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-200">
                {p.name}
              </div>
            ))}
          </div>

          {/* Column 3: Tasks */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded space-y-1">
            <div className="text-[9px] uppercase font-bold text-amber-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>3. Active Tasks</span>
            </div>
            {wsTasks.map((t) => (
              <div key={t.id} className="p-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-200 truncate">
                {t.title}
              </div>
            ))}
          </div>

          {/* Column 4: Finance */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded space-y-1">
            <div className="text-[9px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>4. Finance</span>
            </div>
            {wsFinance.map((f) => (
              <div key={f.id} className="p-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-200 flex justify-between">
                <span className="truncate">{f.title}</span>
                <span className={f.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>${f.amount}</span>
              </div>
            ))}
          </div>

          {/* Column 5: Strategic Goals */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded space-y-1">
            <div className="text-[9px] uppercase font-bold text-purple-400 mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>5. Strategic Goal</span>
            </div>
            {wsGoals.map((g) => (
              <div key={g.id} className="p-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-200">
                {g.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
