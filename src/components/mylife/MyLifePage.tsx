import { useState } from 'react';
import {
  Heart,
  Users,
  CheckSquare,
  DollarSign,
  ShieldCheck,
  FileText,
  Calendar,
  Award,
  Home,
  Network,
  RotateCcw,
  Sparkles,
  GitFork
} from 'lucide-react';
import { useMyLifeStore } from './useMyLifeStore';
import { LifeOverview } from './LifeOverview';
import { PeopleManager } from './PeopleManager';
import { FamilyTree } from './FamilyTree';
import { TaskManager } from './TaskManager';
import { SharedFinanceManager } from './SharedFinanceManager';
import { InsuranceManager } from './InsuranceManager';
import { DocumentVault } from './DocumentVault';
import { ImportantDates } from './ImportantDates';
import { LifeEventsTimeline } from './LifeEventsTimeline';
import { LifeAssetsManager } from './LifeAssetsManager';
import { RelationshipGraphSearch } from './RelationshipGraphSearch';
import { Person } from '../../types';

interface MyLifePageProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export function MyLifePage({ activeSubTab: externalSubTab, onSubTabChange }: MyLifePageProps = {}) {
  const [internalTab, setInternalTab] = useState<
    | 'overview'
    | 'people'
    | 'tree'
    | 'tasks'
    | 'shared_finance'
    | 'insurance'
    | 'documents'
    | 'important_dates'
    | 'events'
    | 'assets'
    | 'graph_search'
  >('overview');

  const activeTab = (externalSubTab as any) || internalTab;

  const handleTabChange = (tab: any) => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const {
    people,
    tasks,
    sharedFinances,
    insurances,
    documents,
    importantDates,
    lifeEvents,
    assets,
    addPerson,
    updatePerson,
    deletePerson,
    addTask,
    updateTaskStatus,
    deleteTask,
    addSharedFinance,
    deleteSharedFinance,
    addInsurance,
    deleteInsurance,
    addDocument,
    deleteDocument,
    addImportantDate,
    deleteImportantDate,
    addLifeEvent,
    deleteLifeEvent,
    addAsset,
    deleteAsset,
    resetToSeedData
  } = useMyLifeStore();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isQuickAddTaskOpen, setIsQuickAddTaskOpen] = useState(false);

  const navTabs = [
    { id: 'overview', label: 'Life Command', icon: Heart },
    { id: 'people', label: 'Family & People', icon: Users, badge: people.length },
    { id: 'tree', label: 'Family Tree', icon: GitFork },
    { id: 'tasks', label: 'Tasks & Duties', icon: CheckSquare, badge: tasks.filter((t) => t.status !== 'Completed').length },
    { id: 'shared_finance', label: 'Shared Finance', icon: DollarSign },
    { id: 'insurance', label: 'Insurance Vault', icon: ShieldCheck, badge: insurances.filter((i) => i.status === 'Expiring Soon').length || null },
    { id: 'documents', label: 'Digital Documents', icon: FileText },
    { id: 'important_dates', label: 'Important Dates', icon: Calendar },
    { id: 'events', label: 'Life Milestones', icon: Award },
    { id: 'assets', label: 'Real Estate & Assets', icon: Home },
    { id: 'graph_search', label: 'Graph & Search', icon: Network }
  ];

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-slate-50 p-2 space-y-2">
      {/* Sub-Header Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center justify-between overflow-x-auto gap-1 shrink-0">
        <div className="flex items-center space-x-1 shrink-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge !== null && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (confirm('Reset My Life dataset to realistic default seed data?')) {
              resetToSeedData();
            }
          }}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer shrink-0"
          title="Reset Seed Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <LifeOverview
            people={people}
            tasks={tasks}
            sharedFinances={sharedFinances}
            insurances={insurances}
            importantDates={importantDates}
            lifeEvents={lifeEvents}
            onNavigateTab={(tab) => handleTabChange(tab as any)}
            onSelectPerson={(p) => {
              setSelectedPerson(p);
              handleTabChange('people');
            }}
            onOpenAddPerson={() => handleTabChange('people')}
            onOpenAddTask={() => setIsQuickAddTaskOpen(true)}
          />
        </div>
      )}

      {activeTab === 'people' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <PeopleManager
            people={people}
            tasks={tasks}
            sharedFinances={sharedFinances}
            insurances={insurances}
            documents={documents}
            importantDates={importantDates}
            lifeEvents={lifeEvents}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
            onAddPerson={addPerson}
            onUpdatePerson={updatePerson}
            onDeletePerson={deletePerson}
          />
        </div>
      )}

      {activeTab === 'tree' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <FamilyTree
            people={people}
            onSelectPerson={(p) => {
              setSelectedPerson(p);
              handleTabChange('people');
            }}
          />
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <TaskManager
            tasks={tasks}
            people={people}
            onAddTask={addTask}
            onUpdateTaskStatus={updateTaskStatus}
            onDeleteTask={deleteTask}
            isAddModalOpen={isQuickAddTaskOpen}
            onCloseAddModal={() => setIsQuickAddTaskOpen(false)}
          />
        </div>
      )}

      {activeTab === 'shared_finance' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <SharedFinanceManager
            sharedFinances={sharedFinances}
            people={people}
            onAddSharedFinance={addSharedFinance}
            onDeleteSharedFinance={deleteSharedFinance}
          />
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <InsuranceManager
            insurances={insurances}
            people={people}
            onAddInsurance={addInsurance}
            onDeleteInsurance={deleteInsurance}
          />
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <DocumentVault
            documents={documents}
            people={people}
            onAddDocument={addDocument}
            onDeleteDocument={deleteDocument}
          />
        </div>
      )}

      {activeTab === 'important_dates' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <ImportantDates
            importantDates={importantDates}
            people={people}
            onAddImportantDate={addImportantDate}
            onDeleteImportantDate={deleteImportantDate}
          />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <LifeEventsTimeline
            lifeEvents={lifeEvents}
            people={people}
            onAddLifeEvent={addLifeEvent}
            onDeleteLifeEvent={deleteLifeEvent}
          />
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <LifeAssetsManager
            assets={assets}
            people={people}
            onAddAsset={addAsset}
            onDeleteAsset={deleteAsset}
          />
        </div>
      )}

      {activeTab === 'graph_search' && (
        <div className="flex-1 overflow-y-auto pr-1">
          <RelationshipGraphSearch
            people={people}
            tasks={tasks}
            sharedFinances={sharedFinances}
            insurances={insurances}
            documents={documents}
            importantDates={importantDates}
            lifeEvents={lifeEvents}
            assets={assets}
            onNavigateTab={(tab) => handleTabChange(tab as any)}
            onSelectPerson={(p) => setSelectedPerson(p)}
          />
        </div>
      )}
    </div>
  );
}
