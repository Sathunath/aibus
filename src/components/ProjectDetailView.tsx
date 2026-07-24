import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Share2,
  Database,
  Send,
  Building2,
  ExternalLink,
  Bot,
  Video,
  Layers,
  Check
} from 'lucide-react';
import { SheetDepartment, SheetTopic, AIAgent, SocialPost, Brand } from '../types';

interface ProjectDetailViewProps {
  projectId: string; // e.g. 'ai-earning-ltd' | 'sonali-insurance' | 'product-review' | 'drpshop' | 'job-news'
  departments: SheetDepartment[];
  agents: AIAgent[];
  brands: Brand[];
  posts: SocialPost[];
  onToggleTopicStatus: (deptId: string, topicId: string) => void;
  onRefreshSheetData: () => void;
}

export function ProjectDetailView({
  projectId,
  departments,
  agents,
  brands,
  posts,
  onToggleTopicStatus,
  onRefreshSheetData,
}: ProjectDetailViewProps) {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  // Map project ID to sheet department
  const currentDept = departments.find((d) => d.id === projectId) || departments[0];
  const projectBrand = brands.find((b) => b.id === projectId) || brands[0];
  const projectPosts = posts.filter((p) => p.brandId === projectId);
  const assignedAgents = agents.filter((a) => a.department === 'sheets_db' || a.department === 'social');

  // Generate Custom Script for this Project
  const handleGenerateProjectScript = async () => {
    setIsGenerating(true);
    setGeneratedScript(null);
    try {
      const res = await fetch('/api/ai/social-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: currentDept?.name || 'Project',
          brandNiche: currentDept?.channel || 'eCommerce',
          platform: 'facebook',
          productContext: topicPrompt || 'Target Topic from Sheet',
          contentType: 'Video Script & Social Post',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedScript(`📌 TITLE: ${data.title}\n\n📝 CAPTION:\n${data.caption}\n\n🎬 VIDEO SCRIPT:\n${data.script}\n\n🏷️ HASHTAGS:\n${data.hashtags?.join(' ')}`);
      } else {
        setGeneratedScript('Draft generated locally.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedScript('Generated topic draft script for ' + currentDept.name);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentDept) {
    return <div className="p-8 text-center text-slate-500">Project data loading...</div>;
  }

  const completedCount = currentDept.topics.filter((t) => t.isCompleted).length;
  const totalCount = currentDept.topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Single 30px Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="text-sm shrink-0">{projectBrand?.logo || '📁'}</span>
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            {currentDept.name} Workspace
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Channel: {currentDept.channel} • Render topics, scheduled content dates & assigned AI agents
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={onRefreshSheetData}
            className="h-[26px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pull Google Sheet</span>
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1RCZOYIMNUcsdM7pSupeMt4v_NhOccIohjzuXzNg4BIU/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="h-[22px] px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-md transition flex items-center space-x-1"
          >
            <span>Sheet Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{totalCount}</span> TOTAL TOPICS
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{completedCount}</span> COMPLETED ({progressPercent}%)
        </div>

        <div className="h-[28px] px-2.5 bg-pink-50 border border-pink-200 rounded-md inline-flex items-center text-[10px] font-bold text-pink-800 shadow-2xs whitespace-nowrap">
          <Share2 className="w-3.5 h-3.5 text-pink-600 mr-1" />
          <span className="text-pink-900 font-extrabold text-xs mr-1.5">{projectBrand?.accounts?.length || 3}</span> SOCIAL ACCOUNTS
        </div>

        <div className="h-[28px] px-2.5 bg-blue-50 border border-blue-200 rounded-md inline-flex items-center text-[10px] font-bold text-blue-800 shadow-2xs whitespace-nowrap">
          <Database className="w-3.5 h-3.5 text-blue-600 mr-1" />
          <span>MYSQL READY</span>
        </div>
      </div>

      {/* Main Grid: Topics Table & Script AI Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Google Sheet Topics Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Google Sheet Topics & Schedule for {currentDept.name}
              </h3>
              <p className="text-xs text-slate-500">Live topics extracted from column data in Google Sheets</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Channel: {currentDept.channel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Topic / Task Title</th>
                  <th className="py-2.5 px-3">Scheduled Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Toggle Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentDept.topics.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-sm leading-relaxed">
                      {t.topic}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">{t.scheduledDate}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.isCompleted ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onToggleTopicStatus(currentDept.id, t.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
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

        {/* Right Col: AI Content Generator & Project Agents */}
        <div className="space-y-6">
          {/* AI Script Generator */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                AI Script & Post Studio for {currentDept.name}
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Custom Topic Context
              </label>
              <textarea
                rows={3}
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder={`e.g. Write a viral Facebook/YouTube script for ${currentDept.name}...`}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateProjectScript}
              disabled={isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Video className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Generating Script...' : 'Generate Video Script & Post'}</span>
            </button>

            {generatedScript && (
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-800 font-mono text-[11px] whitespace-pre-wrap max-h-60 overflow-y-auto">
                {generatedScript}
              </div>
            )}
          </div>

          {/* Social Channels for this Project */}
          {projectBrand && projectBrand.accounts && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Connected Social Media Accounts
              </h3>
              <div className="space-y-2">
                {projectBrand.accounts.map((acc) => (
                  <div key={acc.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <img src={acc.avatarUrl} alt={acc.handle} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900">{acc.handle}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{acc.platform} • {(acc.followers / 1000).toFixed(1)}k Followers</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
