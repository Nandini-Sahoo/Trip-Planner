import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import API from '../utils/api';
import TripForm from '../components/TripForm';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchTrips();
    }
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await API.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTripCreated = (newTrip) => {
    setTrips([newTrip, ...trips]);
    setShowForm(false);
  };

  const handleDeleteTrip = async (tripId, tripDestination) => {
    const confirmed = window.confirm(`Are you sure you want to delete your trip to ${tripDestination}? This action cannot be undone.`);
    
    if (!confirmed) return;
    
    setDeletingId(tripId);
    try {
      await API.delete(`/trips/${tripId}`);
      setTrips(trips.filter(trip => trip._id !== tripId));
      alert(`Trip to ${tripDestination} deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading your trips...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-maroon">My Trips</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + New Trip
        </button>
      </div>

      {showForm && <TripForm onSuccess={handleTripCreated} onCancel={() => setShowForm(false)} />}

      {trips.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No trips yet. Create your first AI itinerary!</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map(trip => (
            <div key={trip._id} className="border rounded-lg shadow bg-white hover:shadow-md transition-shadow">
              <Link href={`/trip/${trip._id}`} className="block p-4">
                <h2 className="text-xl font-semibold text-maroon">{trip.destination}</h2>
                <p className="text-gray-600">{trip.days} days • Budget: {trip.budgetType}</p>
                <p className="text-orange-700 font-semibold">Total estimated: ${trip.budget?.total || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(trip.createdAt).toLocaleDateString()}
                </p>
              </Link>
              <div className="border-t p-3 flex justify-end">
                <button
                  onClick={() => handleDeleteTrip(trip._id, trip.destination)}
                  disabled={deletingId === trip._id}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm disabled:opacity-50 flex items-center gap-1"
                >
                  <span>🗑️</span>
                  {deletingId === trip._id ? 'Deleting...' : 'Delete Trip'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}