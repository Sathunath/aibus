import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Layers,
  ChevronDown,
  Check,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Workspace } from './commandCenterTypes';

interface GlobalWorkspaceSwitcherProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onOpenAddModal: () => void;
  onResetSeedData: () => void;
}

export function GlobalWorkspaceSwitcher({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
  onOpenAddModal,
  onResetSeedData
}: GlobalWorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2 mb-3 shadow-sm">
      {/* Active Workspace Selector Dropdown & Quick Tabs */}
      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold uppercase tracking-wider text-[10px] pr-2 border-r border-slate-800">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Context:</span>
        </div>

        {/* Workspace Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition font-medium text-xs cursor-pointer"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: selectedWorkspace ? selectedWorkspace.color : '#6366f1' }}
            />
            <span className="font-semibold max-w-[200px] truncate">
              {selectedWorkspaceId === 'all'
                ? 'All Workspaces & Businesses'
                : selectedWorkspace?.name || 'Select Workspace'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 divide-y divide-slate-800">
              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectWorkspace('all');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                    selectedWorkspaceId === 'all'
                      ? 'bg-indigo-950/80 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>All Workspaces & Businesses</span>
                  </div>
                  {selectedWorkspaceId === 'all' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              </div>

              <div className="py-1 max-h-64 overflow-y-auto space-y-0.5">
                <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                  Businesses & Brands ({workspaces.length})
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                      selectedWorkspaceId === ws.id
                        ? 'bg-indigo-950/80 text-indigo-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: ws.color }}
                      />
                      <span className="truncate">{ws.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full shrink-0 font-medium">
                      {ws.type}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1.5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAddModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-xs text-indigo-400 hover:bg-indigo-950/50 font-semibold cursor-pointer transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[10px] shadow transition"
        >
          <Plus className="w-3 h-3" />
          <span>New Workspace</span>
        </button>
        <button
          onClick={onResetSeedData}
          title="Reset Seed Data"
          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded transition"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
