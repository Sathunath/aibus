import React, { useState, useMemo } from 'react';
import {
  Share2,
  Sparkles,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Zap,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Layers,
  Building2,
  Link2,
  Mail,
  Users,
  X,
  CheckCircle2,
  ArrowUpRight,
  Video
} from 'lucide-react';
import { Brand, SocialAccount, SocialPost, SheetDepartment } from '../types';
import { useTableViewportFill, PlaceholderRows } from './ViewportTable';

interface SocialMediaHubProps {
  brands: Brand[];
  setBrands?: React.Dispatch<React.SetStateAction<Brand[]>>;
  activeBrandId: string;
  setActiveBrandId: (id: string) => void;
  posts: SocialPost[];
  departments?: SheetDepartment[];
  onGenerateSocialPost: (
    brandId: string,
    platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube',
    productContext?: string
  ) => Promise<void>;
}

export function SocialMediaHub({
  brands,
  setBrands,
  activeBrandId,
  setActiveBrandId,
  posts,
  departments = [],
  onGenerateSocialPost,
}: SocialMediaHubProps) {
  const [activeTab, setActiveTab] = useState<'rows_table' | 'brand_cards' | 'ai_script_studio'>('rows_table');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<{ brandId: string; account: SocialAccount } | null>(null);

  // Form States for Add/Edit Social Link
  const [linkFormBrandId, setLinkFormBrandId] = useState<string>(activeBrandId || (brands[0]?.id || 'peshadari'));
  const [linkFormPlatform, setLinkFormPlatform] = useState<SocialAccount['platform']>('facebook');
  const [linkFormHandle, setLinkFormHandle] = useState('');
  const [linkFormUrl, setLinkFormUrl] = useState('');
  const [linkFormEmail, setLinkFormEmail] = useState('');
  const [linkFormFollowers, setLinkFormFollowers] = useState<number>(10000);

  // Form States for Add Brand
  const [brandFormName, setBrandFormName] = useState('');
  const [brandFormEmail, setBrandFormEmail] = useState('');
  const [brandFormNiche, setBrandFormNiche] = useState('Media & E-Commerce');
  const [brandFormLogo, setBrandFormLogo] = useState('🚀');

  // Script Studio States
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'instagram' | 'tiktok' | 'youtube'>('facebook');
  const [productContextPrompt, setProductContextPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(posts[0] || null);

  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/1RCZOYIMNUcsdM7pSupeMt4v_NhOccIohjzuXzNg4BIU/edit?usp=sharing';

  // Flatten all social accounts across brands for row-based viewing
  const allFlattenedAccounts = useMemo(() => {
    const list: Array<{ brand: Brand; account: SocialAccount }> = [];
    brands.forEach((b) => {
      if (b.accounts && Array.isArray(b.accounts)) {
        b.accounts.forEach((acc) => {
          list.push({ brand: b, account: acc });
        });
      }
    });
    return list;
  }, [brands]);

  // Filter accounts by Brand, Platform, and Search query
  const filteredAccountRows = useMemo(() => {
    return allFlattenedAccounts.filter(({ brand, account }) => {
      // Brand Filter
      if (selectedBrandFilter !== 'all' && brand.id !== selectedBrandFilter) return false;

      // Platform Filter
      if (selectedPlatformFilter !== 'all' && account.platform !== selectedPlatformFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchBrand = brand.name.toLowerCase().includes(q);
        const matchHandle = account.handle.toLowerCase().includes(q);
        const matchUrl = (account.directUrl || '').toLowerCase().includes(q);
        const matchEmail = (account.emailOrNote || brand.email || '').toLowerCase().includes(q);
        const matchPlatform = account.platform.toLowerCase().includes(q);
        if (!matchBrand && !matchHandle && !matchUrl && !matchEmail && !matchPlatform) {
          return false;
        }
      }

      return true;
    });
  }, [allFlattenedAccounts, selectedBrandFilter, selectedPlatformFilter, searchQuery]);

  const totalAccountCount = allFlattenedAccounts.length;

  // Clipboard copy handler
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Handle Add or Edit Link
  const handleSaveSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkFormUrl.trim() || !setBrands) return;

    if (editingAccount) {
      // Update existing link
      setBrands((prevBrands) =>
        prevBrands.map((b) => {
          if (b.id === editingAccount.brandId) {
            return {
              ...b,
              accounts: b.accounts.map((acc) =>
                acc.id === editingAccount.account.id
                  ? {
                      ...acc,
                      platform: linkFormPlatform,
                      handle: linkFormHandle || acc.handle,
                      directUrl: linkFormUrl,
                      emailOrNote: linkFormEmail,
                      followers: linkFormFollowers,
                    }
                  : acc
              ),
            };
          }
          return b;
        })
      );
      setEditingAccount(null);
    } else {
      // Add new link to selected brand
      const newAcc: SocialAccount = {
        id: `acc-custom-${Date.now()}`,
        brandId: linkFormBrandId,
        platform: linkFormPlatform,
        handle: linkFormHandle || `@${linkFormPlatform}_page`,
        directUrl: linkFormUrl,
        emailOrNote: linkFormEmail,
        followers: linkFormFollowers,
        engagementRate: 6.5,
        status: 'connected',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      };

      setBrands((prevBrands) =>
        prevBrands.map((b) => {
          if (b.id === linkFormBrandId) {
            return {
              ...b,
              accounts: [...b.accounts, newAcc],
            };
          }
          return b;
        })
      );
    }

    // Reset and close
    setLinkFormUrl('');
    setLinkFormHandle('');
    setLinkFormEmail('');
    setIsAddLinkModalOpen(false);
  };

  // Handle Add New Brand
  const handleSaveNewBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandFormName.trim() || !setBrands) return;

    const newBrandId = brandFormName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newBrand: Brand = {
      id: newBrandId,
      name: brandFormName,
      email: brandFormEmail,
      niche: brandFormNiche,
      logo: brandFormLogo || '🏢',
      primaryColor: '#6366F1',
      accounts: [],
    };

    setBrands((prev) => [...prev, newBrand]);
    setActiveBrandId(newBrandId);
    setBrandFormName('');
    setBrandFormEmail('');
    setIsAddBrandModalOpen(false);
  };

  // Handle Instant 1-Click Delete Account Link (Database updated immediately)
  const handleDeleteAccount = (brandId: string, accountId: string) => {
    if (!setBrands) return;
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id === brandId) {
          return {
            ...b,
            accounts: b.accounts.filter((acc) => acc.id !== accountId),
          };
        }
        return b;
      })
    );
  };

  // Handle Instant 1-Click Delete Entire Brand
  const handleDeleteBrand = (brandId: string) => {
    if (!setBrands) return;
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    if (selectedBrandFilter === brandId) {
      setSelectedBrandFilter('all');
    }
  };

  // Handle Database Reset
  const handleResetDatabase = () => {
    if (!setBrands) return;
    localStorage.removeItem('haldi_brands_db_v3');
    window.location.reload();
  };

  // Start Editing Account
  const startEditAccount = (brandId: string, acc: SocialAccount) => {
    setEditingAccount({ brandId, account: acc });
    setLinkFormBrandId(brandId);
    setLinkFormPlatform(acc.platform);
    setLinkFormHandle(acc.handle);
    setLinkFormUrl(acc.directUrl || '');
    setLinkFormEmail(acc.emailOrNote || '');
    setLinkFormFollowers(acc.followers);
    setIsAddLinkModalOpen(true);
  };

  const getPlatformBadge = (platform: SocialAccount['platform']) => {
    switch (platform) {
      case 'facebook':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase font-mono">Facebook</span>;
      case 'instagram':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-100 text-pink-800 border border-pink-200 uppercase font-mono">Instagram</span>;
      case 'youtube':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-200 uppercase font-mono">YouTube</span>;
      case 'tiktok':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-700 uppercase font-mono">TikTok</span>;
      case 'x':
      case 'twitter':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-white border border-slate-700 uppercase font-mono">X / Twitter</span>;
      case 'linkedin':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200 uppercase font-mono">LinkedIn</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase font-mono">{platform}</span>;
    }
  };

  const currentBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const brandPosts = posts.filter((p) => p.brandId === activeBrandId);

  const handleGenerateClick = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || productContextPrompt;
    setIsGenerating(true);
    await onGenerateSocialPost(activeBrandId, selectedPlatform, promptToUse);
    setIsGenerating(false);
    setProductContextPrompt('');
  };

  const { containerRef: socialTableRef, blankRowsCount: socialBlankRows } = useTableViewportFill({
    actualRowCount: filteredAccountRows.length,
    rowHeight: 30,
    headerHeight: 28,
  });

  return (
    <div className="w-full space-y-2 font-sans p-0 m-0">
      {/* Golden Rule 30px Single Header Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-2 py-1 flex flex-col md:flex-row md:items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xs font-bold text-slate-900 truncate">Social Media Manager</h2>
              <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded-full">
                {totalAccountCount} Accounts Registered
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center space-x-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rows_table')}
            className={`h-[26px] px-2.5 rounded-md text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTab === 'rows_table'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>All Accounts (Row View)</span>
          </button>

          <button
            onClick={() => setActiveTab('brand_cards')}
            className={`h-[26px] px-2.5 rounded-md text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTab === 'brand_cards'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Brand Cards Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_script_studio')}
            className={`h-[26px] px-2.5 rounded-md text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition ${
              activeTab === 'ai_script_studio'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Script Studio</span>
          </button>

          <a
            href={googleSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="h-[26px] px-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
            <span>Google Sheet Source</span>
            <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
          </a>
        </div>
      </div>

      {/* Brand Overview Inline Chips (Golden Rule - 28px Chips) */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mr-1">
          Brands Database:
        </span>
        <button
          onClick={() => setSelectedBrandFilter('all')}
          className={`h-[24px] px-2 rounded-md text-[11px] font-bold flex items-center space-x-1 transition cursor-pointer border ${
            selectedBrandFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>All Brands</span>
          <span className="text-[9px] bg-slate-200 text-slate-800 px-1 rounded font-mono">
            {totalAccountCount}
          </span>
        </button>

        {brands.map((b) => {
          const isSelected = selectedBrandFilter === b.id;
          const count = b.accounts?.length || 0;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBrandFilter(b.id)}
              className={`h-[24px] px-2 rounded-md text-[11px] font-bold flex items-center space-x-1.5 transition cursor-pointer border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{b.logo}</span>
              <span>{b.name}</span>
              {b.email && (
                <span className="text-[10px] text-indigo-600 font-mono hidden sm:inline">
                  ({b.email})
                </span>
              )}
              <span className={`text-[9px] px-1 rounded font-mono ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                {count}
              </span>
            </button>
          );
        })}

        <div className="flex items-center space-x-1 ml-auto">
          <button
            onClick={() => setIsAddBrandModalOpen(true)}
            className="h-[24px] px-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Brand</span>
          </button>
          <button
            onClick={handleResetDatabase}
            title="Reset database to default seed data"
            className="h-[24px] px-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
          >
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content View */}
      {activeTab === 'rows_table' && (
        <div className="w-full bg-white border border-slate-200 rounded-lg p-1.5 space-y-1.5">
          {/* Controls Bar (Search, Platform Filter, Add Link Button) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50 border border-slate-200 rounded-md p-1 min-h-[28px]">
            <div className="flex items-center space-x-1.5 flex-1 min-w-0">
              {/* Search Box */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search account, link, email, handle..."
                  className="w-full bg-white border border-slate-200 text-slate-900 text-[10px] rounded-md pl-6 pr-2 py-0.5 h-[22px] focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Platform Selector */}
              <select
                value={selectedPlatformFilter}
                onChange={(e) => setSelectedPlatformFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-[10px] font-medium rounded-md px-2 py-0.5 h-[22px] focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="x">X / Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Showing {filteredAccountRows.length} of {totalAccountCount} Links
              </span>
              <button
                onClick={() => {
                  setEditingAccount(null);
                  setLinkFormUrl('');
                  setLinkFormHandle('');
                  setLinkFormEmail('');
                  setIsAddLinkModalOpen(true);
                }}
                className="h-[22px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md flex items-center space-x-1 cursor-pointer transition shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Social Link</span>
              </button>
            </div>
          </div>

          {/* Ultra-Compact 28-30px Data Table */}
          <div className="w-full overflow-x-auto flex-1 overflow-y-auto border border-slate-200 rounded-md" ref={socialTableRef}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 h-[28px]">
                  <th className="py-0.5 px-2">Brand</th>
                  <th className="py-0.5 px-2">Platform</th>
                  <th className="py-0.5 px-2">Account Handle / Title</th>
                  <th className="py-0.5 px-2">Direct Source URL</th>
                  <th className="py-0.5 px-2">Email / Account Note</th>
                  <th className="py-0.5 px-2 text-right">Followers</th>
                  <th className="py-0.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-800">
                {filteredAccountRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic text-[11px]">
                      No social accounts match your filter criteria. Click "+ Add Social Link" to add new accounts!
                    </td>
                  </tr>
                ) : (
                  filteredAccountRows.map(({ brand, account }) => {
                    const directUrl = account.directUrl || '';
                    const displayEmail = account.emailOrNote || brand.email || '—';

                    return (
                      <tr
                        key={account.id}
                        className="h-[30px] hover:bg-slate-50/90 transition-colors border-b border-slate-100"
                      >
                        {/* Brand Column */}
                        <td className="py-0.5 px-2 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs">{brand.logo}</span>
                            <span className="font-bold text-slate-900 text-[11px]">{brand.name}</span>
                          </div>
                        </td>

                        {/* Platform Column */}
                        <td className="py-0.5 px-2 whitespace-nowrap">
                          {getPlatformBadge(account.platform)}
                        </td>

                        {/* Account Handle Column */}
                        <td className="py-0.5 px-2 whitespace-nowrap font-mono font-bold text-slate-900">
                          {account.handle}
                        </td>

                        {/* Direct URL Column */}
                        <td className="py-0.5 px-2 max-w-[260px] truncate font-mono text-[10px] text-indigo-700">
                          {directUrl ? (
                            <div className="flex items-center space-x-1">
                              <a
                                href={directUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate hover:underline flex items-center space-x-1"
                                title={directUrl}
                              >
                                <span>{directUrl}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 text-indigo-500" />
                              </a>
                              <button
                                onClick={() => copyToClipboard(directUrl, `url-${account.id}`)}
                                title="Copy Link URL"
                                className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded hover:bg-slate-100"
                              >
                                {copiedId === `url-${account.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No URL set</span>
                          )}
                        </td>

                        {/* Email / Note Column */}
                        <td className="py-0.5 px-2 max-w-[180px] truncate font-mono text-[10px] text-slate-600">
                          <div className="flex items-center space-x-1">
                            <span className="truncate">{displayEmail}</span>
                            {displayEmail !== '—' && (
                              <button
                                onClick={() => copyToClipboard(displayEmail, `email-${account.id}`)}
                                title="Copy Email / Account Note"
                                className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded hover:bg-slate-100"
                              >
                                {copiedId === `email-${account.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Followers Column */}
                        <td className="py-0.5 px-2 text-right whitespace-nowrap font-mono text-[10px] text-slate-700 font-bold">
                          {(account.followers / 1000).toFixed(1)}k
                        </td>

                        {/* Actions Column */}
                        <td className="py-0.5 px-2 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1">
                            {directUrl && (
                              <a
                                href={directUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="h-[22px] px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded flex items-center space-x-0.5 cursor-pointer border border-indigo-200"
                                title="Open Link"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                                <span>Open</span>
                              </a>
                            )}
                            <button
                              onClick={() => startEditAccount(brand.id, account)}
                              className="h-[22px] p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded cursor-pointer"
                              title="Edit Social Account"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(brand.id, account.id)}
                              className="h-[22px] p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Link"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                <PlaceholderRows count={socialBlankRows} colCount={7} rowHeight={30} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brand Cards Grid View */}
      {activeTab === 'brand_cards' && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {brands.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg">{b.logo}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{b.name}</h3>
                    {b.email && (
                      <p className="text-[10px] text-indigo-600 font-mono">{b.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                    {b.accounts?.length || 0} Channels
                  </span>
                  <button
                    onClick={() => handleDeleteBrand(b.id)}
                    title="Delete entire brand"
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                {b.accounts.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic py-2 text-center">
                    No channels registered yet for {b.name}.
                  </p>
                ) : (
                  b.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px]"
                    >
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {getPlatformBadge(acc.platform)}
                        <span className="font-mono font-bold truncate text-slate-900">{acc.handle}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {acc.directUrl && (
                          <a
                            href={acc.directUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline text-[10px] font-bold flex items-center space-x-0.5"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        <button
                          onClick={() => startEditAccount(b.id, acc)}
                          title="Edit link"
                          className="p-0.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(b.id, acc.id)}
                          title="Delete link"
                          className="p-0.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Video Script Generator Studio Tab */}
      {activeTab === 'ai_script_studio' && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left Panel: Google Sheet Tab Topics */}
          <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <div className="flex items-center space-x-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900">Google Sheet Tab Topics</h3>
              </div>
              <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                {currentBrand.name}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {(!departments || departments.length === 0) ? (
                <p className="text-[11px] text-slate-400 italic py-4 text-center">
                  No topics loaded from sheet.
                </p>
              ) : (
                departments.slice(0, 5).map((dept) =>
                  (dept.topics || []).slice(0, 3).map((t) => (
                    <div key={t.id} className="bg-slate-50 border border-slate-200 rounded p-1.5 space-y-1 text-[11px]">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-bold text-slate-900 leading-snug">{t.topic}</p>
                        <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1 rounded">
                          {t.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleGenerateClick(t.topic)}
                        disabled={isGenerating}
                        className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Generate Script with Gemini</span>
                      </button>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Right 2 Columns: Prompt Studio & Script Output Queue */}
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900">AI Social Script Generator</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Gemini 3.6 Flash</span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Target Channel</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['facebook', 'youtube', 'instagram', 'tiktok'] as const).map((plat) => (
                      <button
                        key={plat}
                        onClick={() => setSelectedPlatform(plat)}
                        className={`py-1 text-[11px] font-bold capitalize border rounded-md cursor-pointer transition ${
                          selectedPlatform === plat
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Video Topic Prompt</label>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={productContextPrompt}
                      onChange={(e) => setProductContextPrompt(e.target.value)}
                      placeholder="Enter viral topic or product highlight..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] rounded-md px-2 py-1 h-[30px] focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      onClick={() => handleGenerateClick()}
                      disabled={isGenerating || !productContextPrompt.trim()}
                      className="h-[30px] px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isGenerating ? 'Generating...' : 'Generate Script'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Scripts Output List */}
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1">
                Generated Scripts ({brandPosts.length} Items for {currentBrand.name})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {brandPosts.map((post) => (
                  <div key={post.id} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{post.title}</span>
                      {getPlatformBadge(post.platform)}
                    </div>
                    {post.script && (
                      <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[10px] text-slate-800 whitespace-pre-wrap">
                        {post.script}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Add or Edit Social Link */}
      {isAddLinkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-4 space-y-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5">
                <Link2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  {editingAccount ? 'Edit Social Account Link' : 'Add New Social Account Link'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSocialLink} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Select Brand</label>
                <select
                  value={linkFormBrandId}
                  onChange={(e) => setLinkFormBrandId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.logo} {b.name} ({b.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Platform</label>
                  <select
                    value={linkFormPlatform}
                    onChange={(e) => setLinkFormPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="x">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="other">Other Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Handle / Name</label>
                  <input
                    type="text"
                    value={linkFormHandle}
                    onChange={(e) => setLinkFormHandle(e.target.value)}
                    placeholder="@Peshadari or Channel Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Direct Source URL *</label>
                <input
                  type="url"
                  required
                  value={linkFormUrl}
                  onChange={(e) => setLinkFormUrl(e.target.value)}
                  placeholder="https://www.facebook.com/Peshadari"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 text-[10px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Account Email / Note</label>
                  <input
                    type="text"
                    value={linkFormEmail}
                    onChange={(e) => setLinkFormEmail(e.target.value)}
                    placeholder="sotikseba@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 text-[10px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Followers Count</label>
                  <input
                    type="number"
                    value={linkFormFollowers}
                    onChange={(e) => setLinkFormFollowers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLinkModalOpen(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer shadow-2xs"
                >
                  {editingAccount ? 'Save Changes' : 'Add Link to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Add New Brand */}
      {isAddBrandModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-4 space-y-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Add New Brand / Business</h3>
              </div>
              <button
                onClick={() => setIsAddBrandModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBrand} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brandFormName}
                  onChange={(e) => setBrandFormName(e.target.value)}
                  placeholder="e.g. Peshadari or HaldiCart"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Primary Email / Account Note</label>
                <input
                  type="text"
                  value={brandFormEmail}
                  onChange={(e) => setBrandFormEmail(e.target.value)}
                  placeholder="sotikseba@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Logo Emoji</label>
                  <input
                    type="text"
                    value={brandFormLogo}
                    onChange={(e) => setBrandFormLogo(e.target.value)}
                    placeholder="👑 or 🚀"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 focus:outline-none focus:border-indigo-500 text-center"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Niche / Industry</label>
                  <input
                    type="text"
                    value={brandFormNiche}
                    onChange={(e) => setBrandFormNiche(e.target.value)}
                    placeholder="Media & E-Commerce"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBrandModalOpen(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer shadow-2xs"
                >
                  Create Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
