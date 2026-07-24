import { useState } from 'react';
import { Workflow, Play, CheckCircle, AlertTriangle, Clock, Terminal, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { N8nWorkflow } from '../types';

interface WorkflowAutomationEngineProps {
  workflows: N8nWorkflow[];
  onTriggerWorkflow: (id: string) => void;
}

export function WorkflowAutomationEngine({ workflows, onTriggerWorkflow }: WorkflowAutomationEngineProps) {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const handleRunClick = (wf: N8nWorkflow) => {
    setRunningId(wf.id);
    setExecutionLog(`[n8n Workflow Execution Triggered]: ${wf.name}\n- Step 1: Initializing Playwright Headless Browser...\n- Step 2: Navigating to B2B Supplier Login Portal...\n- Step 3: Executing credential injection & MFA handshake...\n- Step 4: Extracting inventory CSV & updating store database...`);
    setTimeout(() => {
      onTriggerWorkflow(wf.id);
      setRunningId(null);
      setExecutionLog((prev) => prev + `\n- SUCCESS: Workflow finished cleanly in ${wf.avgDurationSec}s with 0 errors!`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">n8n Workflow Engine & Playwright Browser Driver</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Nexus-n8nAgent executes scheduled visual node workflows, webhooks, and headless Playwright browser scripts for legacy supplier login portals.
          </p>
        </div>

        <div className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>n8n Engine: 100% Uptime</span>
        </div>
      </div>

      {/* Workflows Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {wf.triggerType}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">{wf.successRate}% Success</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{wf.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{wf.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{wf.nodeCount} Visual Nodes</span>
                <span>Avg: {wf.avgDurationSec}s</span>
              </div>

              <button
                onClick={() => handleRunClick(wf)}
                disabled={runningId === wf.id}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${runningId === wf.id ? 'animate-spin' : ''}`} />
                <span>{runningId === wf.id ? 'Running Playwright...' : 'Execute Workflow Now'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Terminal Console */}
      {executionLog && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Live Execution Terminal</span>
            </div>
            <button onClick={() => setExecutionLog(null)} className="text-slate-400 hover:text-white cursor-pointer">Clear</button>
          </div>

          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{executionLog}</pre>
        </div>
      )}
    </div>
  );
}
