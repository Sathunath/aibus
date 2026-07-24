import { useState, FormEvent } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  User,
  Filter,
  Search,
  X,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { LifeTask, Person } from '../../types';
import { useTableViewportFill, PlaceholderRows } from '../ViewportTable';

interface TaskManagerProps {
  tasks: LifeTask[];
  people: Person[];
  onAddTask: (task: Omit<LifeTask, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (id: string, status: LifeTask['status']) => void;
  onDeleteTask: (id: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export function TaskManager({
  tasks,
  people,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  isAddModalOpen = false,
  onCloseAddModal
}: TaskManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterPerson, setFilterPerson] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpen);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    personIds: [] as string[],
    category: 'Personal' as LifeTask['category'],
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as LifeTask['priority'],
    status: 'Pending' as LifeTask['status']
  });

  const handleOpenModal = () => {
    setFormData({
      title: '',
      description: '',
      personIds: [],
      category: 'Personal',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddTask(formData);
    handleClose();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesPerson = filterPerson === 'all' || t.personIds.includes(filterPerson);

    return matchesSearch && matchesStatus && matchesPriority && matchesPerson;
  });

  const { containerRef: taskTableRef, blankRowsCount: taskBlankRows } = useTableViewportFill({
    actualRowCount: filteredTasks.length,
    rowHeight: 40,
    headerHeight: 28,
  });

  const togglePersonSelection = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      personIds: prev.personIds.includes(personId)
        ? prev.personIds.filter((id) => id !== personId)
        : [...prev.personIds, personId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            <span>Tasks, Duties & Reminders ({tasks.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track healthcare, financial support, family insurance, and personal commitments.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={filterPerson}
          onChange={(e) => setFilterPerson(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Family Members</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName} ({p.relationship})
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No tasks found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 overflow-y-auto" ref={taskTableRef}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Priority & Category</th>
                  <th className="py-3 px-4">Task Title & Details</th>
                  <th className="py-3 px-4">Assigned Member</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredTasks.map((task) => {
                  const assignedPeople = people.filter((p) => task.personIds.includes(p.id));

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50 transition ${
                        task.status === 'Completed' ? 'bg-slate-50/50 opacity-70' : ''
                      }`}
                    >
                      {/* Priority & Category */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              task.priority === 'Urgent'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : task.priority === 'Medium'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-2.5 px-4">
                        <p
                          className={`text-xs font-bold ${
                            task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[10px] text-slate-500 truncate max-w-xs">{task.description}</p>
                        )}
                      </td>

                      {/* Assigned Member */}
                      <td className="py-2.5 px-4">
                        {assignedPeople.length > 0 ? (
                          <div className="flex items-center space-x-1 flex-wrap">
                            {assignedPeople.map((p) => (
                              <span
                                key={p.id}
                                className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md"
                              >
                                {p.fullName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-700 font-semibold">
                        {task.dueDate}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-4">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as LifeTask['status'])}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold focus:outline-none cursor-pointer ${
                            task.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : task.status === 'In Progress'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <PlaceholderRows count={taskBlankRows} colCount={6} rowHeight={40} />
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {(isModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Create Family Task / Commitment</h2>
              <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pay Mother's Health Insurance Premium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Details</label>
                <textarea
                  rows={2}
                  placeholder="Add specific instructions or policy numbers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LifeTask['category'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Medical">Medical</option>
                    <option value="Financial">Financial</option>
                    <option value="Family">Family</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as LifeTask['priority'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Connect to Family Members</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {people.map((p) => {
                    const isSelected = formData.personIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePersonSelection(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.fullName} ({p.relationship})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
