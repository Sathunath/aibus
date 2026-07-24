import { useState, FormEvent } from 'react';
import {
  Award,
  Plus,
  Calendar,
  MapPin,
  Users,
  X,
  Trash2,
  Sparkles
} from 'lucide-react';
import { LifeEvent, Person } from '../../types';

interface LifeEventsTimelineProps {
  lifeEvents: LifeEvent[];
  people: Person[];
  onAddLifeEvent: (eventItem: Omit<LifeEvent, 'id'>) => void;
  onDeleteLifeEvent: (id: string) => void;
}

export function LifeEventsTimeline({
  lifeEvents,
  people,
  onAddLifeEvent,
  onDeleteLifeEvent
}: LifeEventsTimelineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Family' as LifeEvent['category'],
    personIds: [] as string[],
    location: '',
    imageUrl: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddLifeEvent(formData);
    setIsModalOpen(false);
  };

  const togglePerson = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      personIds: prev.personIds.includes(personId)
        ? prev.personIds.filter((id) => id !== personId)
        : [...prev.personIds, personId]
    }));
  };

  const sortedEvents = [...lifeEvents].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Life Events & Milestone Memory Timeline ({lifeEvents.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual chronological timeline documenting marriages, births, property purchases, and family achievements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Life Milestone</span>
        </button>
      </div>

      {/* Visual Timeline */}
      <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-8 space-y-8 py-4">
        {sortedEvents.map((event) => {
          const taggedPeople = people.filter((p) => event.personIds.includes(p.id));

          return (
            <div key={event.id} className="relative pl-6 md:pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs group-hover:scale-125 transition-transform"></div>

              {/* Event Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full md:w-48 h-36 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {event.category}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">{event.title}</h3>
                    </div>

                    <button
                      onClick={() => onDeleteLifeEvent(event.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

                  {event.location && (
                    <p className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.location}</span>
                    </p>
                  )}

                  {taggedPeople.length > 0 && (
                    <div className="pt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Tagged Family:</span>
                      {taggedPeople.map((p) => (
                        <span
                          key={p.id}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {p.fullName} ({p.relationship})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
              <h2 className="text-lg font-extrabold text-slate-900">Record Life Milestone</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Birth of Son Leo, Bought Vacation House"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LifeEvent['category'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Family">Family</option>
                    <option value="Career">Career</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Children">Children</option>
                    <option value="Property">Property</option>
                    <option value="Travel">Travel</option>
                    <option value="Achievement">Achievement</option>
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tag Present Family Members</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {people.map((p) => {
                    const isSelected = formData.personIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePerson(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.fullName} ({p.relationship})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Memory Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe this milestone memory..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
