import {
  Users,
  Heart,
  User,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Person } from '../../types';

interface FamilyTreeProps {
  people: Person[];
  onSelectPerson: (person: Person) => void;
}

export function FamilyTree({ people, onSelectPerson }: FamilyTreeProps) {
  // Group people into generational levels
  const grandparents = people.filter((p) =>
    ['grandfather', 'grandmother', 'grandparent'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  const parents = people.filter((p) =>
    ['mother', 'father', 'parent', 'stepmother', 'stepfather'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  const spouseAndSelf = people.filter((p) =>
    ['wife', 'husband', 'future wife', 'spouse', 'fiance', 'partner'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  const siblings = people.filter((p) =>
    ['brother', 'sister', 'sibling'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  const children = people.filter((p) =>
    ['son', 'daughter', 'child', 'kid'].some((r) => p.relationship.toLowerCase().includes(r))
  );

  const relativesAndOthers = people.filter(
    (p) =>
      !grandparents.includes(p) &&
      !parents.includes(p) &&
      !spouseAndSelf.includes(p) &&
      !siblings.includes(p) &&
      !children.includes(p)
  );

  const renderPersonCard = (person: Person, highlightColor: string = 'border-indigo-200 bg-white') => (
    <div
      key={person.id}
      onClick={() => onSelectPerson(person)}
      className={`p-3.5 rounded-2xl border ${highlightColor} hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex items-center space-x-3 w-56 group relative z-10`}
    >
      <img
        src={
          person.photoUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        }
        alt={person.fullName}
        className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          {person.relationship}
        </span>
        <p className="text-xs font-extrabold text-slate-900 truncate mt-0.5 group-hover:text-indigo-600 transition-colors">
          {person.fullName}
        </p>
        <p className="text-[10px] text-slate-500 truncate">{person.occupation || 'Family Member'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Interactive Family Tree & Lineage</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual generational structure connecting your parents, spouse, siblings, and children.
          </p>
        </div>
        <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Click any node to view full relationship profile</span>
        </div>
      </div>

      {/* Visual Tree Canvas Container */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white border border-slate-800 shadow-xl overflow-x-auto min-w-[700px]">
        <div className="flex flex-col items-center space-y-10 relative">
          {/* Generation 1: Grandparents */}
          {grandparents.length > 0 && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                Generation I • Grandparents
              </span>
              <div className="flex items-center gap-6 pt-2">
                {grandparents.map((p) => renderPersonCard(p, 'bg-slate-800/90 border-slate-700 text-white'))}
              </div>
              <div className="w-0.5 h-6 bg-indigo-500/50 my-1"></div>
            </div>
          )}

          {/* Generation 2: Parents */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
              Generation II • Parents
            </span>
            <div className="flex items-center gap-6 pt-2">
              {parents.map((p) => renderPersonCard(p, 'bg-slate-800/90 border-indigo-500/50 text-white'))}
            </div>
            <div className="w-0.5 h-8 bg-indigo-500/60 my-1"></div>
          </div>

          {/* Generation 3: Me, Spouse & Siblings */}
          <div className="flex flex-col items-center space-y-2 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Generation III • Me, Spouse & Siblings
            </span>

            <div className="flex items-center justify-center gap-8 pt-2 flex-wrap">
              {/* User Self Node */}
              <div className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-950/80 text-white shadow-lg flex items-center space-x-3 w-60">
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-slate-900 font-extrabold flex items-center justify-center shrink-0 text-sm">
                  ME
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-900 px-2 py-0.5 rounded-full">
                    Primary Account Owner
                  </span>
                  <p className="text-xs font-extrabold text-white mt-1">You (System Owner)</p>
                  <p className="text-[10px] text-emerald-200">Life OS Center</p>
                </div>
              </div>

              {/* Spouse Nodes */}
              {spouseAndSelf.map((p) => renderPersonCard(p, 'bg-rose-950/80 border-rose-500/60 text-white'))}

              {/* Sibling Nodes */}
              {siblings.map((p) => renderPersonCard(p, 'bg-slate-800/90 border-slate-700 text-white'))}
            </div>

            {children.length > 0 && <div className="w-0.5 h-8 bg-indigo-500/60 my-1"></div>}
          </div>

          {/* Generation 4: Children */}
          {children.length > 0 && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
                Generation IV • Children & Future Generation
              </span>
              <div className="flex items-center gap-6 pt-2">
                {children.map((p) => renderPersonCard(p, 'bg-slate-800/90 border-amber-500/50 text-white'))}
              </div>
            </div>
          )}

          {/* Extended Relatives Section if present */}
          {relativesAndOthers.length > 0 && (
            <div className="pt-8 border-t border-slate-800 w-full">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Extended Family & Friends Circle
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {relativesAndOthers.map((p) => renderPersonCard(p, 'bg-slate-800/70 border-slate-700 text-white'))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
