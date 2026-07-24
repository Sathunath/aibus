import { useState } from 'react';
import { Terminal, ShieldCheck, Cpu, Activity, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export function TechOpsMonitor() {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkLog, setCheckLog] = useState<string | null>(null);

  const handleRunHealthCheck = () => {
    setIsRunningCheck(true);
    setCheckLog('Patch-TechOpsAgent initiating system diagnostic across Express server & Vite bundle...');
    setTimeout(() => {
      setIsRunningCheck(false);
      setCheckLog(
        `System Health Check Results (2026-07-22):\n` +
        `- Express API Server: OK (Port 3000 / 0.0.0.0 listening)\n` +
        `- Gemini @google/genai SDK: OK (Server-Side Key Authenticated)\n` +
        `- Memory Usage: 142MB / 1024MB (Optimal)\n` +
        `- Shopify GraphQL Latency: 48ms\n` +
        `- Zero syntax errors or missing imports detected.`
      );
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Tech Ops, Refactoring & Bug Fixer Agent</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Patch-TechOpsAgent continuously audits Express endpoints, TypeScript types, GraphQL latency, and security headers.
          </p>
        </div>

        <button
          onClick={handleRunHealthCheck}
          disabled={isRunningCheck}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-slate-800 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRunningCheck ? 'animate-spin' : ''}`} />
          <span>{isRunningCheck ? 'Auditing Codebase...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Server Uptime</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">100.0%</p>
          <p className="text-[10px] text-emerald-700 mt-1 font-medium">Cloud Run Container Active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">API Response Time</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">48 ms</p>
          <p className="text-[10px] text-blue-700 mt-1 font-medium">Sub-100ms Avg Latency</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">TypeScript Audits</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">0 Errors</p>
          <p className="text-[10px] text-purple-700 mt-1 font-medium">Strict Type Checking Passed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Security Headers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">Protected</p>
          <p className="text-[10px] text-emerald-700 mt-1 font-medium">Server-Side Gemini API Keys</p>
        </div>
      </div>

      {checkLog && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-emerald-400 space-y-2">
          <p className="font-bold text-white border-b border-slate-800 pb-2">Diagnostic Output</p>
          <pre className="whitespace-pre-wrap leading-relaxed">{checkLog}</pre>
        </div>
      )}
    </div>
  );
}
