import { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Zap, RefreshCw, Layers, OctagonX, Play, Menu, X, Search, Sparkles } from 'lucide-react';
import { Brand } from '../types';

interface HeaderProps {
  brands: Brand[];
  activeBrandId: string;
  setActiveBrandId: (id: string) => void;
  activeAgentsCount: number;
  totalAgentsCount: number;
  onTriggerAllAgents: () => void;
  isEmergencyStopped?: boolean;
  onToggleStopAllTasks?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onOpenSearch?: () => void;
}

export function Header({
  brands,
  activeBrandId,
  setActiveBrandId,
  activeAgentsCount,
  totalAgentsCount,
  onTriggerAllAgents,
  isEmergencyStopped = false,
  onToggleStopAllTasks,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  onOpenSearch,
}: HeaderProps) {
  const [time, setTime] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' EST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncClick = () => {
    if (isEmergencyStopped) return;
    setIsSyncing(true);
    onTriggerAllAgents();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <header id="header-bar" className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      <div className="w-full px-2 py-1 flex items-center justify-between gap-2 min-h-[30px]">
        {/* Left: Brand Identity & Status */}
        <div className="flex items-center space-x-2 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer mr-0.5 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-indigo-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          )}

          <div className="bg-indigo-600 text-white p-1 rounded-lg shadow-2xs flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-none">
                IDSOFT
              </h1>
              <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.2 rounded-full flex items-center gap-1 shrink-0 ${
                isEmergencyStopped
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isEmergencyStopped ? 'bg-red-600' : 'bg-emerald-500 animate-ping'}`}></span>
                {isEmergencyStopped ? 'HALTED' : 'v5.0 Enterprise'}
              </span>
            </div>
            <p className="text-[8px] text-indigo-700 font-extrabold tracking-wide uppercase leading-tight">AI BUSINESS MANAGER</p>
          </div>
        </div>

        {/* Center: Universal Database & Menu Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full h-[28px] sm:h-[30px] px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 rounded-md flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-medium transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
              <span className="truncate text-slate-600 font-normal">
                Search any menu panel, supplier, credential, email, SKU...
              </span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-[9px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors hidden sm:inline">
                ⌘K / Ctrl+K
              </span>
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-0.5 group-hover:bg-indigo-700 transition-colors">
                <Search className="w-3 h-3" />
                <span className="hidden md:inline">Search DB</span>
              </span>
            </div>
          </button>
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleSyncClick}
            disabled={isEmergencyStopped || isSyncing}
            className={`h-[28px] px-2 rounded-md border text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
              isSyncing
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Sync all agents and database"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden lg:inline">{isSyncing ? 'Syncing...' : 'Sync All'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

