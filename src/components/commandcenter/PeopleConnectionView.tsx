import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  CheckCircle2,
  Heart,
  Briefcase
} from 'lucide-react';
import { Workspace, UniversalTask } from './commandCenterTypes';

interface PersonRecord {
  id: string;
  name: string;
  role: string;
  category: 'Family' | 'Employee' | 'Freelancer' | 'Partner' | 'Client' | 'Supplier';
  email?: string;
  phone?: string;
  workspaceIds: string[];
}

const initialPeopleSeed: PersonRecord[] = [
  {
    id: 'p-1',
    name: 'You (Command Owner)',
    role: 'Founder & CEO',
    category: 'Partner',
    email: 'owner@ai-earning.com',
    workspaceIds: ['ws-ai-earning', 'ws-peshadari', 'ws-sonali-insurance', 'ws-drpshop', 'ws-job-news', 'ws-product-review']
  },
  {
    id: 'p-2',
    name: 'Sonali (Spouse)',
    role: 'Co-Director Insurance & Marketing',
    category: 'Family',
    email: 'sonali@insurance.com',
    workspaceIds: ['ws-sonali-insurance', 'ws-peshadari']
  },
  {
    id: 'p-3',
    name: 'Alex Rivera',
    role: 'Lead Full-Stack AI Developer',
    category: 'Employee',
    email: 'alex@tech.com',
    workspaceIds: ['ws-ai-earning', 'ws-drpshop']
  }
];

interface PeopleConnectionViewProps {
  workspaces: Workspace[];
  tasks: UniversalTask[];
  onOpenConnectModal: (type: string, id: string) => void;
}

export function PeopleConnectionView({
  workspaces,
  tasks,
  onOpenConnectModal
}: PeopleConnectionViewProps) {
  const [people, setPeople] = useState<PersonRecord[]>(initialPeopleSeed);

  return (
    <div className="space-y-3 text-[11px]">
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-600" />
            <span>People & Team Matrix</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Connect family members, employees, partners & freelancers across multiple businesses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {people.map((p) => {
          const connectedWs = workspaces.filter((w) => p.workspaceIds.includes(w.id));
          const personTasks = tasks.filter((t) => t.assignedPersonIds.includes(p.id));

          return (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between gap-1.5 mb-1">
                <div>
                  <span className="text-[8px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded uppercase">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-[12px] mt-0.5">{p.name}</h3>
                  <span className="text-[9px] text-slate-500 block">{p.role}</span>
                </div>

                <button
                  onClick={() => onOpenConnectModal('person', p.id)}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-medium rounded border hover:border-indigo-500 shrink-0"
                >
                  + Connect
                </button>
              </div>

              {/* Connected Workspaces */}
              <div className="my-1.5">
                <span className="text-[8px] text-slate-400 font-bold uppercase block mb-0.5">Assigned Businesses:</span>
                <div className="flex flex-wrap gap-1">
                  {connectedWs.map((ws) => (
                    <span
                      key={ws.id}
                      className="text-[8px] px-1.5 py-0.2 text-white font-medium rounded truncate"
                      style={{ backgroundColor: ws.color }}
                    >
                      {ws.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[9px] text-slate-500">
                <span className="font-semibold text-indigo-700">{personTasks.length} Assigned Tasks</span>
                <span className="font-mono">{p.email}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
