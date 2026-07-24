import React, { useState, useEffect } from 'react';
import {
  Zap,
  Building2,
  Mail,
  Package,
  RefreshCw,
  Share2,
  Search,
  Workflow,
  Terminal,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ShieldAlert,
  Layers,
  OctagonX,
  FileSpreadsheet,
  UserCheck,
  Database,
  DollarSign,
  KeyRound,
  Heart,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  ShoppingBag,
  Sparkles,
  Briefcase,
  Edit3,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { Department } from '../types';

interface SubNavItem {
  id: string;
  label: string;
  badge?: string | number | null;
  children?: SubNavItem[];
}

interface NavItem {
  id: Department;
  label: string;
  iconName?: string;
  icon: React.ElementType;
  badge?: string | number | null;
  desc?: string;
  subTree?: SubNavItem[];
}

interface SidebarProps {
  activeTab: Department;
  setActiveTab: (tab: Department) => void;
  activeSubTab?: string;
  setActiveSubTab?: (subTab: string) => void;
  unassignedEmailsCount: number;
  pendingSupplierCount: number;
  isEmergencyStopped?: boolean;
  onItemSelect?: () => void;
}

const DEFAULT_ITEMS: NavItem[] = [
  {
    id: 'rc_supplier_list',
    label: 'RC Supplier List',
    icon: ShoppingBag,
    badge: '412 Verified',
    desc: 'Account Contacts & Supplier Database',
    subTree: [
      { id: 'clean_suppliers', label: 'Clean Suppliers', badge: '23' },
      { id: 'usa_suppliers', label: 'Likely USA', badge: '244' },
      { id: 'wholesalers', label: 'Wholesalers' },
      { id: 'fabric_suppliers', label: 'Fabric Suppliers' },
      { id: 'real_brands', label: 'Real Brands' },
      { id: 'wholesale_leads', label: 'Wholesale Leads', badge: '7' },
      { id: 'all_contacts', label: 'All Contacts', badge: '412' },
    ],
  },
  {
    id: 'social',
    label: 'Social Media Manager',
    icon: Share2,
    badge: '13 Accounts',
    desc: 'Brand-Wise Social Media Database',
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    badge: 'MySQL Live',
    desc: 'Transactions, Breakdown & Analytics',
  },
  {
    id: 'credentials_vault',
    label: 'Credentials & Pass Hints',
    icon: KeyRound,
    badge: '16 Accounts',
    desc: 'Account Hints & Recovery DB',
  },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  activeSubTab = 'overview',
  setActiveSubTab,
  unassignedEmailsCount,
  pendingSupplierCount,
  isEmergencyStopped = false,
  onItemSelect,
}: SidebarProps) {
  // Collapse state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Dynamic Nav Items persisted in localStorage
  const [itemsList, setItemsList] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem('sidebar_nav_items_v9');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map back icon components & subTree
        return parsed.map((item: any) => {
          const defaultRef = DEFAULT_ITEMS.find((d) => d.id === item.id);
          return {
            ...item,
            subTree: item.subTree || defaultRef?.subTree,
            icon: item.id === 'rc_supplier_list' ? ShoppingBag :
                  item.id === 'social' ? Share2 :
                  item.id === 'finance' ? DollarSign :
                  item.id === 'credentials_vault' ? KeyRound : Database
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ITEMS;
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ label: '', desc: '', badge: '' });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_collapsed', String(next));
      } catch {
        // fallback
      }
      return next;
    });
  };

  // Save itemsList to localStorage
  useEffect(() => {
    try {
      const serializable = itemsList.map(({ icon, ...rest }) => rest);
      localStorage.setItem('sidebar_nav_items_v9', JSON.stringify(serializable));
    } catch (e) {
      console.error(e);
    }
  }, [itemsList]);

  // Collapsible sub-menu state
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    command_center: true,
    my_life: true,
    finance: true,
  });

  // Collapsible level-3 sub-item state
  const [expandedSubItems, setExpandedSubItems] = useState<Record<string, boolean>>({
    rc_supplier_list: true,
  });

  const toggleSubItemExpand = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubItems((prev) => ({
      ...prev,
      [subId]: prev[subId] === undefined ? false : !prev[subId],
    }));
  };

  // Auto-expand active parent item on tab change
  useEffect(() => {
    if (activeTab) {
      setExpandedMenus((prev) => ({
        ...prev,
        [activeTab]: true,
      }));
    }
  }, [activeTab]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleParentClick = (item: NavItem) => {
    setActiveTab(item.id);
    setExpandedMenus((prev) => ({
      ...prev,
      [item.id]: true,
    }));

    if (item.subTree && item.subTree.length > 0 && setActiveSubTab) {
      const exists = item.subTree.some((sub) => sub.id === activeSubTab);
      if (!exists) {
        setActiveSubTab(item.subTree[0].id);
      }
    }
    if (onItemSelect) {
      onItemSelect();
    }
  };

  const handleSubClick = (parentId: Department, subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(parentId);
    if (setActiveSubTab) {
      setActiveSubTab(subId);
    }
    if (onItemSelect) {
      onItemSelect();
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this menu item from sidebar?')) {
      const updated = itemsList.filter((it) => it.id !== id);
      setItemsList(updated);
      if (activeTab === id && updated.length > 0) {
        setActiveTab(updated[0].id);
      }
    }
  };

  const startEditItem = (item: NavItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setEditFormData({
      label: item.label,
      desc: item.desc || '',
      badge: String(item.badge || '')
    });
  };

  const saveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemId) return;

    setItemsList((prev) =>
      prev.map((it) =>
        it.id === editingItemId
          ? { ...it, label: editFormData.label, desc: editFormData.desc, badge: editFormData.badge || undefined }
          : it
      )
    );
    setEditingItemId(null);
  };

  const primaryNavItems: NavItem[] = [
    {
      id: 'proj_hardicart',
      label: 'Hardicart Project',
      icon: ShoppingBag,
      badge: 'eCommerce',
      desc: 'Store Ops, Orders & RC Supplier Database',
      subTree: [
        { id: 'overview', label: 'Project Tasks & Overview' },
        {
          id: 'rc_supplier_list',
          label: 'RC Supplier List',
          badge: '412 Verified',
        },
      ],
    },
    {
      id: 'proj_ai_earning',
      label: 'AI Earning LTD Project',
      icon: Sparkles,
      badge: 'AI Business',
      desc: 'Automation & Client Acquisition',
    },
    {
      id: 'proj_peshadari',
      label: 'Peshadari Project',
      icon: Briefcase,
      badge: 'Media',
      desc: 'Professional Career & Media Content',
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
      badge: 'MySQL Live',
      desc: 'Transactions, Breakdown & Analytics',
    },
    {
      id: 'credentials_vault',
      label: 'Credentials & Pass Hints',
      icon: KeyRound,
      badge: '16 Accounts',
      desc: 'Account Hints & Recovery DB',
    },
    {
      id: 'db_diagnostics',
      label: 'Database & Storage Status',
      icon: Database,
      badge: 'MySQL Live',
      desc: 'Database Health & Storage Status',
    },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      {isCollapsed ? (
        <div className="py-2 flex items-center justify-center">
          <div className="w-8 border-t border-slate-200" title={title} />
        </div>
      ) : (
        <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          {title}
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon;
        const isActiveParent = activeTab === item.id;
        const isExpanded = !!expandedMenus[item.id];
        const hasSubTree = item.subTree && item.subTree.length > 0;

        if (isCollapsed) {
          // Collapsed Icon-Only View with Tooltip
          return (
            <div key={item.id} className="relative group">
              <button
                id={`nav-${item.id}`}
                onClick={() => handleParentClick(item)}
                className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer relative ${
                  isActiveParent
                    ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 ring-2 ring-white rounded-full" />
                )}
              </button>

              {/* Hover Tooltip Popover */}
              <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-slate-900 text-white rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[180px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-white">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.desc && <p className="text-[10px] text-slate-300 mb-2">{item.desc}</p>}

                {hasSubTree && (
                  <div className="pt-1.5 border-t border-slate-700/60 space-y-1">
                    {item.subTree!.map((sub) => {
                      const isSubActive = isActiveParent && activeSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => handleSubClick(item.id, sub.id, e)}
                          className={`w-full text-left px-2 py-1 rounded text-[10px] transition flex items-center justify-between cursor-pointer ${
                            isSubActive
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && <span className="text-[8px] opacity-80">{sub.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Expanded View
        return (
          <div key={item.id} className="space-y-0.5">
            {/* Main Category Header Button */}
            <div
              id={`nav-${item.id}`}
              onClick={() => handleParentClick(item)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                isActiveParent
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActiveParent ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <div className="truncate">
                  <p className="text-xs leading-tight truncate">{item.label}</p>
                  {item.desc && (
                    <p
                      className={`text-[10px] truncate font-normal ${
                        isActiveParent ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActiveParent
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Edit & Delete Actions for sidebar menu items */}
                <div className="hidden group-hover:flex items-center space-x-0.5 ml-1">
                  <button
                    type="button"
                    onClick={(e) => startEditItem(item, e)}
                    className={`p-1 rounded hover:bg-white/30 cursor-pointer ${
                      isActiveParent ? 'text-white' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                    title="Edit menu title & description"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className={`p-1 rounded hover:bg-white/30 cursor-pointer ${
                      isActiveParent ? 'text-white' : 'text-slate-400 hover:text-red-600'
                    }`}
                    title="Delete menu item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {hasSubTree ? (
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(item.id, e)}
                    className={`p-1 rounded-md transition hover:bg-white/20 cursor-pointer ${
                      isActiveParent ? 'text-white' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={isExpanded ? 'Collapse sub-menu' : 'Expand sub-menu'}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isActiveParent ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Sub-Menu Nested Tree */}
            {hasSubTree && isExpanded && (
              <div className="ml-4 pl-3 border-l-2 border-indigo-200/80 space-y-1 py-1 my-0.5">
                {item.subTree!.map((sub) => {
                  const hasChildren = Boolean(sub.children && sub.children.length > 0);
                  const isSubExpanded = expandedSubItems[sub.id] !== false;
                  const isSubActive =
                    isActiveParent &&
                    (activeSubTab === sub.id ||
                      (hasChildren && sub.children?.some((c) => c.id === activeSubTab)));

                  if (hasChildren) {
                    return (
                      <div key={sub.id} className="space-y-1">
                        <div
                          onClick={(e) => handleSubClick(item.id, sub.id, e)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSubActive
                              ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubActive ? 'bg-indigo-600' : 'bg-indigo-400'
                              }`}
                            />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {sub.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full">
                                {sub.badge}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => toggleSubItemExpand(sub.id, e)}
                              className="p-0.5 rounded hover:bg-indigo-100 text-indigo-600 transition"
                              title={isSubExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isSubExpanded ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Nested Level 3 Children */}
                        {isSubExpanded && (
                          <div className="ml-3 pl-2 border-l border-indigo-200/60 space-y-0.5 my-0.5">
                            {sub.children!.map((child) => {
                              const isChildActive = isActiveParent && activeSubTab === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={(e) => handleSubClick(item.id, child.id, e)}
                                  className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all flex items-center justify-between cursor-pointer ${
                                    isChildActive
                                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                                  }`}
                                >
                                  <div className="flex items-center space-x-1.5 truncate">
                                    <span
                                      className={`w-1 h-1 rounded-full shrink-0 ${
                                        isChildActive ? 'bg-white' : 'bg-slate-300'
                                      }`}
                                    />
                                    <span className="truncate">{child.label}</span>
                                  </div>
                                  {child.badge && (
                                    <span
                                      className={`text-[8px] font-semibold px-1 rounded ${
                                        isChildActive
                                          ? 'bg-indigo-700 text-indigo-100'
                                          : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={sub.id}
                      onClick={(e) => handleSubClick(item.id, sub.id, e)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSubActive
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSubActive ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full">
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <aside
      id="sidebar-nav"
      className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out md:sticky md:top-[42px] md:h-[calc(100vh-42px)] md:overflow-hidden ${
        isCollapsed ? 'w-full md:w-16' : 'w-full md:w-64'
      }`}
    >
      {/* System Operational Header with Collapse Toggle */}
      <div className="p-1.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-1.5">
        {!isCollapsed && (
          <div
            className={`flex-1 rounded-lg p-1.5 border flex items-center justify-between ${
              isEmergencyStopped
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center space-x-1.5 truncate">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isEmergencyStopped ? 'bg-red-600' : 'bg-emerald-500 animate-ping'
                }`}
              ></div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                  {isEmergencyStopped ? 'SYSTEM HALTED' : 'AI Agent Network'}
                </p>
                <p className="text-[9px] text-slate-500 truncate leading-tight">
                  {isEmergencyStopped ? '0/14 Active' : '14 Multi-Layer Agents'}
                </p>
              </div>
            </div>
            {isEmergencyStopped ? (
              <OctagonX className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
          </div>
        )}

        {/* Dedicated Collapse Icon Toggle Button */}
        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition shadow-2xs cursor-pointer flex items-center justify-center shrink-0 ${
            isCollapsed ? 'w-full py-1.5 bg-indigo-50/60 border-indigo-200 text-indigo-700' : ''
          }`}
          title={isCollapsed ? 'Expand Admin Sidebar' : 'Collapse Admin Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-indigo-600" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Primary Navigation Hub */}
      <nav className="flex-1 overflow-y-auto p-1.5 space-y-2">
        {renderNavGroup('Projects & Operations', itemsList)}
      </nav>

      {/* Quick Edit Modal */}
      {editingItemId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900">Edit Menu Item</h3>
              <button onClick={() => setEditingItemId(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={saveEditItem} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Menu Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.label}
                  onChange={(e) => setEditFormData({ ...editFormData, label: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={editFormData.desc}
                  onChange={(e) => setEditFormData({ ...editFormData, desc: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editFormData.badge}
                  onChange={(e) => setEditFormData({ ...editFormData, badge: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItemId(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Warning Footer */}
      <div className="p-1.5 border-t border-slate-200 bg-slate-50/80">
        {isCollapsed ? (
          <div className="flex justify-center" title="USA Business Hours Active (EST/PST)">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          </div>
        ) : (
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
              <span>USA Business Hours Active</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset sidebar menu list to default items?')) {
                  setItemsList(DEFAULT_ITEMS);
                }
              }}
              className="text-[9px] text-slate-400 hover:text-indigo-600 font-medium underline cursor-pointer"
            >
              Reset Menu
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
