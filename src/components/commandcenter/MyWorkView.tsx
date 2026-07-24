import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  FolderKanban,
  Layers,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UniversalTask, Workspace, ProjectItem, DepartmentItem } from './commandCenterTypes';

interface MyWorkViewProps {
  tasks: UniversalTask[];
  workspaces: Workspace[];
  projects: ProjectItem[];
  departments: DepartmentItem[];
  onUpdateTaskStatus: (id: string, status: UniversalTask['status']) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function MyWorkView({
  tasks,
  workspaces,
  projects,
  departments,
  onUpdateTaskStatus,
  onOpenConnectModal
}: MyWorkViewProps) {
  const [groupBy, setGroupBy] = useState<'workspace' | 'project' | 'priority' | 'deadline'>('workspace');

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header & Group Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>My Assigned Work</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Single unified view of all tasks assigned to you across all businesses & initiatives.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-slate-400 font-bold uppercase">Group By:</span>
          <button
            onClick={() => setGroupBy('workspace')}
            className={`px-2 py-1 rounded font-semibold transition ${
              groupBy === 'workspace'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setGroupBy('project')}
            className={`px-2 py-1 rounded font-semibold transition ${
              groupBy === 'project'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Project
          </button>
          <button
            onClick={() => setGroupBy('priority')}
            className={`px-2 py-1 rounded font-semibold transition ${
              groupBy === 'priority'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Priority
          </button>
        </div>
      </div>

      {/* Grouped Accordions / Lists */}
      <div className="space-y-3">
        {groupBy === 'workspace' &&
          workspaces.map((ws) => {
            const wsTasks = tasks.filter((t) => t.workspaceIds.includes(ws.id));
            if (wsTasks.length === 0) return null;

            return (
              <div key={ws.id} className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ws.color }} />
                    <h3 className="font-bold text-slate-900 text-[12px] uppercase">{ws.name}</h3>
                    <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
                      {wsTasks.length} tasks
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {wsTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-50 border border-slate-200 p-2 rounded flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded mr-2">
                          {task.priority}
                        </span>
                        <span className="font-semibold text-slate-900">{task.title}</span>
                      </div>
                      <button
                        onClick={() => onOpenConnectModal('task', task.id)}
                        className="text-[9px] px-2 py-0.5 bg-white border text-slate-700 rounded hover:border-indigo-500"
                      >
                        + Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {groupBy === 'project' &&
          projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectIds.includes(proj.id));
            return (
              <div key={proj.id} className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-3.5 h-3.5 text-sky-600" />
                    <h3 className="font-bold text-slate-900 text-[12px] uppercase">{proj.name}</h3>
                    <span className="text-[9px] px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded font-mono">
                      {projTasks.length} tasks
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {projTasks.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No tasks explicitly assigned to this project yet.</p>
                  ) : (
                    projTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-50 border border-slate-200 p-2 rounded flex items-center justify-between text-[11px]"
                      >
                        <span className="font-semibold text-slate-900">{task.title}</span>
                        <button
                          onClick={() => onOpenConnectModal('task', task.id)}
                          className="text-[9px] px-2 py-0.5 bg-white border text-slate-700 rounded hover:border-indigo-500"
                        >
                          + Connect
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

        {groupBy === 'priority' &&
          ['Urgent', 'High', 'Medium', 'Low'].map((prio) => {
            const prioTasks = tasks.filter((t) => t.priority === prio);
            return (
              <div key={prio} className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-[12px] uppercase">{prio} Priority Tasks ({prioTasks.length})</h3>
                </div>
                <div className="space-y-1">
                  {prioTasks.map((task) => (
                    <div key={task.id} className="bg-slate-50 border p-2 rounded flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{task.title}</span>
                      <button
                        onClick={() => onOpenConnectModal('task', task.id)}
                        className="text-[9px] px-2 py-0.5 bg-white border text-slate-700 rounded hover:border-indigo-500"
                      >
                        + Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
