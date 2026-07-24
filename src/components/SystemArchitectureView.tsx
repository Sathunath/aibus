import { useState } from 'react';
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
  Workflow,
  Globe,
  Radio,
  Cpu,
  Database,
  ExternalLink,
  OctagonX,
  Play,
  ArrowDown,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AIAgent } from '../types';

interface SystemArchitectureViewProps {
  agents: AIAgent[];
  isEmergencyStopped: boolean;
  onToggleStopAllTasks: () => void;
  onRunAgentTask: (agentId: string, customPrompt?: string) => Promise<void>;
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export function SystemArchitectureView({
  agents = [],
  isEmergencyStopped,
  onToggleStopAllTasks,
  onRunAgentTask,
  activeSubTab: externalSubTab,
  onSubTabChange,
}: SystemArchitectureViewProps) {
  const [internalTab, setInternalTab] = useState<'hierarchy' | 'queues' | 'data'>('hierarchy');
  const activeTab = (externalSubTab as 'hierarchy' | 'queues' | 'data') || internalTab;

  const handleTabChange = (tab: 'hierarchy' | 'queues' | 'data') => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Filter Agents by Layer
  const ownerAgent = (agents && agents.length > 0) ? (agents.find((a) => a.layer === 'business_owner') || agents[0]) : null;
  const ceoAgent = (agents && agents.length > 0) ? (agents.find((a) => a.layer === 'executive') || agents[1] || agents[0]) : null;
  const specialistAgents = (agents || []).filter((a) => a.layer === 'specialist' || (!a.layer && a.department !== 'workflows' && a.department !== 'architecture'));
  const workflowAgent = (agents || []).find((a) => a.id === 'agent-workflow') || (agents || []).find((a) => a.layer === 'workflow');
  const browserAgent = (agents || []).find((a) => a.id === 'agent-playwright') || (agents || []).find((a) => a.layer === 'browser_agent');

  return (
    <div className="space-y-6">
      {/* Top Header & Emergency Task Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Multi-Layer System Architecture & Multi-Agent Network</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing the 14-Agent Hierarchy, Redis + BullMQ Event Bus Queue, Node/AI Workers, Data Platform & External Connectors.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onToggleStopAllTasks}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2 cursor-pointer ${
              isEmergencyStopped
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            }`}
          >
            {isEmergencyStopped ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Background Tasks</span>
              </>
            ) : (
              <>
                <OctagonX className="w-4 h-4" />
                <span>Stop All Background Tasks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => handleTabChange('hierarchy')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hierarchy Diagram
        </button>
        <button
          onClick={() => handleTabChange('queues')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'queues'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Event Bus & BullMQ Workers
        </button>
        <button
          onClick={() => handleTabChange('data')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'data'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Data Platform & Storage
        </button>
      </div>

      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* LAYER 1: BUSINESS OWNER */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 text-center shadow-sm relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] uppercase font-mono font-bold px-3 py-0.5 rounded-full shadow-xs">
                BUSINESS OWNER LAYER
              </div>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <UserCheck className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-slate-900">BUSINESS OWNER COMMAND</h3>
              </div>
              <p className="text-xs text-amber-900 mt-1 font-medium">Strategy / Approvals • Risk / Finance Management • Goal Setting ($250k Q3)</p>
              
              <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold text-amber-900">{ownerAgent?.name || 'Business Owner Command Agent'}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEmergencyStopped ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                  {isEmergencyStopped ? 'Halted' : 'Active Oversight'}
                </span>
              </div>
            </div>

            <ArrowDown className="w-6 h-6 text-indigo-400 my-2 animate-bounce" />
          </div>

          {/* LAYER 2: AI EXECUTIVE LAYER */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl bg-indigo-50/80 border-2 border-indigo-300 rounded-2xl p-5 text-center shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-mono font-bold px-3 py-0.5 rounded-full shadow-xs">
                AI EXECUTIVE LAYER
              </div>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Bot className="w-5 h-5 text-indigo-700" />
                <h3 className="text-base font-bold text-slate-900">CEO / COO ORCHESTRATOR</h3>
              </div>
              <p className="text-xs text-indigo-900 mt-1 font-medium">
                Multi-Agent Dispatcher • Priority Routing • Resource Allocation • BullMQ Worker Balancing
              </p>

              <div className="mt-3 pt-3 border-t border-indigo-200 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold text-indigo-900">{ceoAgent?.name || 'AI CEO / Executive Dispatcher'}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEmergencyStopped ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'}`}>
                  {isEmergencyStopped ? 'Halted' : 'Orchestrating 14 Agents'}
                </span>
              </div>
            </div>

            <div className="w-px h-6 bg-indigo-300 my-1"></div>
          </div>

          {/* LAYER 3: SPECIALIST AGENTS, WORKFLOW ENGINE & BROWSER AGENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMN 1: SPECIALIST AGENTS */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm relative">
              <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center justify-between">
                <span>SPECIALIST AGENTS (12)</span>
                <span className="text-[10px] font-mono text-emerald-400">Autonomous</span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {specialistAgents.map((sa) => (
                  <div key={sa.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs flex items-center justify-between hover:border-indigo-300 transition">
                    <div>
                      <p className="font-bold text-slate-900">{sa.name}</p>
                      <p className="text-[10px] text-slate-500">{sa.role}</p>
                    </div>
                    <button
                      onClick={() => onRunAgentTask(sa.id)}
                      disabled={isEmergencyStopped}
                      className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
                    >
                      Run
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: WORKFLOW ENGINE */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 space-y-4 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center justify-between">
                  <span>WORKFLOW ENGINE</span>
                  <span className="text-[10px] font-mono text-amber-300">n8n Engine</span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                      <Workflow className="w-4 h-4 text-indigo-600" />
                      <span>{workflowAgent?.name || 'Nexus-n8nAgent'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Visual Node Pipelines, Webhook Listeners, Schedulers & Approvals.</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between font-semibold">
                      <span>n8n Schedulers</span>
                      <span className="text-emerald-600 font-mono">15-Min Cron</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Webhooks Received</span>
                      <span className="text-indigo-600 font-mono">1,420 / day</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Approval Triggers</span>
                      <span className="text-purple-600 font-mono">Auto-Permit</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRunAgentTask(workflowAgent?.id || 'agent-workflow')}
                disabled={isEmergencyStopped}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                Execute n8n Pipelines
              </button>
            </div>

            {/* COLUMN 3: BROWSER AGENTS */}
            <div className="bg-white border-2 border-cyan-200 rounded-2xl p-5 space-y-4 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="bg-cyan-700 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center justify-between">
                  <span>BROWSER AGENTS</span>
                  <span className="text-[10px] font-mono text-cyan-200">Playwright</span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center space-x-2 text-cyan-900 font-bold">
                      <Globe className="w-4 h-4 text-cyan-600" />
                      <span>{browserAgent?.name || 'Driver-PlaywrightAgent'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Headless browser automation driving legacy supplier portals, tax form submissions, and admin panels.</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Supplier Portals</span>
                      <span className="text-cyan-700 font-mono">5 Legacy Sites</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Applications</span>
                      <span className="text-emerald-600 font-mono">Reseller Permits</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Admin Panels</span>
                      <span className="text-indigo-600 font-mono">Auto Login</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRunAgentTask(browserAgent?.id || 'agent-playwright')}
                disabled={isEmergencyStopped}
                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold py-2 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                Launch Playwright Driver
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-purple-400 my-1 animate-bounce" />
          </div>

          {/* LAYER 4: EVENT BUS / QUEUE */}
          <div className="bg-purple-900 text-white rounded-2xl p-6 shadow-md border border-purple-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800 pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-bold">EVENT BUS & QUEUE LAYER (Redis + BullMQ)</h3>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${isEmergencyStopped ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {isEmergencyStopped ? 'QUEUES PAUSED' : 'Throughput: 840 jobs/min'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-purple-950/80 p-3.5 rounded-xl border border-purple-800">
                <p className="text-purple-300 font-bold uppercase text-[10px]">Active BullMQ Jobs</p>
                <p className="text-xl font-bold text-white mt-1">{isEmergencyStopped ? 0 : 24}</p>
                <p className="text-[10px] text-purple-400 mt-0.5">High Priority Queue</p>
              </div>

              <div className="bg-purple-950/80 p-3.5 rounded-xl border border-purple-800">
                <p className="text-purple-300 font-bold uppercase text-[10px]">Redis Pub/Sub Events</p>
                <p className="text-xl font-bold text-white mt-1">{isEmergencyStopped ? 0 : 1840}</p>
                <p className="text-[10px] text-purple-400 mt-0.5">Supplier & Order Webhooks</p>
              </div>

              <div className="bg-purple-950/80 p-3.5 rounded-xl border border-purple-800">
                <p className="text-purple-300 font-bold uppercase text-[10px]">Failed Job Retries</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">0 Failures</p>
                <p className="text-[10px] text-purple-400 mt-0.5">Auto Dead-Letter Backoff</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-slate-400 my-1 animate-bounce" />
          </div>

          {/* LAYER 5: WORKER THREADS */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">WORKER THREAD POOL</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Node.js V8 Runtime</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-indigo-300">Node.js Workers</p>
                <p className="text-[11px] text-slate-300 mt-1">Express API proxying & CSV parsing threads.</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-purple-300">AI Workers</p>
                <p className="text-[11px] text-slate-300 mt-1">Gemini 3.6 Flash listing & blog generation routines.</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-cyan-300">Browser Workers</p>
                <p className="text-[11px] text-slate-300 mt-1">Playwright Chromium instances for supplier forms.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-indigo-400 my-1 animate-bounce" />
          </div>

          {/* LAYER 6: DATA PLATFORM */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">DATA PLATFORM & PERSISTENCE LAYER</h3>
              </div>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
                Multi-Store Database
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-slate-900">MySQL / Cloud SQL</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Products, Orders & Suppliers</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-slate-900">Redis Cache</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Session & Fast Stock Cache</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-slate-900">Object Storage</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Product Images & Documents</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-slate-900">Search / Vector</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Semantic Product Matching</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="font-bold text-slate-900">Analytics DB</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Profit & Margin Telemetry</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-emerald-400 my-1 animate-bounce" />
          </div>

          {/* LAYER 7: EXTERNAL BUSINESS */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm space-y-3 text-slate-900">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">EXTERNAL BUSINESS ENVIRONMENT CONNECTORS</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <p className="font-bold text-slate-900">Suppliers, Stores & Email</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Midwest Wholesale, Alpha Outdoor, Shopify GraphQL, SMTP B2B Email Inbox</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <p className="font-bold text-slate-900">Social, Ads & Analytics</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Facebook, Instagram, TikTok, YouTube Shorts, Google Analytics 4</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'queues' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Redis & BullMQ Active Queues Inspector</h3>
          <p className="text-xs text-slate-500">Live monitoring of worker thread allocations and message rates across AI Agent jobs.</p>

          <div className="space-y-3">
            {[
              { queue: 'supplier-form-queue', jobs: 4, worker: 'Node Worker #1', status: isEmergencyStopped ? 'Paused' : 'Active' },
              { queue: 'ai-listing-generation-queue', jobs: 12, worker: 'AI Gemini Worker #2', status: isEmergencyStopped ? 'Paused' : 'Active' },
              { queue: 'stock-sync-15min-cron', jobs: 8, worker: 'Node Worker #3', status: isEmergencyStopped ? 'Paused' : 'Active' },
              { queue: 'playwright-portal-login', jobs: 2, worker: 'Browser Chromium Worker #1', status: isEmergencyStopped ? 'Paused' : 'Active' }
            ].map((q, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-indigo-700">{q.queue}</p>
                  <p className="text-[11px] text-slate-500">Assigned Worker: {q.worker}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${q.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {q.status}
                  </span>
                  <p className="text-[11px] text-slate-600 font-mono mt-1">{q.jobs} Pending Jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Data Platform Storage Allocation</h3>
          <p className="text-xs text-slate-500">Overview of MySQL, Redis, Vector Search, and Object Storage capacity.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-slate-900">MySQL / Relational Database</p>
              <p className="text-slate-600">Stores 12,450 SKUs, 5 Suppliers, 480 B2B Emails, and 300+ Social Post logs.</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-2/5"></div>
              </div>
              <p className="text-[10px] text-slate-500">420 MB / 5 GB Allocated</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-slate-900">Redis In-Memory Key-Value</p>
              <p className="text-slate-600">Fast stock pricing cache and BullMQ queue message state engine.</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-1/4"></div>
              </div>
              <p className="text-[10px] text-slate-500">64 MB / 256 MB Allocated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
