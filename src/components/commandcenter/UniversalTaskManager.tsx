import React, { useState, FormEvent } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  User,
  Calendar,
  Clock,
  X,
  Filter,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { UniversalTask, Workspace, DepartmentItem, ProjectItem } from './commandCenterTypes';

interface UniversalTaskManagerProps {
  tasks: UniversalTask[];
  workspaces: Workspace[];
  departments: DepartmentItem[];
  projects: ProjectItem[];
  selectedWorkspaceId: string;
  onAddTask: (task: Omit<UniversalTask, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (id: string, status: UniversalTask['status']) => void;
  onDeleteTask: (id: string) => void;
  onOpenConnectModal: (type: string, id: string) => void;
}

export function UniversalTaskManager({
  tasks,
  workspaces,
  departments,
  projects,
  selectedWorkspaceId,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenConnectModal
}: UniversalTaskManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Task Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<UniversalTask['priority']>('High');
  const [category, setCategory] = useState<UniversalTask['category']>('Important');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMyDay, setIsMyDay] = useState(true);
  const [selectedWsIds, setSelectedWsIds] = useState<string[]>(
    selectedWorkspaceId !== 'all' ? [selectedWorkspaceId] : ['ws-ai-earning']
  );
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [selectedProjIds, setSelectedProjIds] = useState<string[]>([]);

  const filteredTasks = tasks.filter((task) => {
    if (selectedWorkspaceId !== 'all' && !task.workspaceIds.includes(selectedWorkspaceId)) {
      return false;
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      priority,
      category,
      dueDate,
      status: 'In Progress',
      isMyDay,
      workspaceIds: selectedWsIds.length > 0 ? selectedWsIds : ['ws-ai-earning'],
      departmentIds: selectedDeptIds,
      projectIds: selectedProjIds,
      assignedPersonIds: ['p-1']
    });

    setTitle('');
    setDescription('');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Universal Connected Task System</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Create Once. Connect Everywhere. Reused across Workspaces, Depts, Projects & My Day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdowns */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-slate-700 rounded px-2 py-1 text-[10px]"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-slate-700 rounded px-2 py-1 text-[10px]"
          >
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Waiting">Waiting</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[10px] flex items-center gap-1 shadow transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              Add Universal Task
            </h3>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Task Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete AI Earning Ltd website server routes"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as UniversalTask['priority'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none text-[11px]"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UniversalTask['category'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none text-[11px]"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="Important">Important</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">
                Connected Business Workspaces
              </label>
              <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded max-h-24 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    type="button"
                    key={ws.id}
                    onClick={() => toggleWs(ws.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-medium transition ${
                      selectedWsIds.includes(ws.id) ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
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
                className="px-4 py-1 bg-indigo-600 text-white font-bold rounded text-[10px] shadow"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Rows List */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs space-y-1 max-h-[600px] overflow-y-auto">
        {filteredTasks.map((task) => {
          const connectedWs = workspaces.filter((w) => task.workspaceIds.includes(w.id));
          const isDone = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`border p-2 rounded text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition ${
                isDone
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start gap-2 flex-1 truncate">
                <button
                  onClick={() =>
                    onUpdateTaskStatus(task.id, isDone ? 'In Progress' : 'Completed')
                  }
                  className={`mt-0.5 p-0.5 rounded-full border shrink-0 transition ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-indigo-600 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        task.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {connectedWs.map((ws) => (
                      <span
                        key={ws.id}
                        className="text-[8px] px-1.5 py-0.2 text-white font-medium rounded truncate"
                        style={{ backgroundColor: ws.color }}
                      >
                        {ws.name}
                      </span>
                    ))}

                    <span className="text-[9px] text-slate-400 font-mono">Due: {task.dueDate}</span>
                  </div>

                  <p className={`font-semibold text-slate-900 truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => onOpenConnectModal('task', task.id)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-medium rounded border border-slate-200 transition"
                >
                  + Connect
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
