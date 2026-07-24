import { AIAgent, Brand, CredentialVaultItem, EmailMessage, N8nWorkflow, ProductItem, SEOArticle, SocialPost, Supplier, SystemLog } from '../types';

export const initialAgents: AIAgent[] = [];

export const initialBrands: Brand[] = [
  {
    id: 'peshadari',
    name: 'Peshadari',
    email: 'sotikseba@gmail.com',
    niche: 'Media, News & Personal Brand',
    logo: '👑',
    primaryColor: '#8B5CF6',
    accounts: [
      { id: 'acc-p1', brandId: 'peshadari', platform: 'facebook', handle: '@Peshadari', directUrl: 'https://www.facebook.com/Peshadari', emailOrNote: 'sotikseba@gmail.com', followers: 58000, engagementRate: 7.2, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-p2', brandId: 'peshadari', platform: 'instagram', handle: '@peshadari', directUrl: 'https://www.instagram.com/peshadari/', emailOrNote: 'sotikseba@gmail.com', followers: 42000, engagementRate: 6.5, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-p3', brandId: 'peshadari', platform: 'youtube', handle: '@Peshadari', directUrl: 'https://www.youtube.com/@Peshadari', emailOrNote: 'sotikseba@gmail.com', followers: 95000, engagementRate: 8.4, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-p4', brandId: 'peshadari', platform: 'x', handle: '@peshadari', directUrl: 'https://x.com/peshadari', emailOrNote: 'sotikseba@gmail.com', followers: 23000, engagementRate: 5.1, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-p5', brandId: 'peshadari', platform: 'tiktok', handle: '@peshadari', directUrl: 'https://www.tiktok.com/@peshadari', emailOrNote: 'sotikseba@gmail.com', followers: 68000, engagementRate: 9.2, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'ai-earning-ltd',
    name: 'AI Earning Ltd',
    email: 'sathunath333',
    niche: 'AI Business, ChatGPT & Automation',
    logo: '🤖',
    primaryColor: '#10B981',
    accounts: [
      { id: 'acc-ae1', brandId: 'ai-earning-ltd', platform: 'facebook', handle: '@AIEarningLtd', directUrl: 'https://www.facebook.com/AIEarningLtd', emailOrNote: 'sathunath333', followers: 45200, engagementRate: 6.8, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-ae2', brandId: 'ai-earning-ltd', platform: 'instagram', handle: '@aiearningltd', directUrl: 'https://www.instagram.com/aiearningltd/', emailOrNote: 'sathunath333', followers: 31200, engagementRate: 5.4, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-ae3', brandId: 'ai-earning-ltd', platform: 'youtube', handle: 'UC4QM-gjF3q6J08Y-UfSkoJg', directUrl: 'https://www.youtube.com/channel/UC4QM-gjF3q6J08Y-UfSkoJg/', emailOrNote: 'sathunath333', followers: 88400, engagementRate: 8.2, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-ae4', brandId: 'ai-earning-ltd', platform: 'tiktok', handle: '@aieariningltd', directUrl: 'https://www.tiktok.com/@aieariningltd', emailOrNote: 'sathunath333', followers: 64100, engagementRate: 9.1, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'haldicart',
    name: 'Haldicart',
    email: 'haldi cart mail',
    niche: 'E-Commerce & Store Products',
    logo: '🛒',
    primaryColor: '#F59E0B',
    accounts: [
      { id: 'acc-hc1', brandId: 'haldicart', platform: 'facebook', handle: '@Haldicart', directUrl: 'https://www.facebook.com/Haldicart', emailOrNote: 'haldi cart mail', followers: 34000, engagementRate: 5.8, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-hc2', brandId: 'haldicart', platform: 'instagram', handle: '@haldicart', directUrl: 'https://www.instagram.com/haldicart/', emailOrNote: 'haldi cart mail', followers: 29000, engagementRate: 6.1, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-hc3', brandId: 'haldicart', platform: 'youtube', handle: '@Haldicart', directUrl: 'https://www.youtube.com/@Haldicart', emailOrNote: 'haldi cart mail', followers: 41000, engagementRate: 7.0, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-hc4', brandId: 'haldicart', platform: 'tiktok', handle: '@haldicart', directUrl: 'https://www.tiktok.com/@haldicart', emailOrNote: 'haldi cart mail', followers: 52000, engagementRate: 8.3, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'sonali-insurance',
    name: 'Sonali Insurance',
    niche: 'Pesha dari Insurance & Financial Education',
    logo: '🛡️',
    primaryColor: '#3B82F6',
    accounts: [
      { id: 'acc-si1', brandId: 'sonali-insurance', platform: 'facebook', handle: '@SonaliInsurance', followers: 38900, engagementRate: 4.2, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-si2', brandId: 'sonali-insurance', platform: 'youtube', handle: '@SonaliInsuranceTV', followers: 52100, engagementRate: 5.8, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-si3', brandId: 'sonali-insurance', platform: 'instagram', handle: '@peshadari.insurance', followers: 19400, engagementRate: 3.9, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'product-review',
    name: 'Product Review',
    niche: 'Pesha dari Appliances & Tech Reviews',
    logo: '📱',
    primaryColor: '#6366F1',
    accounts: [
      { id: 'acc-pr1', brandId: 'product-review', platform: 'youtube', handle: '@ProductReviewBD', followers: 112000, engagementRate: 7.6, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-pr2', brandId: 'product-review', platform: 'facebook', handle: '@ProductReviewOfficial', followers: 64500, engagementRate: 5.1, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-pr3', brandId: 'product-review', platform: 'tiktok', handle: '@productreview.bd', followers: 98000, engagementRate: 8.8, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'drpshop',
    name: 'DRPSHOP',
    niche: 'Hiden Brand & Domain Setup',
    logo: '🛍️',
    primaryColor: '#F59E0B',
    accounts: [
      { id: 'acc-dr1', brandId: 'drpshop', platform: 'facebook', handle: '@drpshop_official', followers: 18200, engagementRate: 3.5, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-dr2', brandId: 'drpshop', platform: 'instagram', handle: '@drpshop.store', followers: 27400, engagementRate: 4.8, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-dr3', brandId: 'drpshop', platform: 'tiktok', handle: '@drpshop_tok', followers: 41000, engagementRate: 6.2, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'job-news',
    name: 'Job News',
    niche: 'Career & Employment Circular Updates',
    logo: '📰',
    primaryColor: '#F43F5E',
    accounts: [
      { id: 'acc-jn1', brandId: 'job-news', platform: 'facebook', handle: '@JobNewsOfficial', followers: 154000, engagementRate: 8.5, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-jn2', brandId: 'job-news', platform: 'youtube', handle: '@JobNewsBD', followers: 89000, engagementRate: 6.7, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&auto=format&fit=crop&q=80' },
      { id: 'acc-jn3', brandId: 'job-news', platform: 'tiktok', handle: '@jobnews.official', followers: 72000, engagementRate: 9.0, status: 'connected', avatarUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&auto=format&fit=crop&q=80' }
    ]
  }
];

export const initialSuppliers: Supplier[] = [];

export const initialEmails: EmailMessage[] = [];

export const initialProducts: ProductItem[] = [];

export const initialSocialPosts: SocialPost[] = [];

export const initialWorkflows: N8nWorkflow[] = [];

export const initialSEOArticles: SEOArticle[] = [];

export const initialLogs: SystemLog[] = [];

export const initialCredentialVault: CredentialVaultItem[] = [
  {
    id: 'cred-1',
    accountName: 'sathunath666',
    username: 'sathunath666',
    passwordHint: 'Lvlv',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Main Account ID 666',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-2',
    accountName: 'fb sathunath',
    username: 'fb sathunath',
    passwordHint: 'Lv44f',
    recoveryAccount: '888',
    category: 'Social',
    notes: 'Facebook profile sathunath',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-3',
    accountName: 'sathunath888',
    username: 'sathunath888',
    passwordHint: 'Lvlv44',
    recoveryAccount: '666',
    category: 'Personal',
    notes: 'Primary ID 888',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-4',
    accountName: 'sathunath777',
    username: 'sathunath777',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 777',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-5',
    accountName: 'sathunath555',
    username: 'sathunath555',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 555',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-6',
    accountName: 'sathunath111',
    username: 'sathunath111',
    passwordHint: 'Lvlv44',
    recoveryAccount: '666',
    category: 'Personal',
    notes: 'Account 111',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-7',
    accountName: 'sathunath333',
    username: 'sathunath333',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 333',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-8',
    accountName: 'sathunath444',
    username: 'sathunath444',
    passwordHint: 'Lvlv44',
    recoveryAccount: '777',
    category: 'Personal',
    notes: 'Account 444',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-9',
    accountName: 'sathunath000',
    username: 'sathunath000',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 000',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-10',
    accountName: 'sathunath1111',
    username: 'sathunath1111',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 1111',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-11',
    accountName: 'haldicart',
    username: 'haldicart',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Store',
    notes: 'HaldiCart e-commerce account',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-12',
    accountName: 'sotikseba',
    username: 'sotikseba',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Business',
    notes: 'SotikSeba project account',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-13',
    accountName: 'peshaariofficial',
    username: 'peshaariofficial',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Social',
    notes: 'Peshaari Official account',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-14',
    accountName: 'sathugita111',
    username: 'sathugita111',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account sathugita111',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-15',
    accountName: 'samj34257',
    username: 'samj34257',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account samj34257',
    lastUpdated: 'Just now'
  },
  {
    id: 'cred-16',
    accountName: 'sathunath99',
    username: 'sathunath99',
    passwordHint: 'Lvlv44',
    recoveryAccount: '888',
    category: 'Personal',
    notes: 'Account 99',
    lastUpdated: 'Just now'
  }
];
