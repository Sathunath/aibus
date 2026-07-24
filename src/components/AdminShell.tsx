import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GlobalSearchModal } from './GlobalSearchModal';
import {
  ShoppingBag,
  Share2,
  DollarSign,
  Heart,
  KeyRound,
  Zap,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Brand, Department, Supplier, ProductItem, EmailMessage, CredentialVaultItem, SEOArticle, AIAgent } from '../types';

interface AdminShellProps {
  children: React.ReactNode;
  activeTab: Department;
  setActiveTab: (tab: Department) => void;
  activeSubTab?: string;
  setActiveSubTab?: (subTab: string) => void;
  onPerformFullSearch?: (query: string) => void;
  brands: Brand[];
  activeBrandId: string;
  setActiveBrandId: (id: string) => void;
  activeAgentsCount: number;
  totalAgentsCount: number;
  onTriggerAllAgents: () => void;
  isEmergencyStopped?: boolean;
  onToggleStopAllTasks?: () => void;
  unassignedEmailsCount: number;
  pendingSupplierCount: number;
  suppliers?: Supplier[];
  products?: ProductItem[];
  emails?: EmailMessage[];
  credentials?: CredentialVaultItem[];
  seoArticles?: SEOArticle[];
  workflows?: any[];
  agents?: AIAgent[];
}

export function AdminShell({
  children,
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  onPerformFullSearch,
  brands,
  activeBrandId,
  setActiveBrandId,
  activeAgentsCount,
  totalAgentsCount,
  onTriggerAllAgents,
  isEmergencyStopped = false,
  onToggleStopAllTasks,
  unassignedEmailsCount,
  pendingSupplierCount,
  suppliers = [],
  products = [],
  emails = [],
  credentials = [],
  seoArticles = [],
  workflows = [],
  agents = [],
}: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut for Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Bottom Navigation Quick Access Items
  const quickNavItems = [
    { id: 'rc_supplier_list' as Department, label: 'Suppliers', icon: ShoppingBag },
    { id: 'social' as Department, label: 'Social Media', icon: Share2 },
    { id: 'finance' as Department, label: 'Finance', icon: DollarSign },
    { id: 'credentials_vault' as Department, label: 'Credentials', icon: KeyRound },
    { id: 'command_center' as Department, label: 'Command', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Persistent Sticky Top Header */}
      <Header
        brands={brands}
        activeBrandId={activeBrandId}
        setActiveBrandId={setActiveBrandId}
        activeAgentsCount={activeAgentsCount}
        totalAgentsCount={totalAgentsCount}
        onTriggerAllAgents={onTriggerAllAgents}
        isEmergencyStopped={isEmergencyStopped}
        onToggleStopAllTasks={onToggleStopAllTasks}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Intelligent Universal Database Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={setActiveTab}
        setActiveSubTab={setActiveSubTab}
        onPerformFullSearch={(query) => {
          if (onPerformFullSearch) {
            onPerformFullSearch(query);
          } else {
            setActiveTab('search_results');
          }
          setIsSearchOpen(false);
        }}
        suppliers={suppliers}
        products={products}
        emails={emails}
        credentials={credentials}
        brands={brands}
        seoArticles={seoArticles}
        workflows={workflows}
        agents={agents}
      />

      {/* Main Responsive Shell Container */}
      <div className="flex-1 w-full flex flex-col lg:flex-row min-h-0 lg:overflow-hidden relative">
        {/* Desktop & Tablet Navigation Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            unassignedEmailsCount={unassignedEmailsCount}
            pendingSupplierCount={pendingSupplierCount}
            isEmergencyStopped={isEmergencyStopped}
          />
        </div>

        {/* Facebook-Style Mobile Slide-In Overlay Drawer (<1024px) */}
        <div className="lg:hidden">
          {/* Dark Scrim Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-250 ease-out ${
              isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden="true"
          />

          {/* Slide-In Menu Panel */}
          <div
            className={`fixed top-0 bottom-0 left-0 z-50 w-[clamp(270px,82vw,320px)] bg-white shadow-2xl flex flex-col border-r border-slate-200 transition-transform duration-250 ease-out transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Drawer Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-indigo-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xs font-black tracking-tight text-white">IDSOFT / HaldiCart</h2>
                  <p className="text-[9px] text-slate-300 font-bold uppercase">Mobile Navigation</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                unassignedEmailsCount={unassignedEmailsCount}
                pendingSupplierCount={pendingSupplierCount}
                isEmergencyStopped={isEmergencyStopped}
                onItemSelect={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Drawer Footer Status */}
            <div className="p-2 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-medium">HaldiCart Admin Operating System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Slot */}
        <main
          id="main-content-workspace"
          className="flex-1 w-full min-w-0 p-0 bg-white overflow-hidden lg:h-[calc(100vh-38px)] lg:max-h-[calc(100vh-38px)] pb-14 lg:pb-0 transition-all duration-200 flex flex-col"
        >
          {children}
        </main>
      </div>

      {/* Facebook-Style Mobile Bottom Navigation Bar (<1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-14 flex items-center justify-around px-2 shadow-lg">
        {quickNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-full h-full py-1 text-[10px] font-bold transition-all cursor-pointer ${
                isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  isActive ? 'bg-indigo-50 border border-indigo-200 text-indigo-600 scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[64px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Hamburger Drawer Toggle Button in Bottom Nav */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center w-full h-full py-1 text-[10px] font-bold transition-all cursor-pointer ${
            isMobileMenuOpen ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1 rounded-full transition-all ${
              isMobileMenuOpen ? 'bg-indigo-50 border border-indigo-200 text-indigo-600 scale-105' : ''
            }`}
          >
            <Menu className="w-4 h-4" />
          </div>
          <span className="truncate max-w-[64px] leading-tight mt-0.5">More</span>
        </button>
      </nav>
    </div>
  );
}
