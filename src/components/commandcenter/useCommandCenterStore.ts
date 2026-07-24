import { useState, useEffect } from 'react';
import {
  Workspace,
  DepartmentItem,
  ProjectItem,
  UniversalTask,
  FinanceConnection,
  CommandGoal,
  UniversalConnectionLink
} from './commandCenterTypes';

const STORAGE_KEY_WORKSPACES = 'command_center_workspaces_v1';
const STORAGE_KEY_DEPARTMENTS = 'command_center_departments_v1';
const STORAGE_KEY_PROJECTS = 'command_center_projects_v1';
const STORAGE_KEY_TASKS = 'command_center_tasks_v1';
const STORAGE_KEY_FINANCE = 'command_center_finance_v1';
const STORAGE_KEY_GOALS = 'command_center_goals_v1';
const STORAGE_KEY_LINKS = 'command_center_links_v1';

export const initialWorkspacesSeed: Workspace[] = [
  {
    id: 'ws-ai-earning',
    name: 'AI Earning Ltd',
    type: 'Business',
    description: 'AI-driven content, programmatic SEO, & automated digital assets platform',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2025-01-10',
    targetDate: '2027-12-31',
    priority: 'Urgent',
    color: '#4f46e5', // indigo
    icon: 'Bot',
    createdAt: '2025-01-10'
  },
  {
    id: 'ws-peshadari',
    name: 'Peshadari',
    type: 'Brand',
    description: 'E-commerce fashion & cultural footwear brand with direct social sales',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2024-06-01',
    targetDate: '2026-12-31',
    priority: 'High',
    color: '#d97706', // amber
    icon: 'ShoppingBag',
    createdAt: '2024-06-01'
  },
  {
    id: 'ws-sonali-insurance',
    name: 'Sonali Insurance',
    type: 'Business',
    description: 'Health, term life & asset insurance advisory & automated policy portal',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2023-09-15',
    targetDate: '2028-12-31',
    priority: 'High',
    color: '#059669', // emerald
    icon: 'ShieldCheck',
    createdAt: '2023-09-15'
  },
  {
    id: 'ws-drpshop',
    name: 'DRPSHOP',
    type: 'Business',
    description: 'Automated US dropshipping catalog & multi-supplier fulfillment store',
    logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67e58f038f?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2024-11-01',
    targetDate: '2026-12-31',
    priority: 'Urgent',
    color: '#0284c7', // sky
    icon: 'Package',
    createdAt: '2024-11-01'
  },
  {
    id: 'ws-job-news',
    name: 'Job News',
    type: 'Side Project',
    description: 'Real-time job opening aggregator & AI resume formatting service',
    logoUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2025-02-01',
    targetDate: '2026-08-30',
    priority: 'Medium',
    color: '#9333ea', // purple
    icon: 'Newspaper',
    createdAt: '2025-02-01'
  },
  {
    id: 'ws-product-review',
    name: 'Product Review Website',
    type: 'Project',
    description: 'Affiliate review network with AI article generation & price tracking',
    logoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2025-01-20',
    targetDate: '2026-09-30',
    priority: 'High',
    color: '#e11d48', // rose
    icon: 'Star',
    createdAt: '2025-01-20'
  },
  {
    id: 'ws-learn-ai',
    name: 'Learn AI Automation',
    type: 'Personal Project',
    description: 'Master n8n, Playwright, LLM fine-tuning, & local agentic workflows',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
    status: 'Active',
    startDate: '2025-03-01',
    priority: 'Medium',
    color: '#0d9488', // teal
    icon: 'Sparkles',
    createdAt: '2025-03-01'
  }
];

export const initialDepartmentsSeed: DepartmentItem[] = [
  { id: 'dept-mgmt', workspaceIds: ['ws-ai-earning', 'ws-sonali-insurance'], name: 'Management & Ops', code: 'MGMT' },
  { id: 'dept-mktg', workspaceIds: ['ws-ai-earning', 'ws-peshadari', 'ws-product-review', 'ws-drpshop'], name: 'Marketing & SEO', code: 'MKTG' },
  { id: 'dept-sales', workspaceIds: ['ws-peshadari', 'ws-drpshop', 'ws-sonali-insurance'], name: 'Sales & Revenue', code: 'SALES' },
  { id: 'dept-fin', workspaceIds: ['ws-ai-earning', 'ws-sonali-insurance', 'ws-drpshop'], name: 'Finance & Accounting', code: 'FIN' },
  { id: 'dept-tech', workspaceIds: ['ws-ai-earning', 'ws-drpshop', 'ws-job-news', 'ws-product-review'], name: 'Technology & AI', code: 'TECH' },
  { id: 'dept-content', workspaceIds: ['ws-ai-earning', 'ws-product-review', 'ws-job-news'], name: 'Content & Publishing', code: 'CONTENT' },
  { id: 'dept-supp', workspaceIds: ['ws-drpshop'], name: 'Supplier & Inventory', code: 'SUPP' }
];

export const initialProjectsSeed: ProjectItem[] = [
  {
    id: 'proj-social-launch',
    workspaceIds: ['ws-ai-earning', 'ws-peshadari'],
    departmentIds: ['dept-mktg'],
    name: 'Social Media Omni-Launch',
    description: 'Launch TikTok, Facebook & Instagram viral video automation across brands',
    status: 'In Progress',
    progressPercent: 70,
    startDate: '2026-02-01',
    deadline: '2026-08-15',
    memberPersonIds: ['p-1', 'p-2'],
    budget: 3500,
    actualSpend: 2100,
    revenue: 4200,
    color: '#4f46e5'
  },
  {
    id: 'proj-web-revamp',
    workspaceIds: ['ws-ai-earning'],
    departmentIds: ['dept-tech', 'dept-mktg'],
    name: 'AI Earning Portal Web App',
    description: 'Full-stack React + Node server for automated content and dashboard',
    status: 'In Progress',
    progressPercent: 85,
    startDate: '2026-01-15',
    deadline: '2026-08-30',
    memberPersonIds: ['p-1'],
    budget: 5000,
    actualSpend: 3800,
    revenue: 12000,
    color: '#0284c7'
  },
  {
    id: 'proj-seo-campaign',
    workspaceIds: ['ws-product-review', 'ws-job-news'],
    departmentIds: ['dept-content', 'dept-mktg'],
    name: 'Programmatic SEO Engine',
    description: 'Generate 500+ long-tail keyword review articles with automated internal linking',
    status: 'In Progress',
    progressPercent: 60,
    startDate: '2026-03-01',
    deadline: '2026-09-15',
    memberPersonIds: ['p-2'],
    budget: 2000,
    actualSpend: 1100,
    revenue: 3500,
    color: '#e11d48'
  },
  {
    id: 'proj-supplier-catalog',
    workspaceIds: ['ws-drpshop'],
    departmentIds: ['dept-supp', 'dept-sales'],
    name: 'US Dropshipping Supplier Pipeline',
    description: 'Approve 50 top US suppliers & sync 1000+ MAP-priced SKUs to shopify catalog',
    status: 'In Progress',
    progressPercent: 75,
    startDate: '2026-02-10',
    deadline: '2026-08-20',
    memberPersonIds: ['p-1', 'p-3'],
    budget: 4000,
    actualSpend: 2900,
    revenue: 8900,
    color: '#059669'
  }
];

export const initialTasksSeed: UniversalTask[] = [
  {
    id: 'task-1',
    title: 'Complete AI Earning Ltd full-stack website API integration',
    description: 'Deploy express routes and verify Google Gemini API key security server-side',
    workspaceIds: ['ws-ai-earning'],
    departmentIds: ['dept-tech'],
    projectIds: ['proj-web-revamp'],
    assignedPersonIds: ['p-1'],
    dueDate: '2026-07-25',
    priority: 'Urgent',
    status: 'In Progress',
    category: 'Urgent',
    isMyDay: true,
    createdAt: '2026-07-20'
  },
  {
    id: 'task-2',
    title: 'Review Peshadari Facebook page & TikTok ad creative design',
    description: 'Approve product video scripts and thumbnail graphics for summer collection',
    workspaceIds: ['ws-peshadari', 'ws-ai-earning'],
    departmentIds: ['dept-mktg'],
    projectIds: ['proj-social-launch'],
    assignedPersonIds: ['p-2'],
    dueDate: '2026-07-24',
    priority: 'High',
    status: 'In Progress',
    category: 'Important',
    isMyDay: true,
    createdAt: '2026-07-21'
  },
  {
    id: 'task-3',
    title: 'Check DRPSHOP supplier response from Wholesale Central',
    description: 'Follow up with 5 US warehouses regarding lead times & MAP policy docs',
    workspaceIds: ['ws-drpshop'],
    departmentIds: ['dept-supp'],
    projectIds: ['proj-supplier-catalog'],
    assignedPersonIds: ['p-1'],
    dueDate: '2026-07-26',
    priority: 'High',
    status: 'Waiting',
    category: 'Waiting',
    isMyDay: true,
    createdAt: '2026-07-22'
  },
  {
    id: 'task-4',
    title: 'Sonali Insurance policy renewal notification script check',
    description: 'Verify health insurance expiry reminders for family members',
    workspaceIds: ['ws-sonali-insurance'],
    departmentIds: ['dept-mgmt'],
    projectIds: [],
    assignedPersonIds: ['p-3'],
    dueDate: '2026-07-28',
    priority: 'Medium',
    status: 'Pending',
    category: 'Follow Up',
    isMyDay: false,
    createdAt: '2026-07-19'
  },
  {
    id: 'task-5',
    title: 'Review Job News automated job scraper logs',
    description: 'Ensure n8n cron workflow runs smoothly every 6 hours without rate limit',
    workspaceIds: ['ws-job-news'],
    departmentIds: ['dept-tech'],
    projectIds: ['proj-seo-campaign'],
    assignedPersonIds: ['p-1'],
    dueDate: '2026-07-27',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Important',
    isMyDay: true,
    createdAt: '2026-07-22'
  },
  {
    id: 'task-6',
    title: 'Publish Product Review website 10 top wireless headphone reviews',
    description: 'Review AI-generated SEO articles and attach Amazon affiliate buy links',
    workspaceIds: ['ws-product-review'],
    departmentIds: ['dept-content'],
    projectIds: ['proj-seo-campaign'],
    assignedPersonIds: ['p-2'],
    dueDate: '2026-07-29',
    priority: 'High',
    status: 'Pending',
    category: 'Important',
    isMyDay: false,
    createdAt: '2026-07-22'
  },
  {
    id: 'task-7',
    title: 'Learn AI Automation: Test n8n Playwright Web Scraping node',
    description: 'Practice custom JS function nodes in n8n for extracting table data',
    workspaceIds: ['ws-learn-ai'],
    departmentIds: ['dept-tech'],
    projectIds: [],
    assignedPersonIds: ['p-1'],
    dueDate: '2026-07-30',
    priority: 'Low',
    status: 'In Progress',
    category: 'Routine',
    isMyDay: false,
    createdAt: '2026-07-22'
  }
];

export const initialFinanceSeed: FinanceConnection[] = [
  {
    id: 'fin-1',
    type: 'expense',
    title: 'Facebook Ads - Summer Campaign',
    amount: 500,
    category: 'Advertising',
    date: '2026-07-21',
    workspaceIds: ['ws-ai-earning', 'ws-peshadari'],
    departmentIds: ['dept-mktg'],
    projectIds: ['proj-social-launch'],
    personIds: ['p-2'],
    notes: 'Allocated 60% AI Earning Ltd / 40% Peshadari promo'
  },
  {
    id: 'fin-2',
    type: 'expense',
    title: 'Cloud Server Infrastructure Hosting',
    amount: 180,
    category: 'Technology',
    date: '2026-07-20',
    workspaceIds: ['ws-ai-earning', 'ws-drpshop', 'ws-job-news'],
    departmentIds: ['dept-tech'],
    projectIds: ['proj-web-revamp'],
    personIds: ['p-1'],
    notes: 'Cloud Run & PostgreSQL container hosting'
  },
  {
    id: 'fin-3',
    type: 'income',
    title: 'Dropship Order Sales Revenue',
    amount: 2450,
    category: 'Sales',
    date: '2026-07-22',
    workspaceIds: ['ws-drpshop'],
    departmentIds: ['dept-sales'],
    projectIds: ['proj-supplier-catalog'],
    personIds: ['p-1'],
    notes: 'Batch payouts from Shopify store'
  }
];

export const initialGoalsSeed: CommandGoal[] = [
  {
    id: 'goal-1',
    title: 'Launch AI Earning Ltd & Reach $10k Monthly Recurring Revenue',
    description: 'Automate content publishing, web traffic, and digital asset sales across brands',
    workspaceIds: ['ws-ai-earning', 'ws-peshadari', 'ws-product-review'],
    connectedProjectIds: ['proj-web-revamp', 'proj-social-launch', 'proj-seo-campaign'],
    targetMetric: '$10,000 / month',
    currentProgress: 65,
    deadline: '2026-12-31',
    status: 'Active',
    budgetAllocated: 10500,
    revenueGenerated: 19700,
    createdAt: '2026-01-01'
  },
  {
    id: 'goal-2',
    title: 'Scale DRPSHOP to 1,000 Active Supplier Products',
    description: 'Build automated inventory sync and automated order dispatch pipeline',
    workspaceIds: ['ws-drpshop'],
    connectedProjectIds: ['proj-supplier-catalog'],
    targetMetric: '1,000 SKUs',
    currentProgress: 45,
    deadline: '2026-10-31',
    status: 'Active',
    budgetAllocated: 4000,
    revenueGenerated: 8900,
    createdAt: '2026-02-01'
  }
];

export function useCommandCenterStore() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKSPACES);
      return saved ? JSON.parse(saved) : initialWorkspacesSeed;
    } catch {
      return initialWorkspacesSeed;
    }
  });

  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEPARTMENTS);
      return saved ? JSON.parse(saved) : initialDepartmentsSeed;
    } catch {
      return initialDepartmentsSeed;
    }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      return saved ? JSON.parse(saved) : initialProjectsSeed;
    } catch {
      return initialProjectsSeed;
    }
  });

  const [tasks, setTasks] = useState<UniversalTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : initialTasksSeed;
    } catch {
      return initialTasksSeed;
    }
  });

  const [financeEntries, setFinanceEntries] = useState<FinanceConnection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE);
      return saved ? JSON.parse(saved) : initialFinanceSeed;
    } catch {
      return initialFinanceSeed;
    }
  });

  const [goals, setGoals] = useState<CommandGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOALS);
      return saved ? JSON.parse(saved) : initialGoalsSeed;
    } catch {
      return initialGoalsSeed;
    }
  });

  const [links, setLinks] = useState<UniversalConnectionLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LINKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FINANCE, JSON.stringify(financeEntries));
  }, [financeEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
  }, [links]);

  // Actions
  const addWorkspace = (ws: Omit<Workspace, 'id' | 'createdAt'>) => {
    const newWs: Workspace = {
      ...ws,
      id: `ws-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWorkspaces((prev) => [newWs, ...prev]);
  };

  const updateWorkspace = (id: string, partial: Partial<Workspace>) => {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...partial } : w)));
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  };

  const addDepartment = (dept: Omit<DepartmentItem, 'id'>) => {
    const newDept: DepartmentItem = { ...dept, id: `dept-${Date.now()}` };
    setDepartments((prev) => [...prev, newDept]);
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const addProject = (proj: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = { ...proj, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, partial: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTask = (task: Omit<UniversalTask, 'id' | 'createdAt'>) => {
    const newTask: UniversalTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: UniversalTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addFinanceEntry = (entry: Omit<FinanceConnection, 'id'>) => {
    const newFin: FinanceConnection = { ...entry, id: `fin-${Date.now()}` };
    setFinanceEntries((prev) => [newFin, ...prev]);
  };

  const deleteFinanceEntry = (id: string) => {
    setFinanceEntries((prev) => prev.filter((f) => f.id !== id));
  };

  const addGoal = (goal: Omit<CommandGoal, 'id' | 'createdAt'>) => {
    const newGoal: CommandGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addConnectionLink = (link: Omit<UniversalConnectionLink, 'id' | 'createdAt'>) => {
    const newLink: UniversalConnectionLink = {
      ...link,
      id: `link-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLinks((prev) => [newLink, ...prev]);
  };

  const resetAllSeedData = () => {
    setWorkspaces(initialWorkspacesSeed);
    setDepartments(initialDepartmentsSeed);
    setProjects(initialProjectsSeed);
    setTasks(initialTasksSeed);
    setFinanceEntries(initialFinanceSeed);
    setGoals(initialGoalsSeed);
    setLinks([]);
    setSelectedWorkspaceId('all');
  };

  return {
    workspaces,
    departments,
    projects,
    tasks,
    financeEntries,
    goals,
    links,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addDepartment,
    deleteDepartment,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTaskStatus,
    deleteTask,
    addFinanceEntry,
    deleteFinanceEntry,
    addGoal,
    deleteGoal,
    addConnectionLink,
    resetAllSeedData
  };
}
