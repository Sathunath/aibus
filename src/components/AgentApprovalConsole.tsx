import React, { useState } from 'react';
import {
  UserCheck,
  Bot,
  Building2,
  Package,
  RefreshCw,
  DollarSign,
  Search,
  Megaphone,
  Share2,
  Mail,
  Terminal,
  ShieldCheck,
  Server,
  BarChart3,
  CheckCircle2,
  Clock,
  Edit3,
  ShieldAlert,
  Sparkles,
  Pause,
  Play,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { AIAgent, Department } from '../types';

interface AgentApprovalConsoleProps {
  agents: AIAgent[];
  onApproveAndRunAgent: (agentId: string, customPrompt?: string) => Promise<void>;
  onPauseAgent: (agentId: string) => void;
  onApproveAllSelected?: () => void;
  onAddAgent?: (newAgent: Partial<AIAgent>) => void;
  onUpdateAgent?: (updatedAgent: AIAgent) => void;
  onDeleteAgent?: (agentId: string) => void;
}

export function AgentApprovalConsole({
  agents,
  onApproveAndRunAgent,
  onPauseAgent,
  onAddAgent,
  onUpdateAgent,
  onDeleteAgent,
}: AgentApprovalConsoleProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paused'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [customTaskText, setCustomTaskText] = useState<string>('');
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Add / Edit Agent Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAgentModal, setEditingAgentModal] = useState<AIAgent | null>(null);

  const [agentForm, setAgentForm] = useState({
    name: '',
    role: '',
    department: 'architecture' as Department,
    currentTask: '',
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Share2': return <Share2 className="w-5 h-5" />;
      case 'Mail': return <Mail className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const handleRunClick = async (agent: AIAgent) => {
    setIsProcessingId(agent.id);
    setStatusFeedback(`Approving & executing agent: ${agent.name}...`);
    try {
      const promptToUse = editingAgentId === agent.id ? customTaskText : agent.pendingTask || agent.currentTask;
      await onApproveAndRunAgent(agent.id, promptToUse);
      setStatusFeedback(`✅ Agent ${agent.name} approved & task completed successfully!`);
      setEditingAgentId(null);
    } catch (err: any) {
      setStatusFeedback(`❌ Error executing ${agent.name}: ${err.message}`);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handlePauseClick = (agent: AIAgent) => {
    onPauseAgent(agent.id);
    setStatusFeedback(`⏸ Agent ${agent.name} put on hold / paused.`);
  };

  const startEditPrompt = (agent: AIAgent) => {
    setEditingAgentId(agent.id);
    setCustomTaskText(agent.pendingTask || agent.currentTask || '');
  };

  const handleSaveAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name || !agentForm.role) return;

    if (editingAgentModal && onUpdateAgent) {
      onUpdateAgent({
        ...editingAgentModal,
        name: agentForm.name,
        role: agentForm.role,
        department: agentForm.department,
        currentTask: agentForm.currentTask || editingAgentModal.currentTask,
      });
      setStatusFeedback(`✅ Agent "${agentForm.name}" updated successfully!`);
    } else if (onAddAgent) {
      onAddAgent({
        id: `agent-${Date.now()}`,
        name: agentForm.name,
        role: agentForm.role,
        department: agentForm.department,
        layer: 'specialist',
        status: 'working',
        currentTask: agentForm.currentTask || 'Awaiting initial instruction queue.',
        tasksCompleted: 0,
        accuracyRate: 100.0,
        avatarColor: 'from-indigo-600 to-purple-600',
        iconName: 'Bot',
        lastActive: 'Just now',
      });
      setStatusFeedback(`✨ New AI Agent "${agentForm.name}" created & registered!`);
    }

    setIsAddModalOpen(false);
    setEditingAgentModal(null);
    setAgentForm({ name: '', role: '', department: 'architecture', currentTask: '' });
  };

  const handleOpenEditAgentModal = (agent: AIAgent) => {
    setEditingAgentModal(agent);
    setAgentForm({
      name: agent.name,
      role: agent.role,
      department: agent.department,
      currentTask: agent.currentTask,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (agent: AIAgent) => {
    if (window.confirm(`Are you sure you want to delete AI Agent "${agent.name}"?`)) {
      if (onDeleteAgent) {
        onDeleteAgent(agent.id);
        setStatusFeedback(`🗑 Agent "${agent.name}" deleted.`);
      }
    }
  };

  const filteredAgents = agents.filter((a) => {
    if (filter === 'pending' && a.approvalStatus === 'approved') return false;
    if (filter === 'approved' && a.approvalStatus !== 'approved') return false;
    if (filter === 'paused' && a.status !== 'paused') return false;

    if (selectedDept !== 'all' && a.department !== selectedDept) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-900/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>IDSOFT AI BUSINESS MANAGER • Human Approval Gate</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              AI Agent Management & Approval Console
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Create, edit, or delete AI Agents. Review each agent's proposed task, customize instructions, and approve & dispatch them on demand.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                setEditingAgentModal(null);
                setAgentForm({ name: '', role: '', department: 'architecture', currentTask: '' });
                setIsAddModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New AI Agent</span>
            </button>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Agents</span>
              <span className="text-lg font-extrabold text-amber-400">{agents.length} Agents</span>
            </div>
          </div>
        </div>

        {statusFeedback && (
          <div className="bg-indigo-950/90 border border-indigo-700/60 text-indigo-200 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between">
            <span>{statusFeedback}</span>
            <button onClick={() => setStatusFeedback(null)} className="text-indigo-400 hover:text-white">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Agents' },
            { id: 'pending', label: 'Needs Review' },
            { id: 'approved', label: 'Approved & Active' },
            { id: 'paused', label: 'Paused / On Hold' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">All Departments</option>
          <option value="architecture">Executive / Architecture</option>
          <option value="sheets_db">Google Sheets & DB</option>
          <option value="suppliers">Supplier CRM</option>
          <option value="catalog">Product Catalog</option>
          <option value="inventory">Inventory & Price</option>
          <option value="social">Social Media Studio</option>
          <option value="seo">Programmatic SEO</option>
          <option value="emails">Smart Email Command</option>
          <option value="workflows">Workflows & Browser</option>
          <option value="tech_ops">Tech Ops & Infrastructure</option>
        </select>
      </div>

      {/* Agents Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => {
          const isWorkingNow = isProcessingId === agent.id;
          const isApproved = agent.approvalStatus === 'approved' && agent.status === 'working';

          return (
            <div
              key={agent.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition ${
                isApproved
                  ? 'border-emerald-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Agent Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.avatarColor} text-white shadow-sm shrink-0`}>
                    {getIcon(agent.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                      <span>{agent.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      Dept: {agent.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditAgentModal(agent)}
                    title="Edit Agent Details"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(agent)}
                    title="Delete Agent"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Details / Edit Prompt */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1 text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Proposed Action Task:</span>
                  </span>
                  {editingAgentId !== agent.id && (
                    <button
                      onClick={() => startEditPrompt(agent)}
                      className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Prompt</span>
                    </button>
                  )}
                </div>

                {editingAgentId === agent.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={customTaskText}
                      onChange={(e) => setCustomTaskText(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-indigo-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingAgentId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setEditingAgentId(null)}
                        className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Save Task Prompt
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {agent.pendingTask || agent.currentTask || 'No pending task queue item.'}
                  </p>
                )}
              </div>

              {/* Bottom Action Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 font-mono">
                  Accuracy: <span className="font-bold text-slate-800">{agent.accuracyRate}%</span> • Tasks: <span className="font-bold text-slate-800">{agent.tasksCompleted}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {isApproved && (
                    <button
                      onClick={() => handlePauseClick(agent)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer flex items-center space-x-1"
                    >
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                      <span>Put on Hold</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleRunClick(agent)}
                    disabled={isWorkingNow}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 ${
                      isApproved
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isWorkingNow ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running Task...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isApproved ? 'Re-Run Task' : 'Approve & Execute Task'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingAgentModal ? 'Edit AI Agent Details' : 'Create New AI Agent'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddAgent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. IDSOFT Custom Operations Agent"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Agent Role & Purpose</label>
                <input
                  type="text"
                  required
                  value={agentForm.role}
                  onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                  placeholder="e.g. Google Sheet Sync & Database Specialist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <select
                  value={agentForm.department}
                  onChange={(e) => setAgentForm({ ...agentForm, department: e.target.value as Department })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="architecture">Executive / Architecture</option>
                  <option value="sheets_db">Google Sheets & DB</option>
                  <option value="suppliers">Supplier CRM</option>
                  <option value="catalog">Product Catalog</option>
                  <option value="inventory">Inventory & Price</option>
                  <option value="social">Social Media Studio</option>
                  <option value="seo">Programmatic SEO</option>
                  <option value="emails">Smart Email Command</option>
                  <option value="workflows">Workflows & Browser</option>
                  <option value="tech_ops">Tech Ops & Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Task Prompt</label>
                <textarea
                  rows={3}
                  value={agentForm.currentTask}
                  onChange={(e) => setAgentForm({ ...agentForm, currentTask: e.target.value })}
                  placeholder="e.g. Monitor active database connection and execute background sync tasks..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingAgentModal ? 'Save Changes' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
