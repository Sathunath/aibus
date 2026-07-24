import { useState, FormEvent } from 'react';
import {
  Calendar,
  Plus,
  Gift,
  Heart,
  Clock,
  User,
  X,
  Trash2,
  Bell
} from 'lucide-react';
import { ImportantDate, Person } from '../../types';

interface ImportantDatesProps {
  importantDates: ImportantDate[];
  people: Person[];
  onAddImportantDate: (dateItem: Omit<ImportantDate, 'id'>) => void;
  onDeleteImportantDate: (id: string) => void;
}

export function ImportantDates({
  importantDates,
  people,
  onAddImportantDate,
  onDeleteImportantDate
}: ImportantDatesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Birthday' as ImportantDate['type'],
    personId: people[0]?.id || '',
    reminderDaysBefore: 7,
    notes: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddImportantDate(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Important Family Dates & Anniversaries ({importantDates.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track birthdays, wedding anniversaries, milestones, and policy renewal reminder triggers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Important Date</span>
        </button>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {importantDates.map((item) => {
          const person = people.find((p) => p.id === item.personId);

          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {item.type}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteImportantDate(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete date"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 text-xs space-y-1.5 text-slate-600">
                  <p className="font-extrabold text-indigo-600 flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>{item.date}</span>
                  </p>

                  {person && (
                    <p className="flex items-center space-x-1.5 text-slate-700 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{person.fullName} ({person.relationship})</span>
                    </p>
                  )}

                  {item.notes && <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed mt-2">{item.notes}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center space-x-1 text-indigo-600">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify {item.reminderDaysBefore} days prior</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Add Important Date</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Occasion *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother's 64th Birthday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ImportantDate['type'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Renewal">Renewal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associated Person</label>
                  <select
                    value={formData.personId}
                    onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">None</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reminder Days Prior</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.reminderDaysBefore}
                    onChange={(e) => setFormData({ ...formData, reminderDaysBefore: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes & Gift Ideas</label>
                <textarea
                  rows={2}
                  placeholder="Gift ideas, dinner reservations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
