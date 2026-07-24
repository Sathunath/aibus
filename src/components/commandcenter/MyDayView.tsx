import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Plus,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  ListTodo,
  DollarSign,
  FolderKanban,
  UserPlus,
  FileText,
  Bell
} from 'lucide-react';
import { UniversalTask, Workspace } from './commandCenterTypes';

interface MyDayViewProps {
  tasks: UniversalTask[];
  workspaces: Workspace[];
  onUpdateTaskStatus: (id: string, status: UniversalTask['status']) => void;
  onOpenQuickAction: (actionType: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function MyDayView({
  tasks,
  workspaces,
  onUpdateTaskStatus,
  onOpenQuickAction,
  onOpenConnectModal
}: MyDayViewProps) {
  const urgentTasks = tasks.filter((t) => t.category === 'Urgent' || t.priority === 'Urgent');
  const importantTasks = tasks.filter((t) => t.category === 'Important' || t.priority === 'High');
  const waitingTasks = tasks.filter((t) => t.status === 'Waiting' || t.category === 'Waiting');
  const followUpTasks = tasks.filter((t) => t.category === 'Follow Up');

  return (
    <div className="space-y-3 text-[11px]">
      {/* Top Banner & Quick Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-2.5 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                My Day Command Center
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Personal daily dashboard focusing on Today's Urgent, Important, Waiting & Follow Up actions.
            </p>
          </div>

          <div className="text-right font-mono text-[10px] text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2 py-1 rounded">
            Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="border-t border-slate-800 pt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick Actions:</span>
          <button
            onClick={() => onOpenQuickAction('task')}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Task</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('finance')}
            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <DollarSign className="w-3 h-3" />
            <span>Finance Expense</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('project')}
            className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <FolderKanban className="w-3 h-3" />
            <span>Project</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('person')}
            className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <UserPlus className="w-3 h-3" />
            <span>Person</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('note')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>Note</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('reminder')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded text-[10px] flex items-center gap-1 transition"
          >
            <Bell className="w-3 h-3 text-rose-400" />
            <span>Reminder</span>
          </button>
        </div>
      </div>

      {/* 4 Quadrant Columns: Urgent, Important, Waiting, Follow Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Quadrant 1: Urgent */}
        <div className="bg-white border border-rose-200 rounded-lg p-2 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-100">
            <div className="flex items-center gap-1 text-rose-700 font-bold uppercase text-[10px]">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Urgent Today ({urgentTasks.length})</span>
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {urgentTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaces={workspaces} onUpdateStatus={onUpdateTaskStatus} onConnect={onOpenConnectModal} />
            ))}
          </div>
        </div>

        {/* Quadrant 2: Important */}
        <div className="bg-white border border-indigo-200 rounded-lg p-2 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-indigo-100">
            <div className="flex items-center gap-1 text-indigo-700 font-bold uppercase text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Important Today ({importantTasks.length})</span>
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {importantTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaces={workspaces} onUpdateStatus={onUpdateTaskStatus} onConnect={onOpenConnectModal} />
            ))}
          </div>
        </div>

        {/* Quadrant 3: Waiting */}
        <div className="bg-white border border-amber-200 rounded-lg p-2 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-amber-100">
            <div className="flex items-center gap-1 text-amber-700 font-bold uppercase text-[10px]">
              <Hourglass className="w-3.5 h-3.5 text-amber-600" />
              <span>Waiting / Pending ({waitingTasks.length})</span>
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {waitingTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaces={workspaces} onUpdateStatus={onUpdateTaskStatus} onConnect={onOpenConnectModal} />
            ))}
          </div>
        </div>

        {/* Quadrant 4: Follow Up */}
        <div className="bg-white border border-purple-200 rounded-lg p-2 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-purple-100">
            <div className="flex items-center gap-1 text-purple-700 font-bold uppercase text-[10px]">
              <ListTodo className="w-3.5 h-3.5 text-purple-600" />
              <span>Follow Up ({followUpTasks.length})</span>
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {followUpTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaces={workspaces} onUpdateStatus={onUpdateTaskStatus} onConnect={onOpenConnectModal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  key?: string;
  task: UniversalTask;
  workspaces: Workspace[];
  onUpdateStatus: (id: string, status: UniversalTask['status']) => void;
  onConnect: (type: string, id: string) => void;
}

function TaskCard({
  task,
  workspaces,
  onUpdateStatus,
  onConnect
}: TaskCardProps) {
  const ws = workspaces.find((w) => task.workspaceIds.includes(w.id));
  const isDone = task.status === 'Completed';

  return (
    <div className="bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] space-y-1 hover:border-indigo-300 transition">
      <div className="flex items-start justify-between gap-1">
        <p className={`font-bold text-slate-900 leading-tight ${isDone ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </p>
        <button
          onClick={() => onConnect('task', task.id)}
          className="text-[8px] px-1 py-0.2 bg-white border border-slate-300 text-slate-600 font-medium rounded shrink-0 hover:border-indigo-500"
        >
          + Link
        </button>
      </div>

      <div className="flex items-center justify-between text-[8px] text-slate-500">
        {ws && (
          <span className="px-1 py-0.2 text-white font-medium rounded truncate max-w-[100px]" style={{ backgroundColor: ws.color }}>
            {ws.name}
          </span>
        )}
        <span>Due: {task.dueDate}</span>
      </div>
    </div>
  );
}
