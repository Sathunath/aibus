import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Database,
  RefreshCw,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  Server,
  Key,
  Globe,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Table,
  Check,
  X,
  Lock
} from 'lucide-react';
import { SheetDepartment, SheetTopic, MySQLConfig } from '../types';
import { useTableViewportFill, PlaceholderRows } from './ViewportTable';
import { initialSheetData } from '../data/sheetData';

interface GoogleSheetDepartmentHubProps {
  isEmergencyStopped: boolean;
  onToggleStopAllTasks: () => void;
}

export function GoogleSheetDepartmentHub({
  isEmergencyStopped,
  onToggleStopAllTasks,
}: GoogleSheetDepartmentHubProps) {
  const [sheetUrl, setSheetUrl] = useState<string>(
    'https://docs.google.com/spreadsheets/d/1RCZOYIMNUcsdM7pSupeMt4v_NhOccIohjzuXzNg4BIU/edit?usp=sharing'
  );
  const [departments, setDepartments] = useState<SheetDepartment[]>(initialSheetData);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [isFetchingSheet, setIsFetchingSheet] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('Just now');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // MySQL Credentials & Settings
  const [mysqlConfig, setMysqlConfig] = useState<MySQLConfig>({
    host: 'srv665.hstgr.io',
    user: 'u240981709_aibusiness',
    password: 'Wh8RY!+Zw4',
    database: 'u240981709_aibusiness',
    port: 3306,
  });
  const [isTestingMysql, setIsTestingMysql] = useState<boolean>(false);
  const [mysqlTestResult, setMysqlTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSyncingMysql, setIsSyncingMysql] = useState<boolean>(false);
  const [mysqlSyncLogs, setMysqlSyncLogs] = useState<string[]>([]);

  // Add New Topic State
  const [newTopicDeptId, setNewTopicDeptId] = useState<string>('ai-earning-ltd');
  const [newTopicText, setNewTopicText] = useState<string>('');
  const [newTopicDate, setNewTopicDate] = useState<string>('6/11');

  // Fetch Live Google Sheet Data
  const handleFetchSheetData = async () => {
    setIsFetchingSheet(true);
    setStatusMessage('Pulling live Google Sheet data...');
    try {
      const res = await fetch(`/api/google-sheet-data?url=${encodeURIComponent(sheetUrl)}`);
      const data = await res.json();
      if (data.success && data.departments) {
        setDepartments(data.departments);
        setLastFetchedAt(new Date().toLocaleTimeString());
        setStatusMessage('✅ Successfully extracted department data from Google Sheets!');
      } else {
        setStatusMessage(`⚠️ Warning: ${data.error || 'Loaded cached local spreadsheet structure.'}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Loaded active local spreadsheet data view.');
    } finally {
      setIsFetchingSheet(false);
    }
  };

  // Test MySQL Connection
  const handleTestMysqlConnection = async () => {
    setIsTestingMysql(true);
    setMysqlTestResult(null);
    try {
      const res = await fetch('/api/mysql-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mysqlConfig),
      });
      const data = await res.json();
      if (data.success) {
        setMysqlTestResult({ success: true, message: `Connected! Server time: ${data.serverTime}` });
      } else {
        setMysqlTestResult({
          success: false,
          message: `${data.error} (Tip: If connecting remotely, ensure Hostinger remote MySQL host IP/domain is set in Host field).`,
        });
      }
    } catch (err: any) {
      setMysqlTestResult({ success: false, message: `Connection attempt error: ${err.message}` });
    } finally {
      setIsTestingMysql(false);
    }
  };

  // Sync Data to MySQL Database
  const handleSyncToMysql = async () => {
    setIsSyncingMysql(true);
    setMysqlSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Initiating MySQL database sync for ${departments.length} departments...`,
      ...prev,
    ]);

    try {
      const res = await fetch('/api/mysql-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mysqlConfig, departments }),
      });
      const data = await res.json();

      if (data.success) {
        setMysqlSyncLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ✅ ${data.message}`,
          ...prev,
        ]);
        setStatusMessage(`Database updated: ${data.message}`);
      } else {
        setMysqlSyncLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ❌ Failed to sync: ${data.error}`,
          ...prev,
        ]);
        setStatusMessage(`Sync error: ${data.error}`);
      }
    } catch (err: any) {
      setMysqlSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ❌ Network error during sync: ${err.message}`,
        ...prev,
      ]);
    } finally {
      setIsSyncingMysql(false);
    }
  };

  // Add New Topic Manual Entry
  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim()) return;

    const newTopicObj: SheetTopic = {
      id: `${newTopicDeptId}-task-${Date.now()}`,
      topic: newTopicText.trim(),
      scheduledDate: newTopicDate.trim() || '6/12',
      isCompleted: false,
      status: 'Pending',
    };

    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === newTopicDeptId) {
          return { ...dept, topics: [...dept.topics, newTopicObj] };
        }
        return dept;
      })
    );

    setNewTopicText('');
    setStatusMessage(`✅ Added new topic to ${newTopicDeptId}`);
  };

  // Toggle Topic Status
  const handleToggleTopicStatus = (deptId: string, topicId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            topics: dept.topics.map((t) => {
              if (t.id === topicId) {
                const nextCompleted = !t.isCompleted;
                return {
                  ...t,
                  isCompleted: nextCompleted,
                  status: nextCompleted ? 'Completed' : 'Pending',
                };
              }
              return t;
            }),
          };
        }
        return dept;
      })
    );
  };

  const selectedDepartments =
    selectedDeptId === 'all'
      ? departments
      : departments.filter((d) => d.id === selectedDeptId);

  const totalTopicsCount = departments.reduce((acc, d) => acc + d.topics.length, 0);
  const completedTopicsCount = departments.reduce(
    (acc, d) => acc + d.topics.filter((t) => t.isCompleted).length,
    0
  );

  return (
    <div className="space-y-3">
      {/* Emergency Lock Notice (Compact 28px Bar) */}
      <div
        className={`rounded-xl px-3 h-[28px] border transition flex items-center justify-between gap-2 text-xs ${
          isEmergencyStopped
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
        }`}
      >
        <div className="flex items-center space-x-2 truncate">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px] font-extrabold uppercase tracking-tight truncate">
            {isEmergencyStopped ? '⏸ AGENT EXECUTION PAUSED' : '▶ AGENT EXECUTION ACTIVE'}
          </span>
          <span className="hidden sm:inline text-[10px] opacity-80 truncate">
            {isEmergencyStopped ? 'Autonomous background cycles held.' : 'AI background workers running.'}
          </span>
        </div>

        <button
          onClick={onToggleStopAllTasks}
          className={`h-[22px] px-2 rounded-md text-[10px] font-extrabold transition shadow-2xs cursor-pointer flex items-center space-x-1 shrink-0 ${
            isEmergencyStopped
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <span>{isEmergencyStopped ? 'Resume Agents' : 'Pause Agents'}</span>
        </button>
      </div>

      {/* Header Banner (Single 30px Bar) */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Department Data Hub & Remote MySQL Sync
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Google Sheets & Hostinger MySQL Database (<code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">u240981709_aibusiness</code> @ <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">srv665.hstgr.io</code>)
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleFetchSheetData}
            disabled={isFetchingSheet}
            className="h-[26px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSheet ? 'animate-spin' : ''}`} />
            <span>{isFetchingSheet ? 'Syncing...' : 'Pull Google Sheet'}</span>
          </button>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{departments.length}</span> DEPARTMENTS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{totalTopicsCount}</span> TOTAL TOPICS
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mr-1" />
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{completedTopicsCount}</span> COMPLETED TOPICS
        </div>

        {lastFetchedAt && (
          <div className="h-[28px] px-2.5 bg-slate-50 border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <span>PULLED AT {lastFetchedAt}</span>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="bg-emerald-900 border border-emerald-700 text-emerald-100 text-[11px] px-3 py-1.5 rounded-lg flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-300 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Department Workspace & Remote MySQL Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Department Data Viewer & Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Filter Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Department-Wise Organization</h3>
              <span className="text-xs text-slate-500 font-medium">Select a department to filter</span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedDeptId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedDeptId === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Departments ({departments.length})
              </button>

              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedDeptId === dept.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept.name} ({dept.topics.length})
                </button>
              ))}
            </div>
          </div>

          {/* Department Cards List */}
          <div className="space-y-4">
            {selectedDepartments.map((dept) => (
              <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{dept.name}</h4>
                      <p className="text-xs text-slate-500">
                        Channel Name: <span className="font-semibold text-slate-700">{dept.channel}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {dept.topics.filter((t) => t.isCompleted).length} / {dept.topics.length} Completed
                  </span>
                </div>

                {/* Topics Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3">Topic / Task Title</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dept.topics.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs">
                            {t.topic}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{t.scheduledDate}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                t.isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {t.isCompleted ? (
                                <>
                                  <Check className="w-3 h-3 mr-0.5" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-0.5" />
                                  <span>Pending</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleToggleTopicStatus(dept.id, t.id)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-600 underline cursor-pointer"
                            >
                              {t.isCompleted ? 'Mark Pending' : 'Mark Done'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Data Form (No Hardcoded Data Entry) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Add New Department Data Row</h3>
              </div>
              <span className="text-xs text-slate-400">One-by-one Data Entry</span>
            </div>

            <form onSubmit={handleAddTopicSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Department</label>
                <select
                  value={newTopicDeptId}
                  onChange={(e) => setNewTopicDeptId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.channel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Date</label>
                <input
                  type="text"
                  value={newTopicDate}
                  onChange={(e) => setNewTopicDate(e.target.value)}
                  placeholder="e.g. 6/11"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">Topic / Content Description</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTopicText}
                    onChange={(e) => setNewTopicText(e.target.value)}
                    placeholder="Type topic details (e.g. 'Sonali Insurance Policy Benefits Explanation Video')..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!newTopicText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    Add Row
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Remote MySQL Connection & Sync Manager */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold tracking-tight">Remote MySQL Configuration</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Hostinger DB
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Credentials provided for remote database synchronization:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1 font-sans font-bold">
                  Host / Server IP Address
                </label>
                <input
                  type="text"
                  value={mysqlConfig.host}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, host: e.target.value })}
                  placeholder="e.g. 185.185.185.1 or srv123.main-hosting.eu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">
                  Enter Hostinger server IP / domain for remote connection.
                </span>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1 font-sans font-bold">
                  Database Name
                </label>
                <input
                  type="text"
                  value={mysqlConfig.database}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, database: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1 font-sans font-bold">
                  MySQL User
                </label>
                <input
                  type="text"
                  value={mysqlConfig.user}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, user: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1 font-sans font-bold">
                  MySQL Password
                </label>
                <input
                  type="password"
                  value={mysqlConfig.password}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Connection Test Controls */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleTestMysqlConnection}
                disabled={isTestingMysql}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>{isTestingMysql ? 'Testing MySQL...' : 'Test Connection'}</span>
              </button>

              {mysqlTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono border ${
                    mysqlTestResult.success
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-red-950 text-red-300 border-red-800'
                  }`}
                >
                  {mysqlTestResult.message}
                </div>
              )}

              <button
                onClick={handleSyncToMysql}
                disabled={isSyncingMysql}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-3 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>{isSyncingMysql ? 'Syncing Tables...' : 'Sync Sheet Data to MySQL'}</span>
              </button>
            </div>
          </div>

          {/* Sync Logs Console */}
          <div className="bg-slate-950 text-slate-300 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Database Sync Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h4>

            <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] h-44 overflow-y-auto space-y-1.5 border border-slate-800/80">
              {mysqlSyncLogs.length === 0 ? (
                <p className="text-slate-600 italic">Ready to sync department data into MySQL tables...</p>
              ) : (
                mysqlSyncLogs.map((log, idx) => (
                  <p key={idx} className="leading-tight">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
