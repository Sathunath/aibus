import {
  Users,
  CheckSquare,
  ShieldCheck,
  DollarSign,
  Calendar,
  AlertTriangle,
  Heart,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  Person,
  LifeTask,
  LifeSharedFinance,
  InsurancePolicy,
  ImportantDate,
  LifeEvent
} from '../../types';

interface LifeOverviewProps {
  people: Person[];
  tasks: LifeTask[];
  sharedFinances: LifeSharedFinance[];
  insurances: InsurancePolicy[];
  importantDates: ImportantDate[];
  lifeEvents: LifeEvent[];
  onNavigateTab: (tab: string) => void;
  onSelectPerson: (person: Person) => void;
  onOpenAddPerson: () => void;
  onOpenAddTask: () => void;
}

export function LifeOverview({
  people,
  tasks,
  sharedFinances,
  insurances,
  importantDates,
  lifeEvents,
  onNavigateTab,
  onSelectPerson,
  onOpenAddPerson,
  onOpenAddTask
}: LifeOverviewProps) {
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High');
  const expiringInsurances = insurances.filter((i) => i.status === 'Expiring Soon');
  const totalSharedPool = sharedFinances.reduce((acc, sf) => acc + sf.totalAmount, 0);

  // Key relationships
  const mother = people.find((p) => p.relationship.toLowerCase().includes('mother'));
  const father = people.find((p) => p.relationship.toLowerCase().includes('father'));
  const wife = people.find((p) => p.relationship.toLowerCase().includes('wife'));
  const children = people.filter((p) =>
    ['son', 'daughter', 'child'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  return (
    <div className="space-y-3">
      {/* Top Header (Single 30px Bar) */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <h1 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            My Life & Family Command Center
          </h1>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Connects family, responsibilities, health insurance, shared finances & documents
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={onOpenAddPerson}
            className="h-[26px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Person</span>
          </button>
          <button
            onClick={onOpenAddTask}
            className="h-[22px] px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-md text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <CheckSquare className="w-3 h-3 text-indigo-600" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <Users className="w-3.5 h-3.5 text-indigo-600 mr-1" />
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{people.length}</span> FAMILY MEMBERS
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <CheckSquare className="w-3.5 h-3.5 text-indigo-600 mr-1" />
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{pendingTasks.length}</span> PENDING TASKS
        </div>

        {urgentTasks.length > 0 && (
          <div className="h-[28px] px-2.5 bg-rose-50 border border-rose-200 rounded-md inline-flex items-center text-[10px] font-bold text-rose-800 shadow-2xs whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 mr-1" />
            <span className="text-rose-900 font-extrabold text-xs mr-1.5">{urgentTasks.length}</span> URGENT TASKS
          </div>
        )}

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">${totalSharedPool.toLocaleString()}</span> SHARED POOL
        </div>

        {expiringInsurances.length > 0 && (
          <div className="h-[28px] px-2.5 bg-amber-50 border border-amber-200 rounded-md inline-flex items-center text-[10px] font-bold text-amber-800 shadow-2xs whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 mr-1" />
            <span className="text-amber-900 font-extrabold text-xs mr-1.5">{expiringInsurances.length}</span> POLICY EXPIRING
          </div>
        )}
      </div>

      {/* Urgent Alerts Banner if any */}
      {(expiringInsurances.length > 0 || urgentTasks.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Immediate Attention Required</p>
              <p className="text-xs text-amber-900 mt-0.5">
                {expiringInsurances.length > 0 && `${expiringInsurances.length} insurance policy is expiring soon. `}
                {urgentTasks.length > 0 && `${urgentTasks.length} high priority family task(s) pending.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {expiringInsurances.length > 0 && (
              <button
                onClick={() => onNavigateTab('insurance')}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Review Insurance
              </button>
            )}
            {urgentTasks.length > 0 && (
              <button
                onClick={() => onNavigateTab('tasks')}
                className="px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer"
              >
                View Tasks
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigateTab('people')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <Users className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{people.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Family & People</p>
        </div>

        <div
          onClick={() => onNavigateTab('tasks')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <CheckSquare className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{pendingTasks.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending Tasks</p>
        </div>

        <div
          onClick={() => onNavigateTab('insurance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{insurances.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Insurance Policies</p>
        </div>

        <div
          onClick={() => onNavigateTab('shared_finance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <DollarSign className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">${totalSharedPool.toLocaleString()}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Shared Finances</p>
        </div>

        <div
          onClick={() => onNavigateTab('important_dates')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <Calendar className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{importantDates.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Key Life Dates</p>
        </div>
      </div>

      {/* Immediate Family Spotlight Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-slate-900">Immediate Family Circle</h2>
          </div>
          <button
            onClick={() => onNavigateTab('people')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All ({people.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[mother, father, wife, ...children].filter(Boolean).map((person) => {
            if (!person) return null;
            const personTasks = tasks.filter((t) => t.personIds.includes(person.id) && t.status !== 'Completed');
            return (
              <div
                key={person.id}
                onClick={() => onSelectPerson(person)}
                className="bg-slate-50 hover:bg-indigo-50/50 rounded-xl p-4 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <img
                  src={person.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={person.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                      {person.relationship}
                    </span>
                    {personTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        {personTasks.length} Task
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate mt-1 group-hover:text-indigo-600 transition-colors">
                    {person.fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{person.occupation || 'Family Member'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Section: Pending Tasks & Recent Life Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Responsibilities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Life Tasks & Duties</h2>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>All Tasks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => {
                const assignedPeople = people.filter((p) => task.personIds.includes(p.id));
                return (
                  <div key={task.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'Urgent'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Due {task.dueDate}</span>
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{task.title}</p>
                      {assignedPeople.length > 0 && (
                        <div className="flex items-center space-x-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-medium">For:</span>
                          {assignedPeople.map((p) => (
                            <span key={p.id} className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                              {p.fullName} ({p.relationship})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onOpenAddTask}
            className="w-full mt-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Life Milestones & Events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">Life Milestones & Events</h2>
              </div>
              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Timeline View</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {lifeEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex items-center space-x-3">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {event.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{event.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{event.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('events')}
            className="w-full mt-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Explore Life Event History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
