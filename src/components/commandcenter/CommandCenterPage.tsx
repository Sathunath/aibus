import React from 'react';
import { LayoutDashboard, Sparkles, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface CommandCenterPageProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export function CommandCenterPage({ activeSubTab, onSubTabChange }: CommandCenterPageProps = {}) {
  return (
    <div className="w-full p-1 sm:p-2 font-sans">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Overall Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Clean Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Central Master Control Panel & Clean Unified Dashboard View
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-2 border border-slate-200 dark:border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>System Status: <strong className="text-emerald-600 dark:text-emerald-400">100% Operational</strong></span>
          </div>
        </div>
      </div>

      {/* Main Clean Workspace Card */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 mb-5 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Overall Dashboard Workspace Initialized
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            All submenus and old clutter have been removed. This workspace is clean, modern, and ready for your future module configurations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2 text-left">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Submenus</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Cleaned & Simplified</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold">Dashboard Slate</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Clutter-Free Canvas</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-semibold">Engine</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Ready for Next Instructions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

