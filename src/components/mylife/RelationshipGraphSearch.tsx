import { useState } from 'react';
import {
  Search,
  Users,
  CheckSquare,
  DollarSign,
  ShieldCheck,
  FileText,
  Calendar,
  Award,
  Home,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  Person,
  LifeTask,
  LifeSharedFinance,
  InsurancePolicy,
  LifeDocument,
  ImportantDate,
  LifeEvent,
  LifeAsset
} from '../../types';

interface RelationshipGraphSearchProps {
  people: Person[];
  tasks: LifeTask[];
  sharedFinances: LifeSharedFinance[];
  insurances: InsurancePolicy[];
  documents: LifeDocument[];
  importantDates: ImportantDate[];
  lifeEvents: LifeEvent[];
  assets: LifeAsset[];
  onNavigateTab: (tab: string) => void;
  onSelectPerson: (person: Person) => void;
}

export function RelationshipGraphSearch({
  people,
  tasks,
  sharedFinances,
  insurances,
  documents,
  importantDates,
  lifeEvents,
  assets,
  onNavigateTab,
  onSelectPerson
}: RelationshipGraphSearchProps) {
  const [globalQuery, setGlobalQuery] = useState('');
  const [selectedPersonNode, setSelectedPersonNode] = useState<Person | null>(people[0] || null);

  const q = globalQuery.toLowerCase().trim();

  // Search results
  const foundPeople = q
    ? people.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.relationship.toLowerCase().includes(q) ||
          (p.occupation && p.occupation.toLowerCase().includes(q))
      )
    : [];

  const foundTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    : [];

  const foundFinances = q
    ? sharedFinances.filter(
        (sf) => sf.title.toLowerCase().includes(q) || sf.type.toLowerCase().includes(q)
      )
    : [];

  const foundInsurances = q
    ? insurances.filter(
        (i) =>
          i.policyName.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.policyType.toLowerCase().includes(q)
      )
    : [];

  const foundDocs = q
    ? documents.filter(
        (d) => d.title.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q)
      )
    : [];

  const totalResultsCount =
    foundPeople.length +
    foundTasks.length +
    foundFinances.length +
    foundInsurances.length +
    foundDocs.length;

  return (
    <div className="space-y-6">
      {/* Header & Global Search Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-lg space-y-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Universal Connected Life Search Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Search Across Your Entire Life System</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Search any name, policy number, passport, document, financial amount, or event across all connected modules.
          </p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. Eleanor, Passport, BlueCross, Hawaii, 45000..."
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-indigo-400/30 text-white rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Instant Search Results Panel if searching */}
      {q !== '' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">
              Search Results ({totalResultsCount} items found for "{globalQuery}")
            </h2>
          </div>

          {totalResultsCount === 0 ? (
            <p className="text-xs text-slate-500 italic">No matching records found across your life system.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* People matches */}
              {foundPeople.length > 0 && (
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>People & Family ({foundPeople.length})</span>
                  </span>
                  {foundPeople.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onNavigateTab('people');
                        onSelectPerson(p);
                      }}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-extrabold text-slate-900">{p.fullName}</p>
                        <p className="text-[10px] text-slate-500">{p.relationship} • {p.occupation || 'Family Member'}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Task matches */}
              {foundTasks.length > 0 && (
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tasks & Reminders ({foundTasks.length})</span>
                  </span>
                  {foundTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onNavigateTab('tasks')}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-extrabold text-slate-900">{t.title}</p>
                        <p className="text-[10px] text-slate-500">Due: {t.dueDate} • Priority: {t.priority}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Insurance matches */}
              {foundInsurances.length > 0 && (
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Insurances ({foundInsurances.length})</span>
                  </span>
                  {foundInsurances.map((i) => (
                    <div
                      key={i.id}
                      onClick={() => onNavigateTab('insurance')}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-extrabold text-slate-900">{i.policyName}</p>
                        <p className="text-[10px] text-slate-500">{i.company} • Policy #{i.policyNumber}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Finance matches */}
              {foundFinances.length > 0 && (
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Shared Finances ({foundFinances.length})</span>
                  </span>
                  {foundFinances.map((sf) => (
                    <div
                      key={sf.id}
                      onClick={() => onNavigateTab('shared_finance')}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-extrabold text-slate-900">{sf.title}</p>
                        <p className="text-[10px] text-slate-500">${sf.totalAmount.toLocaleString()} • {sf.type}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connected Relationship Graph Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Interactive Relationship Node Explorer</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a family member below to see their real-time network of connected tasks, insurances, documents, and shared funds.
            </p>
          </div>
        </div>

        {/* Member selector pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {people.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonNode(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 flex items-center space-x-2 ${
                selectedPersonNode?.id === p.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <img
                src={p.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={p.fullName}
                className="w-5 h-5 rounded-full object-cover border border-white"
              />
              <span>{p.fullName} ({p.relationship})</span>
            </button>
          ))}
        </div>

        {/* Person Node Graph View */}
        {selectedPersonNode && (
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-inner space-y-6">
            {/* Center Node */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <img
                src={selectedPersonNode.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={selectedPersonNode.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-400 shadow-xl"
              />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
                {selectedPersonNode.relationship}
              </span>
              <h3 className="text-xl font-extrabold text-white">{selectedPersonNode.fullName}</h3>
              <p className="text-xs text-slate-400">{selectedPersonNode.occupation || 'Family Member'}</p>
            </div>

            {/* Connected Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-800">
              {/* Connected Tasks */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-indigo-300 flex items-center space-x-1">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tasks ({tasks.filter((t) => t.personIds.includes(selectedPersonNode.id)).length})</span>
                </span>
                {tasks.filter((t) => t.personIds.includes(selectedPersonNode.id)).length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No tasks connected.</p>
                ) : (
                  tasks
                    .filter((t) => t.personIds.includes(selectedPersonNode.id))
                    .map((t) => (
                      <p key={t.id} className="text-xs font-bold text-slate-200 truncate">• {t.title}</p>
                    ))
                )}
              </div>

              {/* Connected Insurances */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-emerald-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Insurance ({insurances.filter((i) => i.insuredPersonId === selectedPersonNode.id || i.beneficiaryPersonId === selectedPersonNode.id).length})</span>
                </span>
                {insurances.filter((i) => i.insuredPersonId === selectedPersonNode.id || i.beneficiaryPersonId === selectedPersonNode.id).length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No insurance policy.</p>
                ) : (
                  insurances
                    .filter((i) => i.insuredPersonId === selectedPersonNode.id || i.beneficiaryPersonId === selectedPersonNode.id)
                    .map((i) => (
                      <p key={i.id} className="text-xs font-bold text-slate-200 truncate">• {i.policyName}</p>
                    ))
                )}
              </div>

              {/* Connected Documents */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-300 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Documents ({documents.filter((d) => d.ownerPersonId === selectedPersonNode.id).length})</span>
                </span>
                {documents.filter((d) => d.ownerPersonId === selectedPersonNode.id).length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No documents attached.</p>
                ) : (
                  documents
                    .filter((d) => d.ownerPersonId === selectedPersonNode.id)
                    .map((d) => (
                      <p key={d.id} className="text-xs font-bold text-slate-200 truncate">• {d.title}</p>
                    ))
                )}
              </div>

              {/* Connected Shared Funds */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-rose-300 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                  <span>Shared Funds ({sharedFinances.filter((sf) => sf.memberIds.includes(selectedPersonNode.id)).length})</span>
                </span>
                {sharedFinances.filter((sf) => sf.memberIds.includes(selectedPersonNode.id)).length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No shared funds.</p>
                ) : (
                  sharedFinances
                    .filter((sf) => sf.memberIds.includes(selectedPersonNode.id))
                    .map((sf) => (
                      <p key={sf.id} className="text-xs font-bold text-slate-200 truncate">• {sf.title}</p>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
