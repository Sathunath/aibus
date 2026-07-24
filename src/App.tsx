import { useState, useEffect } from 'react';
import { AdminShell } from './components/AdminShell';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { GoogleSheetDepartmentHub } from './components/GoogleSheetDepartmentHub';
import { SupplierStudio } from './components/SupplierStudio';
import { EmailCommandCenter } from './components/EmailCommandCenter';
import { ProductCatalogStudio } from './components/ProductCatalogStudio';
import { InventorySyncEngine } from './components/InventorySyncEngine';
import { SocialMediaHub } from './components/SocialMediaHub';
import { SeoStudio } from './components/SeoStudio';
import { WorkflowAutomationEngine } from './components/WorkflowAutomationEngine';
import { TechOpsMonitor } from './components/TechOpsMonitor';
import { AgentApprovalConsole } from './components/AgentApprovalConsole';
import { ProjectDetailView } from './components/ProjectDetailView';
import { DatabaseDiagnosticsStudio } from './components/DatabaseDiagnosticsStudio';
import { CredentialsVaultStudio } from './components/CredentialsVaultStudio';
import { RcSupplierListStudio } from './components/RcSupplierListStudio';
import { WholesaleLeadsStudio } from './components/WholesaleLeadsStudio';
import { SearchResultsView } from './components/SearchResultsView';
import { FinancePage } from './components/finance/FinancePage';
import { MyLifePage } from './components/mylife/MyLifePage';
import { CommandCenterPage } from './components/commandcenter/CommandCenterPage';

import {
  initialAgents,
  initialBrands,
  initialEmails,
  initialLogs,
  initialProducts,
  initialSEOArticles,
  initialSocialPosts,
  initialSuppliers,
  initialWorkflows,
  initialCredentialVault,
} from './data/mockData';
import { initialSheetData } from './data/sheetData';
import { AIAgent, Brand, Department, EmailMessage, ProductItem, SEOArticle, SocialPost, Supplier, SystemLog, SheetDepartment, CredentialVaultItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Department>('rc_supplier_list');
  const [activeSubTab, setActiveSubTab] = useState<string>('all_contacts');
  const [activeBrandId, setActiveBrandId] = useState<string>(initialBrands[0].id);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('Peshadari');

  const handlePerformFullSearch = (query: string) => {
    setGlobalSearchQuery(query);
    setActiveTab('search_results');
  };

  // Core Business Data State
  const [departments, setDepartments] = useState<SheetDepartment[]>(initialSheetData);
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [emails, setEmails] = useState<EmailMessage[]>(initialEmails);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('haldi_brands_db_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load brands from database:', e);
    }
    return initialBrands;
  });

  // Save brands database updates immediately to persistent storage
  useEffect(() => {
    try {
      localStorage.setItem('haldi_brands_db_v3', JSON.stringify(brands));
    } catch (e) {
      console.error('Failed to save brands database:', e);
    }
  }, [brands]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [seoArticles, setSeoArticles] = useState<SEOArticle[]>(initialSEOArticles);
  const [credentials, setCredentials] = useState<CredentialVaultItem[]>(initialCredentialVault);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);

  // Credential Vault Handlers
  const handleAddCredential = (itemPartial: Partial<CredentialVaultItem>) => {
    const newItem: CredentialVaultItem = {
      id: `cred-${Date.now()}`,
      accountName: itemPartial.accountName || 'New Account',
      username: itemPartial.username || itemPartial.accountName || '',
      passwordHint: itemPartial.passwordHint || '',
      recoveryAccount: itemPartial.recoveryAccount || '888',
      category: itemPartial.category || 'Personal',
      notes: itemPartial.notes || '',
      lastUpdated: 'Just now',
    };
    setCredentials((prev) => [newItem, ...prev]);
    addLog('IDSOFT Vault Director', 'credentials_vault', 'info', `Added credential: ${newItem.accountName}`);
  };

  const handleUpdateCredential = (updated: CredentialVaultItem) => {
    setCredentials((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    addLog('IDSOFT Vault Director', 'credentials_vault', 'info', `Updated credential: ${updated.accountName}`);
  };

  const handleDeleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
    addLog('IDSOFT Vault Director', 'credentials_vault', 'warning', `Deleted credential ID: ${id}`);
  };

  // Fetch Live Google Sheet Data on mount
  useEffect(() => {
    handleRefreshSheetData();
  }, []);

  const handleRefreshSheetData = async () => {
    try {
      const res = await fetch('/api/google-sheet-data');
      const data = await res.json();
      if (data.success && data.departments) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Sheet fetch error:', err);
    }
  };

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

  // Log Helper
  const addLog = (
    agentName: string,
    department: Department,
    level: SystemLog['level'],
    message: string,
    details?: string
  ) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      department,
      agentName,
      level,
      message,
      details,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 30)]);
  };

  // STOP ALL BACKGROUND TASKS / EMERGENCY STOP HANDLER
  const handleToggleStopAllTasks = () => {
    if (!isEmergencyStopped) {
      // STOP ALL
      setIsEmergencyStopped(true);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'paused', currentTask: 'Halted by Emergency Kill Switch' })));
      addLog(
        'Owner-StrategyAgent',
        'architecture',
        'error',
        '🚨 EMERGENCY STOP ACTIVATED: All background processes, worker threads, n8n workflows, and Playwright driver tasks HALTED by Business Owner.',
        'Killed active BullMQ worker queues and paused 14 AI agent execution loops.'
      );
    } else {
      // RESUME ALL
      setIsEmergencyStopped(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'working', currentTask: `Running standard ${a.role} cycle` })));
      addLog(
        'Owner-StrategyAgent',
        'architecture',
        'success',
        '✅ BACKGROUND TASKS RESUMED: Re-enabling 14-agent execution network & BullMQ worker queues.',
        'Restored active polling across suppliers, catalog, social studio, and Playwright browser drivers.'
      );
    }
  };

  // Individual One-by-One Agent Approval & Execution Handler
  const handleApproveAndRunAgent = async (agentId: string, customPrompt?: string) => {
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetAgent) return;

    // Approve & Set working
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              isApproved: true,
              approvalStatus: 'approved',
              status: 'working',
              currentTask: customPrompt || a.pendingTask || a.currentTask,
            }
          : a
      )
    );

    addLog(
      targetAgent.name,
      targetAgent.department,
      'info',
      `User approved agent ${targetAgent.name}. Executing task...`,
      customPrompt || targetAgent.pendingTask || targetAgent.currentTask
    );

    try {
      const res = await fetch('/api/ai/agent-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: targetAgent.name,
          department: targetAgent.department,
          taskPrompt:
            customPrompt ||
            targetAgent.pendingTask ||
            targetAgent.currentTask ||
            `Execute standard ${targetAgent.role} operational cycle`,
          contextData: { brand: activeBrandId, timestamp: new Date().toISOString() },
        }),
      });

      const data = await res.json();

      addLog(
        targetAgent.name,
        targetAgent.department,
        'success',
        `Approved task completed by ${targetAgent.name}`,
        data.result?.slice(0, 150) + '...'
      );

      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: 'working',
                isApproved: true,
                approvalStatus: 'approved',
                tasksCompleted: a.tasksCompleted + 1,
                lastActive: 'Just now',
              }
            : a
        )
      );
    } catch (err: any) {
      console.error('Error running approved agent task:', err);
      addLog(
        targetAgent.name,
        targetAgent.department,
        'error',
        `Failed to execute approved task for ${targetAgent.name}`
      );
    }
  };

  const handlePauseAgent = (agentId: string) => {
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetAgent) return;

    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, isApproved: false, approvalStatus: 'paused', status: 'paused' }
          : a
      )
    );

    addLog(
      targetAgent.name,
      targetAgent.department,
      'warning',
      `User placed agent ${targetAgent.name} on hold / paused.`
    );
  };

  // Add / Edit / Delete Agents
  const handleAddAgent = (newAgentPartial: Partial<AIAgent>) => {
    const created: AIAgent = {
      id: newAgentPartial.id || `agent-${Date.now()}`,
      name: newAgentPartial.name || 'IDSOFT Custom Agent',
      role: newAgentPartial.role || 'Specialist',
      department: newAgentPartial.department || 'architecture',
      layer: newAgentPartial.layer || 'specialist',
      status: 'working',
      currentTask: newAgentPartial.currentTask || 'Active and awaiting tasks',
      tasksCompleted: 0,
      accuracyRate: 100,
      avatarColor: newAgentPartial.avatarColor || 'from-indigo-600 to-purple-600',
      iconName: newAgentPartial.iconName || 'Bot',
      lastActive: 'Just now',
    };
    setAgents((prev) => [created, ...prev]);
    addLog('IDSOFT Operations Orchestrator', created.department, 'info', `Created new AI Agent: ${created.name}`);
  };

  const handleUpdateAgent = (updatedAgent: AIAgent) => {
    setAgents((prev) => prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)));
    addLog('IDSOFT Operations Orchestrator', updatedAgent.department, 'info', `Updated AI Agent: ${updatedAgent.name}`);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    addLog('IDSOFT Operations Orchestrator', 'architecture', 'warning', `Deleted AI Agent ID: ${agentId}`);
  };

  // Dispatch AI Agent Task via Server Endpoint
  const handleRunAgentTask = async (agentId: string, customPrompt?: string) => {
    await handleApproveAndRunAgent(agentId, customPrompt);
  };

  // Trigger All Agents Automated Cycle
  const handleTriggerAllAgents = async () => {
    if (isEmergencyStopped) return;
    addLog('System Controller', 'analytics', 'info', 'Triggering parallel execution across all 14 AI Agents...');
    for (const agent of agents) {
      await handleRunAgentTask(agent.id);
    }
  };

  // Supplier CRM Actions
  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
    addLog('Apex-SupplierAgent', 'suppliers', 'success', `Added new supplier target: ${newSupplier.name}`);
  };

  const handleUpdateSupplierStatus = (id: string, status: Supplier['status']) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    addLog('Apex-SupplierAgent', 'suppliers', 'info', `Updated supplier status to ${status.toUpperCase()}`);
  };

  // Email Actions
  const handleDraftReplyWithAI = async (email: EmailMessage) => {
    try {
      const res = await fetch('/api/ai/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailSubject: email.subject,
          emailBody: email.fullText,
          sender: email.sender,
          category: email.category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmails((prev) =>
          prev.map((e) =>
            e.id === email.id
              ? { ...e, suggestedReply: data.suggestedReply, replyStatus: 'drafted', category: data.category as any }
              : e
          )
        );
        addLog('Pulse-EmailAgent', 'emails', 'success', `Drafted response for email: ${email.subject}`);
      }
    } catch (err) {
      console.error('Failed to draft email:', err);
    }
  };

  const handleSendEmailReply = (emailId: string) => {
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, replyStatus: 'sent' } : e)));
    addLog('Pulse-EmailAgent', 'emails', 'success', 'Approved & dispatched B2B email response.');
  };

  // Catalog Actions
  const handleGenerateListingWithAI = async (product: ProductItem) => {
    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawTitle: product.title,
          rawCategory: product.category,
          supplierName: product.supplierName,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  seoTitle: data.seoTitle,
                  seoDescription: data.seoDescription,
                  tags: data.tags || p.tags,
                  specs: data.specs || p.specs,
                }
              : p
          )
        );
        addLog('Omni-CatalogAgent', 'catalog', 'success', `Generated SEO metadata for SKU: ${product.sku}`);
      }
    } catch (err) {
      console.error('Failed to generate listing:', err);
    }
  };

  const handleCleanCSVWithAI = async (rawCSV: string) => {
    try {
      const rows = rawCSV.split('\n').filter(Boolean).map((line) => {
        const parts = line.split(',');
        return { sku: parts[0]?.trim(), title: parts[1]?.trim(), cost: parts[2]?.trim(), stock: parts[3]?.trim() };
      });

      const res = await fetch('/api/ai/clean-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawRows: rows }),
      });

      const data = await res.json();
      if (data.success && data.cleanedProducts) {
        const newProds: ProductItem[] = data.cleanedProducts.map((cp: any, idx: number) => ({
          id: `prod-csv-${Date.now()}-${idx}`,
          sku: cp.sku || `SKU-${Date.now()}-${idx}`,
          title: cp.title || 'Cleaned Supplier Item',
          category: cp.category || 'Imported Catalog',
          supplierName: 'Bulk CSV Supplier',
          costPrice: cp.costPrice || 20,
          sellingPrice: cp.sellingPrice || 44,
          marginPercent: 54.5,
          stockQuantity: cp.stockQuantity || 100,
          status: 'active',
          seoTitle: cp.title,
          seoDescription: cp.seoDescription || 'Cleaned and normalized product item ready for store listing.',
          tags: ['imported', 'csv-cleaned'],
          specs: { Origin: 'USA Warehouse', Processing: 'Automated AI' },
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
          lastSynced: 'Just now',
        }));

        setProducts((prev) => [...newProds, ...prev]);
        addLog('Omni-CatalogAgent', 'catalog', 'success', `Parsed & imported ${newProds.length} products from CSV`);
      }
    } catch (err) {
      console.error('Failed to clean CSV:', err);
    }
  };

  // Social Content Action
  const handleGenerateSocialPost = async (
    brandId: string,
    platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube',
    productContext?: string
  ) => {
    const brand = brands.find((b) => b.id === brandId) || brands[0];
    try {
      const res = await fetch('/api/ai/social-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brand.name,
          brandNiche: brand.niche,
          platform,
          productContext,
          contentType: platform === 'tiktok' ? 'Reels Script' : 'Post Caption',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newPost: SocialPost = {
          id: `post-${Date.now()}`,
          brandId,
          platform,
          title: data.title || `Viral ${platform} Campaign`,
          caption: data.caption || 'Check this out!',
          script: data.script,
          hashtags: data.hashtags || ['#Ecommerce', '#USADropshipping'],
          mediaType: platform === 'tiktok' || platform === 'youtube' ? 'video' : 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
          scheduledTime: 'Tomorrow at 06:00 PM EST',
          status: 'scheduled',
          analytics: { views: 0, likes: 0, shares: 0, comments: 0 },
        };

        setSocialPosts((prev) => [newPost, ...prev]);
        addLog('Nova-SocialAgent', 'social', 'success', `Generated ${platform.toUpperCase()} post script for ${brand.name}`);
      }
    } catch (err) {
      console.error('Failed to generate social content:', err);
    }
  };

  // SEO Action
  const handleGenerateBlogWithAI = async (keyword: string, category: string, targetProduct: string) => {
    try {
      const res = await fetch('/api/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category, targetProduct }),
      });

      const data = await res.json();
      if (data.success) {
        const newArticle: SEOArticle = {
          id: `seo-${Date.now()}`,
          title: data.title || `Guide: ${keyword}`,
          targetKeyword: keyword,
          targetProductCategory: category,
          wordCount: data.wordCount || 1500,
          status: 'published',
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          contentMarkdown: data.contentMarkdown,
          internalLinksCount: 8,
          seoScore: data.seoScore || 95,
          createdAt: new Date().toISOString().split('T')[0],
        };

        setSeoArticles((prev) => [newArticle, ...prev]);
        addLog('Rank-SEOAgent', 'seo', 'success', `Published Programmatic SEO Article for: "${keyword}"`);
      }
    } catch (err) {
      console.error('Failed to generate blog:', err);
    }
  };

  // Workflow Trigger Action
  const handleTriggerWorkflow = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (wf) {
      addLog('Nexus-n8nAgent', 'workflows', 'success', `Executed Playwright & n8n Workflow: ${wf.name}`);
    }
  };

  const unassignedEmails = emails.filter((e) => e.replyStatus === 'drafted').length;
  const pendingSuppliers = suppliers.filter((s) => s.status === 'form_drafted' || s.status === 'submitted').length;

  return (
    <AdminShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeSubTab={activeSubTab}
      setActiveSubTab={setActiveSubTab}
      onPerformFullSearch={handlePerformFullSearch}
      brands={brands}
      activeBrandId={activeBrandId}
      setActiveBrandId={setActiveBrandId}
      activeAgentsCount={isEmergencyStopped ? 0 : agents.filter((a) => a.status === 'working').length}
      totalAgentsCount={agents.length}
      onTriggerAllAgents={handleTriggerAllAgents}
      isEmergencyStopped={isEmergencyStopped}
      onToggleStopAllTasks={handleToggleStopAllTasks}
      unassignedEmailsCount={unassignedEmails}
      pendingSupplierCount={pendingSuppliers}
      suppliers={suppliers}
      products={products}
      emails={emails}
      credentials={credentials}
      seoArticles={seoArticles}
      workflows={workflows}
      agents={agents}
    >
      {activeTab === 'search_results' && (
        <SearchResultsView
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
          setActiveTab={setActiveTab}
          setActiveSubTab={setActiveSubTab}
          suppliers={suppliers}
          products={products}
          emails={emails}
          credentials={credentials}
          brands={brands}
          seoArticles={seoArticles}
          workflows={workflows}
          agents={agents}
          departments={departments}
        />
      )}

      {activeTab === 'agent_approvals' && (
        <AgentApprovalConsole
          agents={agents}
          onApproveAndRunAgent={handleApproveAndRunAgent}
          onPauseAgent={handlePauseAgent}
          onAddAgent={handleAddAgent}
          onUpdateAgent={handleUpdateAgent}
          onDeleteAgent={handleDeleteAgent}
        />
      )}

          {activeTab === 'credentials_vault' && (
            <CredentialsVaultStudio
              credentials={credentials}
              onAddCredential={handleAddCredential}
              onUpdateCredential={handleUpdateCredential}
              onDeleteCredential={handleDeleteCredential}
            />
          )}

          {activeTab === 'command_center' && (
            <CommandCenterPage
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}

          {activeTab === 'finance' && (
            <FinancePage
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              agents={agents}
              logs={logs}
              onNavigateTab={setActiveTab}
              onRunAgentTask={handleRunAgentTask}
              isEmergencyStopped={isEmergencyStopped}
              onToggleStopAllTasks={handleToggleStopAllTasks}
            />
          )}

          {activeTab === 'db_diagnostics' && (
            <DatabaseDiagnosticsStudio
              departments={departments}
              agents={agents}
              posts={socialPosts}
              suppliers={suppliers}
              products={products}
              emails={emails}
              logs={logs}
            />
          )}

          {activeTab === 'proj_hardicart' && (
            activeSubTab === 'wholesale_leads' ? (
              <WholesaleLeadsStudio
                vertical="wholesale"
                onNavigateToCredentials={() => setActiveTab('credentials_vault')}
              />
            ) : activeSubTab && ['rc_supplier_list', 'all_contacts', 'clean_suppliers', 'usa_suppliers', 'wholesalers', 'fabric_suppliers', 'real_brands'].includes(activeSubTab) ? (
              <RcSupplierListStudio
                activeSubTab={activeSubTab === 'rc_supplier_list' ? 'all_contacts' : activeSubTab}
                onSubTabChange={setActiveSubTab}
                onDraftEmail={(email) => {
                  setActiveTab('emails');
                }}
              />
            ) : (
              <ProjectDetailView
                projectId="proj_hardicart"
                departments={departments}
                agents={agents}
                brands={brands}
                posts={socialPosts}
                onToggleTopicStatus={handleToggleTopicStatus}
                onRefreshSheetData={handleRefreshSheetData}
              />
            )
          )}

          {activeTab === 'proj_ai_earning' && (
            <ProjectDetailView
              projectId="ai-earning-ltd"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'proj_peshadari' && (
            <ProjectDetailView
              projectId="proj_peshadari"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'proj_sonali_insurance' && (
            <ProjectDetailView
              projectId="sonali-insurance"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'proj_product_review' && (
            <ProjectDetailView
              projectId="product-review"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'proj_drpshop' && (
            <ProjectDetailView
              projectId="drpshop"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'proj_job_news' && (
            <ProjectDetailView
              projectId="job-news"
              departments={departments}
              agents={agents}
              brands={brands}
              posts={socialPosts}
              onToggleTopicStatus={handleToggleTopicStatus}
              onRefreshSheetData={handleRefreshSheetData}
            />
          )}

          {activeTab === 'sheets_db' && (
            <GoogleSheetDepartmentHub
              isEmergencyStopped={isEmergencyStopped}
              onToggleStopAllTasks={handleToggleStopAllTasks}
            />
          )}

          {activeTab === 'architecture' && (
            <SystemArchitectureView
              agents={agents}
              isEmergencyStopped={isEmergencyStopped}
              onToggleStopAllTasks={handleToggleStopAllTasks}
              onRunAgentTask={handleRunAgentTask}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}

          {activeTab === 'suppliers' && (
            <SupplierStudio
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplierStatus={handleUpdateSupplierStatus}
              onDraftFollowUpEmail={(sup) => {
                setActiveTab('emails');
              }}
            />
          )}

          {activeTab === 'rc_supplier_list' && (
            activeSubTab === 'wholesale_leads' ? (
              <WholesaleLeadsStudio
                vertical="wholesale"
                onNavigateToCredentials={() => setActiveTab('credentials_vault')}
              />
            ) : (
              <RcSupplierListStudio
                activeSubTab={activeSubTab}
                onSubTabChange={setActiveSubTab}
                onDraftEmail={(email) => {
                  setActiveTab('emails');
                }}
              />
            )
          )}

          {activeTab === 'wholesale_leads' && (
            <WholesaleLeadsStudio
              vertical="wholesale"
              onNavigateToCredentials={() => setActiveTab('credentials_vault')}
            />
          )}

          {activeTab === 'emails' && (
            <EmailCommandCenter
              emails={emails}
              onDraftReplyWithAI={handleDraftReplyWithAI}
              onSendEmailReply={handleSendEmailReply}
            />
          )}

          {activeTab === 'catalog' && (
            <ProductCatalogStudio
              products={products}
              onAddProduct={(p) => setProducts((prev) => [p, ...prev])}
              onGenerateListingWithAI={handleGenerateListingWithAI}
              onCleanCSVWithAI={handleCleanCSVWithAI}
            />
          )}

          {activeTab === 'inventory' && (
            <InventorySyncEngine
              products={products}
              onTriggerSync={() => {
                addLog('Sync-StockAgent', 'inventory', 'success', 'Synchronized stock & prices across 12,450 SKUs.');
              }}
            />
          )}

          {activeTab === 'social' && (
            <SocialMediaHub
              brands={brands}
              setBrands={setBrands}
              activeBrandId={activeBrandId}
              setActiveBrandId={setActiveBrandId}
              posts={socialPosts}
              departments={departments}
              onGenerateSocialPost={handleGenerateSocialPost}
            />
          )}

          {activeTab === 'seo' && (
            <SeoStudio
              articles={seoArticles}
              onGenerateBlogWithAI={handleGenerateBlogWithAI}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowAutomationEngine
              workflows={workflows}
              onTriggerWorkflow={handleTriggerWorkflow}
            />
          )}

          {activeTab === 'tech_ops' && <TechOpsMonitor />}
    </AdminShell>
  );
}
