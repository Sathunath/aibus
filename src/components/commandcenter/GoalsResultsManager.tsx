import React, { useState, FormEvent } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  X
} from 'lucide-react';
import { CommandGoal, Workspace, ProjectItem } from './commandCenterTypes';

interface GoalsResultsManagerProps {
  goals: CommandGoal[];
  workspaces: Workspace[];
  projects: ProjectItem[];
  selectedWorkspaceId: string;
  onAddGoal: (goal: Omit<CommandGoal, 'id' | 'createdAt'>) => void;
  onDeleteGoal: (id: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function GoalsResultsManager({
  goals,
  workspaces,
  projects,
  selectedWorkspaceId,
  onAddGoal,
  onDeleteGoal,
  onOpenConnectModal
}: GoalsResultsManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetMetric, setTargetMetric] = useState('$10,000 Monthly Revenue');
  const [currentProgress, setCurrentProgress] = useState(50);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [budgetAllocated, setBudgetAllocated] = useState(5000);
  const [revenueGenerated, setRevenueGenerated] = useState(12000);
  const [selectedWsIds, setSelectedWsIds] = useState<string[]>(
    selectedWorkspaceId !== 'all' ? [selectedWorkspaceId] : ['ws-ai-earning']
  );

  const filteredGoals = goals.filter((g) => {
    if (selectedWorkspaceId === 'all') return true;
    return g.workspaceIds.includes(selectedWorkspaceId);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      title,
      description,
      targetMetric,
      currentProgress,
      deadline,
      status: 'Active',
      budgetAllocated,
      revenueGenerated,
      workspaceIds: selectedWsIds,
      connectedProjectIds: []
    });

    setTitle('');
    setIsAddOpen(false);
  };

  const toggleWs = (id: string) => {
    if (selectedWsIds.includes(id)) {
      setSelectedWsIds(selectedWsIds.filter((w) => w !== id));
    } else {
      setSelectedWsIds([...selectedWsIds, id]);
    }
  };

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-600" />
            <span>Strategic Goals & Results Tracker</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Goal → Connected Projects → Tasks → Financial Results chain.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium text-[10px] flex items-center gap-1 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Goal</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-purple-300 uppercase tracking-wide text-[11px]">
              Add Strategic Goal
            </h3>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hit $10k Monthly Revenue across businesses"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-purple-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Target Metric</label>
                <input
                  type="text"
                  value={targetMetric}
                  onChange={(e) => setTargetMetric(e.target.value)}
                  placeholder="e.g. $10,000 / mo"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-purple-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Connected Businesses</label>
              <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded max-h-24 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    type="button"
                    key={ws.id}
                    onClick={() => toggleWs(ws.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-medium transition ${
                      selectedWsIds.includes(ws.id) ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {ws.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-purple-600 text-white font-bold rounded text-[10px] shadow"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-2">
        {filteredGoals.map((goal) => {
          const connectedWs = workspaces.filter((w) => goal.workspaceIds.includes(w.id));
          const connectedProjs = projects.filter((p) => goal.connectedProjectIds.includes(p.id));

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-2 py-0.2 bg-purple-100 text-purple-800 font-bold rounded">
                      {goal.targetMetric}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Target: {goal.deadline}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-[13px] mt-0.5">{goal.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenConnectModal('goal', goal.id)}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-medium rounded border hover:border-indigo-500"
                  >
                    + Connect
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="my-2">
                <div className="flex justify-between text-[9px] text-slate-500 mb-0.5 font-medium">
                  <span>Execution Progress</span>
                  <span className="font-bold text-purple-700">{goal.currentProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${goal.currentProgress}%` }}
                  />
                </div>
              </div>

              {/* Connected Workspaces & Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {connectedWs.map((ws) => (
                    <span
                      key={ws.id}
                      className="text-[8px] px-1.5 py-0.2 text-white font-medium rounded"
                      style={{ backgroundColor: ws.color }}
                    >
                      {ws.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    Allocated: <strong className="text-slate-800">${goal.budgetAllocated.toLocaleString()}</strong>
                  </span>
                  <span className="text-slate-500">
                    Revenue: <strong className="text-emerald-600">${goal.revenueGenerated.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
