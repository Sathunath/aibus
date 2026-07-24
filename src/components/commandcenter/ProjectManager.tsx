import React, { useState, FormEvent } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  X,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ProjectItem, Workspace, DepartmentItem } from './commandCenterTypes';

interface ProjectManagerProps {
  projects: ProjectItem[];
  workspaces: Workspace[];
  departments: DepartmentItem[];
  selectedWorkspaceId: string;
  onAddProject: (proj: Omit<ProjectItem, 'id'>) => void;
  onUpdateProject: (id: string, partial: Partial<ProjectItem>) => void;
  onDeleteProject: (id: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function ProjectManager({
  projects,
  workspaces,
  departments,
  selectedWorkspaceId,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onOpenConnectModal
}: ProjectManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectItem['status']>('In Progress');
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [budget, setBudget] = useState<number>(2000);
  const [actualSpend, setActualSpend] = useState<number>(800);
  const [revenue, setRevenue] = useState<number>(3000);
  const [selectedWsIds, setSelectedWsIds] = useState<string[]>(
    selectedWorkspaceId !== 'all' ? [selectedWorkspaceId] : ['ws-ai-earning']
  );
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>(['dept-tech']);

  const filteredProjects = projects.filter((p) => {
    if (selectedWorkspaceId === 'all') return true;
    return p.workspaceIds.includes(selectedWorkspaceId);
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus('In Progress');
    setProgressPercent(50);
    setStartDate(new Date().toISOString().split('T')[0]);
    setDeadline('2026-12-31');
    setBudget(2000);
    setActualSpend(800);
    setRevenue(3000);
    setIsAddOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateProject(editingId, {
        name,
        description,
        status,
        progressPercent,
        startDate,
        deadline,
        budget,
        actualSpend,
        revenue,
        workspaceIds: selectedWsIds,
        departmentIds: selectedDeptIds
      });
    } else {
      onAddProject({
        name,
        description,
        status,
        progressPercent,
        startDate,
        deadline,
        budget,
        actualSpend,
        revenue,
        workspaceIds: selectedWsIds,
        departmentIds: selectedDeptIds,
        memberPersonIds: ['p-1']
      });
    }
    resetForm();
  };

  const startEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setName(proj.name);
    setDescription(proj.description);
    setStatus(proj.status);
    setProgressPercent(proj.progressPercent);
    setStartDate(proj.startDate);
    setDeadline(proj.deadline);
    setBudget(proj.budget);
    setActualSpend(proj.actualSpend);
    setRevenue(proj.revenue);
    setSelectedWsIds(proj.workspaceIds);
    setSelectedDeptIds(proj.departmentIds);
    setIsAddOpen(true);
  };

  const toggleWs = (id: string) => {
    if (selectedWsIds.includes(id)) {
      setSelectedWsIds(selectedWsIds.filter((w) => w !== id));
    } else {
      setSelectedWsIds([...selectedWsIds, id]);
    }
  };

  const toggleDept = (id: string) => {
    if (selectedDeptIds.includes(id)) {
      setSelectedDeptIds(selectedDeptIds.filter((d) => d !== id));
    } else {
      setSelectedDeptIds([...selectedDeptIds, id]);
    }
  };

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <FolderKanban className="w-4 h-4 text-indigo-600" />
            <span>Projects & Initiatives Engine</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Connect projects to multiple businesses, departments, budgets, spend, and financial revenue.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[10px] flex items-center gap-1 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Project</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Social Media Omni-Launch"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectItem['status'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Progress ({progressPercent}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key objectives, deliverables, and targets..."
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Budget ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Actual Spend ($)</label>
                <input
                  type="number"
                  value={actualSpend}
                  onChange={(e) => setActualSpend(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Revenue Generated ($)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>
            </div>

            {/* Connected Workspaces & Departments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">
                  Connected Businesses / Workspaces
                </label>
                <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded max-h-24 overflow-y-auto">
                  {workspaces.map((ws) => (
                    <button
                      type="button"
                      key={ws.id}
                      onClick={() => toggleWs(ws.id)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition ${
                        selectedWsIds.includes(ws.id)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">
                  Connected Departments
                </label>
                <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded max-h-24 overflow-y-auto">
                  {departments.map((dept) => (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => toggleDept(dept.id)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition ${
                        selectedDeptIds.includes(dept.id)
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[10px] shadow transition"
              >
                {editingId ? 'Save Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        {filteredProjects.map((proj) => {
          const connectedWs = workspaces.filter((w) => proj.workspaceIds.includes(w.id));
          const connectedDepts = departments.filter((d) => proj.departmentIds.includes(d.id));

          return (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proj.status === 'In Progress'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {proj.status}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Deadline: {proj.deadline}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-[12px] mt-0.5 truncate">{proj.name}</h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenConnectModal('project', proj.id)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] font-bold rounded"
                    >
                      + Connect
                    </button>
                    <button
                      onClick={() => startEdit(proj)}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 my-1 leading-tight">
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div className="my-1.5">
                  <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                    <span>Progress</span>
                    <span className="font-bold text-indigo-700">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Connected Workspaces & Depts Tags */}
                <div className="flex flex-wrap gap-1 my-1">
                  {connectedWs.map((ws) => (
                    <span
                      key={ws.id}
                      className="text-[8px] px-1.5 py-0.2 text-white font-medium rounded truncate"
                      style={{ backgroundColor: ws.color }}
                    >
                      {ws.name}
                    </span>
                  ))}
                  {connectedDepts.map((d) => (
                    <span
                      key={d.id}
                      className="text-[8px] px-1.5 py-0.2 bg-slate-100 text-slate-700 font-medium rounded border border-slate-200 truncate"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Financial Metrics Row */}
              <div className="pt-2 border-t border-slate-100 mt-2 grid grid-cols-3 gap-1 text-center text-[9px]">
                <div className="bg-slate-50 p-1 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[8px]">Budget</span>
                  <span className="font-bold text-slate-800">${proj.budget.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[8px]">Actual Spend</span>
                  <span className="font-bold text-rose-600">${proj.actualSpend.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-100">
                  <span className="text-slate-400 block text-[8px]">Revenue</span>
                  <span className="font-bold text-emerald-600">${proj.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
