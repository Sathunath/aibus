import { useState, FormEvent } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Building2,
  Users,
  Bot,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Share2,
  Mail,
  ShieldCheck,
  Send,
  OctagonX,
  Layers
} from 'lucide-react';
import { AIAgent, Department, SystemLog } from '../types';

interface AnalyticsDashboardProps {
  agents: AIAgent[];
  logs: SystemLog[];
  onNavigateTab: (tab: Department) => void;
  onRunAgentTask: (agentId: string, customPrompt?: string) => Promise<void>;
  isEmergencyStopped?: boolean;
  onToggleStopAllTasks?: () => void;
}

export function AnalyticsDashboard({
  agents,
  logs,
  onNavigateTab,
  onRunAgentTask,
  isEmergencyStopped = false,
  onToggleStopAllTasks,
}: AnalyticsDashboardProps) {
  const [customDirective, setCustomDirective] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteDirective = async (e: FormEvent) => {
    e.preventDefault();
    if (!customDirective.trim() || isEmergencyStopped) return;
    setIsExecuting(true);
    await onRunAgentTask(selectedAgentId, customDirective);
    setIsExecuting(false);
    setCustomDirective('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Executive Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                isEmergencyStopped
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isEmergencyStopped ? 'bg-red-600' : 'bg-emerald-500 animate-ping'}`}></span>
                {isEmergencyStopped ? 'SYSTEM EMERGENCY STOPPED' : '14 MULTI-LAYER AGENTS FULLY ACTIVE'}
              </span>
              <span className="text-slate-500 text-xs">USA EST Business Operations</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Executive AI Business Operations Hub</h2>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              14 Autonomous AI Agents (Business Owner, CEO Orchestrator, 12 Specialists, n8n Workflow Engine & Playwright Browser Driver) managing complete USA eCommerce operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onToggleStopAllTasks && (
              <button
                onClick={onToggleStopAllTasks}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer ${
                  isEmergencyStopped
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                }`}
              >
                {isEmergencyStopped ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume All Tasks</span>
                  </>
                ) : (
                  <>
                    <OctagonX className="w-4 h-4" />
                    <span>Stop All Tasks</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onNavigateTab('architecture')}
              className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>System Architecture</span>
            </button>
          </div>
        </div>

        {/* Executive Directive AI Prompt Bar */}
        <form onSubmit={handleExecuteDirective} className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row gap-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 md:w-64">
            <Bot className="w-4 h-4 text-indigo-600" />
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none w-full cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-white text-slate-800">
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
            <Sparkles className="w-4 h-4 text-indigo-500 mr-2 shrink-0" />
            <input
              type="text"
              value={customDirective}
              onChange={(e) => setCustomDirective(e.target.value)}
              disabled={isEmergencyStopped}
              placeholder={isEmergencyStopped ? "System stopped. Click Resume All Tasks to send directives." : "Issue custom executive directive (e.g., 'Draft reseller agreement for Midwest Wholesale')..."}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isExecuting || !customDirective.trim() || isEmergencyStopped}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isExecuting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Dispatch Directive</span>
          </button>
        </form>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-indigo-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Monthly Gross Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">$148,290.00</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1 space-x-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.8% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-purple-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Net Profit Margin (62% Avg)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">$91,939.80</div>
            <div className="flex items-center text-xs text-purple-600 mt-1 space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict MAP Protection</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Syncing SKUs</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">12,450 SKUs</div>
            <div className="flex items-center text-xs text-blue-600 mt-1 space-x-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>15-min auto inventory poll</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-pink-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">12 Social Accounts Reach</span>
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl border border-pink-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">628,400 Reach</div>
            <div className="flex items-center text-xs text-pink-600 mt-1 space-x-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>3 Brands / 4 Platforms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Agent Status & Live Standup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Autonomous Agent Fleet */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Autonomous AI Agent Department Fleet</h3>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full">
              8/8 Agents Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${ag.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                        {ag.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{ag.name}</p>
                        <p className="text-[10px] text-slate-500">{ag.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {ag.accuracyRate}% acc
                    </span>
                  </div>

                  <div className="mt-3 bg-white rounded-lg p-2 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Task:</p>
                    <p className="text-xs text-slate-700 mt-0.5 line-clamp-2 leading-relaxed">{ag.currentTask}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Tasks Completed: <strong className="text-slate-800">{ag.tasksCompleted}</strong></span>
                  <button
                    onClick={() => onRunAgentTask(ag.id)}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" /> Run Cycle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live System Action Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Live AI Action Stream</h3>
              </div>
              <span className="text-[10px] text-slate-400">Real-time Log</span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-700">{log.agentName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-800 leading-snug">{log.message}</p>
                  {log.details && <p className="text-[10px] text-slate-600 font-mono bg-slate-100 p-1.5 rounded border border-slate-200">{log.details}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={() => onNavigateTab('workflows')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-xl transition border border-slate-200 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>View Full n8n & Playwright Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
