import { useState } from 'react';
import API from '../utils/api';

export default function ItineraryView({ trip, onUpdate }) {
  const [editingDay, setEditingDay] = useState(null);
  const [newActivity, setNewActivity] = useState('');
  const [regenerateInstruction, setRegenerateInstruction] = useState('');
  const [regeneratingDay, setRegeneratingDay] = useState(null);

  const handleAddActivity = (dayIndex) => {
    if (!newActivity.trim()) return;
    const updated = [...trip.itinerary];
    updated[dayIndex].activities.push(newActivity);
    onUpdate({ ...trip, itinerary: updated });
    setNewActivity('');
    setEditingDay(null);
  };

  const handleRemoveActivity = (dayIndex, actIndex) => {
    const updated = [...trip.itinerary];
    updated[dayIndex].activities.splice(actIndex, 1);
    onUpdate({ ...trip, itinerary: updated });
  };

  const handleRegenerateDay = async (dayIndex) => {
    setRegeneratingDay(dayIndex);
    try {
      const res = await API.post(`/trips/${trip._id}/regenerate-day`, {
        dayIndex: dayIndex + 1,
        instruction: regenerateInstruction || 'Make it more interesting'
      });
      onUpdate(res.data);
      setRegenerateInstruction('');
    } catch (err) {
      alert('Failed to regenerate day: ' + (err.response?.data?.error || err.message));
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleNotesChange = (dayIndex, notes) => {
    const updated = [...trip.itinerary];
    updated[dayIndex].notes = notes;
    onUpdate({ ...trip, itinerary: updated });
  };

  if (!trip.itinerary || trip.itinerary.length === 0) {
    return <p className="text-center text-gray-500">No itinerary data available.</p>;
  }

  // Time icons for different parts of the day
  const getTimeIcon = (activity, index) => {
    const icons = ['🌅', '🍳', '🏛️', '🍽️', '🌆', '🎭', '🌙'];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-6">
      {trip.itinerary.map((day, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Day Header */}
          <div className="bg-gradient-to-r from-orange-600 to-maroon px-6 py-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Day {day.day}
            </h3>
          </div>
          
          {/* Activities List */}
          <div className="p-5">
            <div className="space-y-3">
              {day.activities && day.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 group hover:bg-orange-50 p-2 rounded-lg transition-colors">
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-xl">{getTimeIcon(act, i)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{act}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveActivity(idx, i)} 
                    className="opacity-0 group-hover:opacity-100 text-red-500 text-sm hover:text-red-700 transition-opacity"
                    title="Remove activity"
                  >
                    ✖ Remove
                  </button>
                </div>
              ))}
              
              {(!day.activities || day.activities.length === 0) && (
                <p className="text-gray-400 italic text-center py-4">No activities planned yet. Add some below!</p>
              )}
            </div>
            
            {/* Add Activity Section */}
            {editingDay === idx ? (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newActivity} 
                    onChange={(e) => setNewActivity(e.target.value)} 
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Enter new activity..."
                    autoFocus
                  />
                  <button 
                    onClick={() => handleAddActivity(idx)} 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setEditingDay(null)} 
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setEditingDay(idx)} 
                className="mt-3 text-orange-600 text-sm hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <span className="text-lg">+</span> Add activity
              </button>
            )}
            
            {/* Regenerate Day Section */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Custom instruction (e.g., more outdoor activities)" 
                  value={regenerateInstruction} 
                  onChange={(e) => setRegenerateInstruction(e.target.value)} 
                  className="flex-1 min-w-[200px] p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button 
                  onClick={() => handleRegenerateDay(idx)} 
                  disabled={regeneratingDay === idx} 
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <span>🔄</span>
                  {regeneratingDay === idx ? 'Regenerating...' : 'Regenerate Day'}
                </button>
              </div>
            </div>

            {/* Personal Notes Feature */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <label className="block text-sm font-semibold text-maroon mb-2 flex items-center gap-1">
                <span>📝</span> Personal Notes:
              </label>
              <textarea 
                value={day.notes || ''} 
                onChange={(e) => handleNotesChange(idx, e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="2" 
                placeholder="Add your own notes, reminders, or packing tips..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}