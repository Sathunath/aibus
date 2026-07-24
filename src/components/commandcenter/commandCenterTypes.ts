export type WorkspaceType = 
  | 'Business'
  | 'Brand'
  | 'Project'
  | 'Side Project'
  | 'Personal Project'
  | 'Investment'
  | 'Other';

export type WorkspaceStatus = 'Active' | 'Planning' | 'On Hold' | 'Completed' | 'Archived';
export type WorkspacePriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  description: string;
  logoUrl?: string;
  status: WorkspaceStatus;
  startDate: string;
  targetDate?: string;
  ownerPersonId?: string;
  priority: WorkspacePriority;
  color: string; // e.g. '#4f46e5' or tailwind class
  icon: string;
  parentWorkspaceId?: string;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  workspaceIds: string[]; // Can belong to multiple businesses!
  name: string;
  code?: string;
  leadPersonId?: string;
  isArchived?: boolean;
  color?: string;
  notes?: string;
}

export interface ProjectItem {
  id: string;
  workspaceIds: string[]; // Many-to-many: e.g. Social Media Automation connected to AI Earning Ltd & Peshadari
  departmentIds: string[];
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'In Review' | 'Completed' | 'On Hold';
  progressPercent: number; // 0 - 100
  startDate: string;
  deadline: string;
  ownerPersonId?: string;
  memberPersonIds: string[];
  budget: number;
  actualSpend: number;
  revenue: number;
  documentIds?: string[];
  relatedProjectIds?: string[];
  goalIds?: string[];
  color?: string;
}

export interface UniversalTask {
  id: string;
  title: string;
  description?: string;
  workspaceIds: string[]; // Connect to multiple businesses
  departmentIds: string[]; // Connect to departments
  projectIds: string[]; // Connect to projects
  assignedPersonIds: string[]; // Connect to team/family members
  financeIds?: string[]; // Connected finance records
  goalIds?: string[]; // Connected goals
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Waiting' | 'Follow Up' | 'Completed';
  category?: 'Urgent' | 'Important' | 'Waiting' | 'Follow Up' | 'Routine';
  isMyDay?: boolean;
  createdAt: string;
}

export interface FinanceConnection {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
  workspaceIds: string[];
  departmentIds: string[];
  projectIds: string[];
  personIds: string[];
  assetIds?: string[];
  notes?: string;
}

export interface CommandGoal {
  id: string;
  title: string;
  description: string;
  workspaceIds: string[];
  connectedProjectIds: string[];
  targetMetric: string; // e.g. "$10,000 Monthly Revenue"
  currentProgress: number; // 0 - 100
  deadline: string;
  status: 'Active' | 'Achieved' | 'At Risk' | 'On Hold';
  budgetAllocated: number;
  revenueGenerated: number;
  createdAt: string;
}

export interface UniversalConnectionLink {
  id: string;
  sourceType: 'workspace' | 'department' | 'project' | 'task' | 'finance' | 'person' | 'document' | 'goal' | 'asset' | 'event';
  sourceId: string;
  targetType: 'workspace' | 'department' | 'project' | 'task' | 'finance' | 'person' | 'document' | 'goal' | 'asset' | 'event';
  targetId: string;
  note?: string;
  createdAt: string;
}
