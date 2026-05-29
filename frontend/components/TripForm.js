import { useState } from 'react';
import API from '../utils/api';

export default function TripForm({ onSuccess, onCancel }) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budgetType, setBudgetType] = useState('Medium');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const interestOptions = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Nightlife'];

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) setInterests(interests.filter(i => i !== interest));
    else setInterests([...interests, interest]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/trips', { destination, days, budgetType, interests });
      onSuccess(res.data);
    } catch (err) {
      alert('Failed to generate trip. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 border border-lightMaroon">
      <h2 className="text-xl font-bold text-maroon mb-3">Plan a new trip</h2>
      <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full p-2 mb-3 border rounded" required />
      <input type="number" min="1" max="14" value={days} onChange={(e) => setDays(e.target.value)} className="w-full p-2 mb-3 border rounded" required />
      <select value={budgetType} onChange={(e) => setBudgetType(e.target.value)} className="w-full p-2 mb-3 border rounded">
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <div className="mb-3">
        <p className="font-semibold">Interests:</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map(opt => (
            <button type="button" key={opt} onClick={() => toggleInterest(opt)} className={`px-3 py-1 rounded-full text-sm ${interests.includes(opt) ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-maroon text-white px-4 py-2 rounded hover:bg-orange-700">{loading ? 'Generating...' : 'Generate Itinerary'}</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}