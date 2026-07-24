import React, { useState, FormEvent } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Check,
  X,
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Workspace, WorkspaceType, WorkspacePriority, WorkspaceStatus } from './commandCenterTypes';

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  onAddWorkspace: (ws: Omit<Workspace, 'id' | 'createdAt'>) => void;
  onUpdateWorkspace: (id: string, partial: Partial<Workspace>) => void;
  onDeleteWorkspace: (id: string) => void;
  onSelectWorkspace: (id: string) => void;
}

export function WorkspaceManager({
  workspaces,
  onAddWorkspace,
  onUpdateWorkspace,
  onDeleteWorkspace,
  onSelectWorkspace
}: WorkspaceManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkspaceType>('Business');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<WorkspaceStatus>('Active');
  const [priority, setPriority] = useState<WorkspacePriority>('High');
  const [color, setColor] = useState('#4f46e5');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');

  const resetForm = () => {
    setName('');
    setType('Business');
    setDescription('');
    setStatus('Active');
    setPriority('High');
    setColor('#4f46e5');
    setStartDate(new Date().toISOString().split('T')[0]);
    setTargetDate('');
    setIsAddOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateWorkspace(editingId, {
        name,
        type,
        description,
        status,
        priority,
        color,
        startDate,
        targetDate: targetDate || undefined
      });
    } else {
      onAddWorkspace({
        name,
        type,
        description,
        status,
        priority,
        color,
        icon: 'Building2',
        startDate,
        targetDate: targetDate || undefined
      });
    }
    resetForm();
  };

  const startEdit = (ws: Workspace) => {
    setEditingId(ws.id);
    setName(ws.name);
    setType(ws.type);
    setDescription(ws.description);
    setStatus(ws.status);
    setPriority(ws.priority);
    setColor(ws.color);
    setStartDate(ws.startDate);
    setTargetDate(ws.targetDate || '');
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-3 text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Workspace & Business Manager</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Create Businesses, Brands, Projects, Investments & Custom Organizations.
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
          <span>+ Create Workspace</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isAddOpen && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <h3 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              {editingId ? 'Edit Workspace' : 'Create New Workspace / Business'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Workspace Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Earning Ltd"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkspaceType)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              >
                <option value="Business">Business</option>
                <option value="Brand">Brand</option>
                <option value="Project">Project</option>
                <option value="Side Project">Side Project</option>
                <option value="Personal Project">Personal Project</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkspaceStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              >
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkspacePriority)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-4">
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the workspace purpose and goals..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Target Completion Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-medium mb-0.5">Accent Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-8 bg-slate-800 border border-slate-700 rounded p-0.5 cursor-pointer"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] shadow transition"
              >
                {editingId ? 'Save Changes' : 'Create Workspace'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workspace Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-2 truncate">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                    style={{ backgroundColor: ws.color }}
                  >
                    {ws.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-slate-900 text-[12px] truncate">{ws.name}</h3>
                    <span className="text-[9px] text-slate-500 block truncate">
                      {ws.type} • {ws.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(ws)}
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteWorkspace(ws.id)}
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 my-1 leading-tight">
                {ws.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-mono text-[9px]">Start: {ws.startDate}</span>

              <button
                onClick={() => onSelectWorkspace(ws.id)}
                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded border border-indigo-200 text-[9px] transition flex items-center gap-1"
              >
                <span>Filter Dashboard</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
