import { useState, FormEvent } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  X,
  Edit2,
  Trash2,
  CheckSquare,
  DollarSign,
  ShieldCheck,
  FileText,
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import {
  Person,
  LifeTask,
  LifeSharedFinance,
  InsurancePolicy,
  LifeDocument,
  ImportantDate,
  LifeEvent
} from '../../types';
import { AdminDataTable, Column } from '../AdminDataTable';

interface PeopleManagerProps {
  people: Person[];
  tasks: LifeTask[];
  sharedFinances: LifeSharedFinance[];
  insurances: InsurancePolicy[];
  documents: LifeDocument[];
  importantDates: ImportantDate[];
  lifeEvents: LifeEvent[];
  selectedPerson: Person | null;
  onSelectPerson: (person: Person | null) => void;
  onAddPerson: (person: Omit<Person, 'id' | 'createdAt'>) => void;
  onUpdatePerson: (id: string, updated: Partial<Person>) => void;
  onDeletePerson: (id: string) => void;
}

export function PeopleManager({
  people,
  tasks,
  sharedFinances,
  insurances,
  documents,
  importantDates,
  lifeEvents,
  selectedPerson,
  onSelectPerson,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson
}: PeopleManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Female' as Person['gender'],
    relationship: 'Mother',
    category: 'Immediate Family' as Person['category'],
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    country: 'United States',
    occupation: '',
    notes: '',
    photoUrl: ''
  });

  const openAddForm = () => {
    setEditingPerson(null);
    setFormData({
      fullName: '',
      gender: 'Female',
      relationship: 'Mother',
      category: 'Immediate Family',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      country: 'United States',
      occupation: '',
      notes: '',
      photoUrl: ''
    });
    setIsFormOpen(true);
  };

  const openEditForm = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      fullName: person.fullName,
      gender: person.gender,
      relationship: person.relationship,
      category: person.category,
      dateOfBirth: person.dateOfBirth || '',
      phone: person.phone || '',
      email: person.email || '',
      address: person.address || '',
      country: person.country || 'United States',
      occupation: person.occupation || '',
      notes: person.notes || '',
      photoUrl: person.photoUrl || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.relationship.trim()) return;

    if (editingPerson) {
      onUpdatePerson(editingPerson.id, formData);
      if (selectedPerson?.id === editingPerson.id) {
        onSelectPerson({ ...editingPerson, ...formData });
      }
    } else {
      onAddPerson({
        ...formData,
        photoUrl:
          formData.photoUrl ||
          (formData.gender === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200')
      });
    }
    setIsFormOpen(false);
  };

  const filteredPeople = people.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.occupation && p.occupation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const columns: Column<Person>[] = [
    {
      id: 'member',
      header: 'Member',
      cell: (person) => (
        <div className="flex items-center space-x-3">
          <img
            src={
              person.photoUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            }
            alt={person.fullName}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <p className="font-extrabold text-slate-900 text-xs">{person.fullName}</p>
            <p className="text-[10px] text-slate-500">{person.occupation || 'Family Member'}</p>
          </div>
        </div>
      ),
      width: '180px',
    },
    {
      id: 'relationship',
      header: 'Relationship & Category',
      cell: (person) => (
        <div className="space-y-0.5">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {person.relationship}
          </span>
          <p className="text-[10px] text-slate-400 font-semibold">{person.category}</p>
        </div>
      ),
      width: '150px',
    },
    {
      id: 'contact',
      header: 'Contact & Details',
      cell: (person) => (
        <div className="space-y-0.5 text-[11px] text-slate-600">
          {person.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{person.phone}</span>
            </div>
          )}
          {person.email && (
            <div className="flex items-center space-x-1 truncate max-w-[180px]">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{person.email}</span>
            </div>
          )}
          {person.dateOfBirth && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[10px] font-mono">DOB: {person.dateOfBirth}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'connected',
      header: 'Connected Items',
      cell: (person) => {
        const personTasks = tasks.filter((t) => t.personIds.includes(person.id) && t.status !== 'Completed');
        const personDocs = documents.filter((d) => d.ownerPersonId === person.id);
        const personIns = insurances.filter((i) => i.insuredPersonId === person.id);
        return (
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span className="flex items-center space-x-1" title="Pending Tasks">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-bold">{personTasks.length}</span>
            </span>
            <span className="flex items-center space-x-1" title="Insurance Policies">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold">{personIns.length}</span>
            </span>
            <span className="flex items-center space-x-1" title="Documents">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold">{personDocs.length}</span>
            </span>
          </div>
        );
      },
      width: '140px',
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (person) => (
        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEditForm(person)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Edit Person"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete profile for ${person.fullName}?`)) {
                onDeletePerson(person.id);
                if (selectedPerson?.id === person.id) onSelectPerson(null);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            title="Delete Person"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectPerson(person)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="View Profile Drawer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ),
      width: '110px',
    }
  ];

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden space-y-2">
      {/* Header Bar (Single 30px Bar) */}
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-indigo-600 shrink-0" />
          <h1 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Family & Relationships Directory
          </h1>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Profiles for family members, friends, and custom relationships
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openAddForm}
            className="h-[26px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{people.length}</span> TOTAL PROFILES
        </div>

        <div className="h-[28px] px-2.5 bg-indigo-50 border border-indigo-200 rounded-md inline-flex items-center text-[10px] font-bold text-indigo-800 shadow-2xs whitespace-nowrap">
          <span className="text-indigo-900 font-extrabold text-xs mr-1.5">{people.filter((p) => p.category === 'Immediate Family').length}</span> IMMEDIATE FAMILY
        </div>

        <div className="h-[28px] px-2.5 bg-purple-50 border border-purple-200 rounded-md inline-flex items-center text-[10px] font-bold text-purple-800 shadow-2xs whitespace-nowrap">
          <span className="text-purple-900 font-extrabold text-xs mr-1.5">{people.filter((p) => p.category === 'Extended Family' || p.category === 'Relative').length}</span> EXTENDED FAMILY
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{people.filter((p) => p.category === 'Friend').length}</span> FRIENDS & OTHER
        </div>
      </div>

      {/* Search and Filters (28px Filter Bar) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs shrink-0">
        <div className="relative w-full sm:w-72">
          <Search className="w-3 h-3 absolute left-2 top-1.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, relationship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-[22px] pl-6 pr-2 bg-slate-50 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'Immediate Family', 'Extended Family', 'Relative', 'Friend', 'Other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-[22px] px-2 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* People Table View */}
      <div className="flex-1 min-h-0 flex flex-col">
        <AdminDataTable<Person>
          columns={columns}
          data={filteredPeople}
          rowHeight={48}
          zebra={true}
          onRowClick={(person) => onSelectPerson(person)}
          activeRowId={selectedPerson?.id}
          defaultPageSize={25}
        />
      </div>

      {/* Person Detail Side Drawer Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    selectedPerson.photoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={selectedPerson.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400 shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      {selectedPerson.relationship}
                    </span>
                    <span className="text-xs text-slate-400">{selectedPerson.category}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{selectedPerson.fullName}</h2>
                  <p className="text-xs text-indigo-200">{selectedPerson.occupation || 'Family Member'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditForm(selectedPerson)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectPerson(null)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Contact & Personal Info Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Phone Number</span>
                  </p>
                  <p className="font-bold text-slate-800 mt-1">{selectedPerson.phone || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-semibold flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Email Address</span>
                  </p>
                  <p className="font-bold text-slate-800 mt-1 truncate">{selectedPerson.email || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-semibold flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Date of Birth</span>
                  </p>
                  <p className="font-bold text-slate-800 mt-1">{selectedPerson.dateOfBirth || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-semibold flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Occupation</span>
                  </p>
                  <p className="font-bold text-slate-800 mt-1">{selectedPerson.occupation || 'N/A'}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-slate-400 font-semibold flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Address & Location</span>
                  </p>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedPerson.address ? `${selectedPerson.address}, ${selectedPerson.country || ''}` : 'N/A'}
                  </p>
                </div>

                {selectedPerson.notes && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <p className="text-slate-400 font-semibold">Important Personal Notes</p>
                    <p className="text-slate-700 mt-1 italic">{selectedPerson.notes}</p>
                  </div>
                )}
              </div>

              {/* Connected Tasks Section */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                    <span>Tasks & Duties for {selectedPerson.fullName}</span>
                  </h3>
                </div>
                {tasks.filter((t) => t.personIds.includes(selectedPerson.id)).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No tasks connected to this person.</p>
                ) : (
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.personIds.includes(selectedPerson.id))
                      .map((task) => (
                        <div key={task.id} className="p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{task.title}</p>
                            <p className="text-[10px] text-slate-500">Due: {task.dueDate} • Priority: {task.priority}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Connected Insurance Policies */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Insurance Policies (Insured / Beneficiary)</span>
                </h3>
                {insurances.filter((i) => i.insuredPersonId === selectedPerson.id || i.beneficiaryPersonId === selectedPerson.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No insurance policies listed.</p>
                ) : (
                  <div className="space-y-2">
                    {insurances
                      .filter((i) => i.insuredPersonId === selectedPerson.id || i.beneficiaryPersonId === selectedPerson.id)
                      .map((ins) => (
                        <div key={ins.id} className="p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{ins.policyName}</p>
                            <p className="text-[10px] text-slate-500">{ins.company} • ${ins.premiumAmount}/{ins.paymentFrequency}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {ins.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Connected Documents */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Documents Vault</span>
                </h3>
                {documents.filter((d) => d.ownerPersonId === selectedPerson.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No documents attached.</p>
                ) : (
                  <div className="space-y-2">
                    {documents
                      .filter((d) => d.ownerPersonId === selectedPerson.id)
                      .map((doc) => (
                        <div key={doc.id} className="p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{doc.title}</p>
                            <p className="text-[10px] text-slate-500">Type: {doc.docType} {doc.expiryDate ? `• Expires: ${doc.expiryDate}` : ''}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                            Official Doc
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Person Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingPerson ? `Edit ${editingPerson.fullName}` : 'Add New Family Member / Person'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship *</label>
                  <input
                    type="text"
                    required
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g. Mother, Wife, Son, Brother"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Person['category'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Immediate Family">Immediate Family</option>
                    <option value="Extended Family">Extended Family</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Person['gender'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Teacher, Engineer"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, city"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Important Personal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Medical conditions, preferences, allergies..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  {editingPerson ? 'Save Changes' : 'Add Person'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
