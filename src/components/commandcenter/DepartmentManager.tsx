import React, { useState, FormEvent } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  Users,
  CheckCircle2,
  X,
  Archive
} from 'lucide-react';
import { DepartmentItem, Workspace, ProjectItem } from './commandCenterTypes';

interface DepartmentManagerProps {
  departments: DepartmentItem[];
  workspaces: Workspace[];
  projects: ProjectItem[];
  selectedWorkspaceId: string;
  onAddDepartment: (dept: Omit<DepartmentItem, 'id'>) => void;
  onDeleteDepartment: (id: string) => void;
}

export function DepartmentManager({
  departments,
  workspaces,
  projects,
  selectedWorkspaceId,
  onAddDepartment,
  onDeleteDepartment
}: DepartmentManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [selectedWsIds, setSelectedWsIds] = useState<string[]>(
    selectedWorkspaceId !== 'all' ? [selectedWorkspaceId] : []
  );

  const filteredDepartments = departments.filter((d) => {
    if (selectedWorkspaceId === 'all') return true;
    return d.workspaceIds.includes(selectedWorkspaceId);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    onAddDepartment({
      name: deptName,
      code: deptCode.toUpperCase() || 'DEPT',
      workspaceIds: selectedWsIds.length > 0 ? selectedWsIds : ['ws-ai-earning']
    });

    setDeptName('');
    setDeptCode('');
    setIsAddOpen(false);
  };

  const toggleWsSelection = (wsId: string) => {
    if (selectedWsIds.includes(wsId)) {
      setSelectedWsIds(selectedWsIds.filter((id) => id !== wsId));
    } else {
      setSelectedWsIds([...selectedWsIds, wsId]);
    }
  };

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Department Hub</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Connect departments across multiple businesses & assign projects/team members.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[10px] flex items-center gap-1 shadow transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Department</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              Create Department
            </h3>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Tech"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Dept Code</label>
                <input
                  type="text"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. TECH"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-1">
                Connected Businesses / Workspaces (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5 bg-slate-800/80 border border-slate-700 p-2 rounded max-h-28 overflow-y-auto">
                {workspaces.map((ws) => {
                  const isChecked = selectedWsIds.includes(ws.id);
                  return (
                    <button
                      type="button"
                      key={ws.id}
                      onClick={() => toggleWsSelection(ws.id)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition flex items-center gap-1 ${
                        isChecked
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ws.color }} />
                      <span>{ws.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[10px] shadow transition"
              >
                Create Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredDepartments.map((dept) => {
          const connectedWs = workspaces.filter((w) => dept.workspaceIds.includes(w.id));
          const deptProjects = projects.filter((p) => p.departmentIds.includes(dept.id));

          return (
            <div
              key={dept.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[9px] rounded font-mono">
                      {dept.code || 'DEPT'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-[12px] truncate">{dept.name}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteDepartment(dept.id)}
                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Connected Businesses */}
                <div className="my-1.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Supporting Workspaces:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {connectedWs.map((ws) => (
                      <span
                        key={ws.id}
                        className="px-1.5 py-0.2 rounded text-[8px] font-medium text-white truncate"
                        style={{ backgroundColor: ws.color }}
                      >
                        {ws.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connected Projects Count */}
              <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-1 text-sky-700 font-semibold">
                  <FolderKanban className="w-3 h-3 text-sky-600" />
                  <span>{deptProjects.length} Active Projects</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">ID: {dept.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
