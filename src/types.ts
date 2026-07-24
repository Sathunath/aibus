export type Department = 
  | 'command_center'
  | 'search_results'
  | 'architecture'
  | 'agent_approvals'
  | 'finance'
  | 'suppliers'
  | 'rc_supplier_list'
  | 'wholesale_leads'
  | 'emails'
  | 'catalog'
  | 'inventory'
  | 'social'
  | 'seo'
  | 'workflows'
  | 'tech_ops'
  | 'analytics'
  | 'sheets_db'
  | 'db_diagnostics'
  | 'proj_ai_earning'
  | 'proj_hardicart'
  | 'proj_peshadari'
  | 'proj_sonali_insurance'
  | 'proj_product_review'
  | 'proj_drpshop'
  | 'proj_job_news'
  | 'credentials_vault'
  | 'my_life';

export interface LeadItem {
  id: string;
  vertical: string; // default "wholesale"
  category: string;
  source: string;
  company_name: string;
  website: string;
  email: string;
  apply_method: 'Email' | 'Web Form' | 'Portal' | 'Phone / Direct';
  apply_url?: string;
  moq?: string;
  city: string;
  notes?: string;
  mail_status: 'Not Sent' | 'Scheduled' | 'Sent' | 'Failed' | 'Opened';
  mail_scheduled_at?: string;
  mail_sent_at?: string;
  mail_template_id?: string;
  form_status: 'Draft' | 'Submitted' | 'In Review' | 'Verified';
  approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Review';
  reply_status: 'No Reply' | 'Replied' | 'Follow Up Needed' | 'Negotiating';
  account_id?: string;
  pipeline_stage: 'New Lead' | 'Outreach' | 'Application Sent' | 'Under Review' | 'Approved Supplier' | 'Closed';
  found_date: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  fullName: string;
  photoUrl?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  relationship: string;
  category: 'Immediate Family' | 'Extended Family' | 'Friend' | 'Relative' | 'Other';
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  occupation?: string;
  notes?: string;
  createdAt: string;
}

export interface LifeTask {
  id: string;
  title: string;
  description?: string;
  personIds: string[]; // Connected people IDs
  category: 'Personal' | 'Insurance' | 'Medical' | 'Financial' | 'Family' | 'Home' | 'Other';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface LifeSharedFinance {
  id: string;
  title: string;
  type: 'Joint Savings' | 'Family Support' | 'Shared Asset' | 'Joint Loan' | 'Family Expense';
  memberIds: string[]; // Connected people IDs
  totalAmount: number;
  yourContribution: number;
  currentBalance?: number;
  note?: string;
  updatedAt: string;
}

export interface InsurancePolicy {
  id: string;
  policyName: string;
  company: string;
  policyNumber: string;
  policyType: 'Health' | 'Life' | 'Car' | 'Property' | 'Travel' | 'Other';
  insuredPersonId: string;
  beneficiaryPersonId?: string;
  premiumAmount: number;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  startDate: string;
  expiryDate: string;
  nextPaymentDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  notes?: string;
}

export interface LifeDocument {
  id: string;
  title: string;
  docType: 'Passport' | 'National ID' | 'Birth Certificate' | 'Marriage Certificate' | 'Insurance Policy' | 'Medical Document' | 'Property Document' | 'Education' | 'Other';
  ownerPersonId: string;
  relatedPersonIds?: string[];
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Birthday' | 'Anniversary' | 'Wedding' | 'Milestone' | 'Renewal' | 'Other';
  personId?: string;
  reminderDaysBefore: number;
  notes?: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'Family' | 'Career' | 'Marriage' | 'Children' | 'Property' | 'Travel' | 'Achievement' | 'Other';
  personIds: string[];
  location?: string;
  imageUrl?: string;
}

export interface LifeAsset {
  id: string;
  assetName: string;
  type: 'House' | 'Vehicle' | 'Land' | 'Business' | 'Gold / Investment' | 'Other';
  value: number;
  ownerIds: string[];
  purchaseDate: string;
  notes?: string;
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'link';
  attachmentName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactionCount: number;
  trend: Array<{
    date: string;
    income: number;
    expense: number;
    net: number;
  }>;
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthComparison: {
    currentMonth: { income: number; expense: number; net: number };
    previousMonth: { income: number; expense: number; net: number };
    percentageChange: { income: number; expense: number; net: number };
  };
  yearComparison: {
    currentYear: { income: number; expense: number; net: number };
    previousYear: { income: number; expense: number; net: number };
    percentageChange: { income: number; expense: number; net: number };
  };
}

export interface CredentialVaultItem {
  id: string;
  accountName: string;
  username: string;
  passwordHint: string;
  recoveryAccount: string;
  category?: 'Personal' | 'Social' | 'Business' | 'Store' | 'Database';
  notes?: string;
  lastUpdated: string;
}

export interface SheetTopic {
  id: string;
  topic: string;
  scheduledDate: string;
  isCompleted: boolean;
  status: 'Completed' | 'Pending';
}

export interface SheetDepartment {
  id: string;
  name: string;
  channel: string;
  topics: SheetTopic[];
}

export interface MySQLConfig {
  host: string;
  user: string;
  password?: string;
  database: string;
  port: number;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  department: Department;
  layer?: 'business_owner' | 'executive' | 'specialist' | 'workflow' | 'browser_agent';
  status: 'idle' | 'working' | 'paused' | 'error';
  isApproved?: boolean;
  approvalStatus?: 'approved' | 'pending_review' | 'paused';
  pendingTask?: string;
  currentTask?: string;
  tasksCompleted: number;
  accuracyRate: number;
  avatarColor: string;
  iconName: string;
  lastActive: string;
}

export interface Supplier {
  id: string;
  name: string;
  niche: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  status: 'discovered' | 'form_drafted' | 'submitted' | 'follow_up' | 'approved' | 'rejected';
  minOrderValue: number;
  shippingOrigin: string;
  documentsSubmitted: string[];
  notes: string;
  leadScore: number;
  lastContactDate: string;
  catalogSize: number;
}

export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  category: 'supplier_app' | 'customer_support' | 'price_alert' | 'marketing' | 'general';
  receivedAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  suggestedReply?: string;
  replyStatus: 'pending' | 'drafted' | 'sent' | 'archived';
  fullText: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  supplierName: string;
  costPrice: number;
  sellingPrice: number;
  mapPrice?: number;
  marginPercent: number;
  stockQuantity: number;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'discontinued' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  specs: Record<string, string>;
  images: string[];
  lastSynced: string;
}

export interface Brand {
  id: string;
  name: string;
  niche: string;
  logo: string;
  primaryColor: string;
  email?: string;
  accounts: SocialAccount[];
}

export interface SocialAccount {
  id: string;
  brandId: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'x' | 'twitter' | 'linkedin' | 'pinterest' | 'other';
  handle: string;
  followers: number;
  engagementRate: number;
  status: 'connected' | 'reauth_needed' | 'syncing';
  avatarUrl: string;
  directUrl?: string;
  emailOrNote?: string;
}

export interface SocialPost {
  id: string;
  brandId: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  title: string;
  caption: string;
  script?: string;
  hashtags: string[];
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrl?: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface N8nWorkflow {
  id: string;
  name: string;
  triggerType: 'webhook' | 'cron' | 'event' | 'manual';
  nodeCount: number;
  status: 'active' | 'paused' | 'error';
  lastRunTime: string;
  successRate: number;
  avgDurationSec: number;
  description: string;
  nodes: { id: string; name: string; type: string }[];
}

export interface SEOArticle {
  id: string;
  title: string;
  targetKeyword: string;
  targetProductCategory: string;
  wordCount: number;
  status: 'draft' | 'published' | 'optimizing';
  metaTitle: string;
  metaDescription: string;
  contentMarkdown: string;
  internalLinksCount: number;
  seoScore: number;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  department: Department;
  agentName: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}
