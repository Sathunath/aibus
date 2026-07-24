import React, { useState } from 'react';
import {
  Search,
  Building2,
  FolderKanban,
  CheckCircle2,
  DollarSign,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Workspace, DepartmentItem, ProjectItem, UniversalTask, FinanceConnection, CommandGoal } from './commandCenterTypes';

interface UniversalGlobalSearchProps {
  workspaces: Workspace[];
  departments: DepartmentItem[];
  projects: ProjectItem[];
  tasks: UniversalTask[];
  financeEntries: FinanceConnection[];
  goals: CommandGoal[];
  onOpenConnectModal: (type: string, id: string) => void;
}

export function UniversalGlobalSearch({
  workspaces,
  departments,
  projects,
  tasks,
  financeEntries,
  goals,
  onOpenConnectModal
}: UniversalGlobalSearchProps) {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedWorkspaces = q ? workspaces.filter((w) => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) : [];
  const matchedProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) : [];
  const matchedTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) : [];
  const matchedFinance = q ? financeEntries.filter((f) => f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) : [];
  const matchedGoals = q ? goals.filter((g) => g.title.toLowerCase().includes(q) || g.targetMetric.toLowerCase().includes(q)) : [];

  const totalResults =
    matchedWorkspaces.length +
    matchedProjects.length +
    matchedTasks.length +
    matchedFinance.length +
    matchedGoals.length;

  return (
    <div className="space-y-3 text-[11px]">
      {/* Search Input Header */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            Universal Global Command Search
          </h2>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything across Businesses, Projects, Tasks, Finance & Goals (e.g. 'AI Earning', 'Facebook', '$500')..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-[12px]"
          />
        </div>

        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
          <span>Quick Suggestions:</span>
          <button onClick={() => setQuery('AI Earning')} className="px-2 py-0.5 bg-slate-800 rounded hover:text-white">AI Earning</button>
          <button onClick={() => setQuery('DRPSHOP')} className="px-2 py-0.5 bg-slate-800 rounded hover:text-white">DRPSHOP</button>
          <button onClick={() => setQuery('SEO')} className="px-2 py-0.5 bg-slate-800 rounded hover:text-white">SEO</button>
          <button onClick={() => setQuery('Facebook')} className="px-2 py-0.5 bg-slate-800 rounded hover:text-white">Facebook Ads</button>
        </div>
      </div>

      {/* Results Container */}
      {query && (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-500 font-bold uppercase">
            Found {totalResults} matches for "{query}"
          </div>

          {/* Workspaces Match */}
          {matchedWorkspaces.length > 0 && (
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1">
              <h3 className="font-bold text-indigo-700 uppercase text-[10px] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Workspaces ({matchedWorkspaces.length})</span>
              </h3>
              {matchedWorkspaces.map((ws) => (
                <div key={ws.id} className="p-1.5 bg-slate-50 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-900">{ws.name} ({ws.type})</span>
                  <button onClick={() => onOpenConnectModal('workspace', ws.id)} className="px-2 py-0.5 bg-white border rounded text-[9px]">
                    + Connect
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Projects Match */}
          {matchedProjects.length > 0 && (
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1">
              <h3 className="font-bold text-sky-700 uppercase text-[10px] flex items-center gap-1">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects ({matchedProjects.length})</span>
              </h3>
              {matchedProjects.map((p) => (
                <div key={p.id} className="p-1.5 bg-slate-50 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-900">{p.name}</span>
                  <button onClick={() => onOpenConnectModal('project', p.id)} className="px-2 py-0.5 bg-white border rounded text-[9px]">
                    + Connect
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Match */}
          {matchedTasks.length > 0 && (
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1">
              <h3 className="font-bold text-amber-700 uppercase text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tasks ({matchedTasks.length})</span>
              </h3>
              {matchedTasks.map((t) => (
                <div key={t.id} className="p-1.5 bg-slate-50 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-900">{t.title}</span>
                  <button onClick={() => onOpenConnectModal('task', t.id)} className="px-2 py-0.5 bg-white border rounded text-[9px]">
                    + Connect
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Finance Match */}
          {matchedFinance.length > 0 && (
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1">
              <h3 className="font-bold text-emerald-700 uppercase text-[10px] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Finance ({matchedFinance.length})</span>
              </h3>
              {matchedFinance.map((f) => (
                <div key={f.id} className="p-1.5 bg-slate-50 rounded flex justify-between items-center">
                  <span className="font-bold text-slate-900">{f.title} (${f.amount})</span>
                  <button onClick={() => onOpenConnectModal('finance', f.id)} className="px-2 py-0.5 bg-white border rounded text-[9px]">
                    + Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
