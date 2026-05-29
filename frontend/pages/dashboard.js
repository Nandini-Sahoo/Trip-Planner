import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import API from '../utils/api';
import TripForm from '../components/TripForm';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const res = await API.get('/trips');
    setTrips(res.data);
  };

  const handleTripCreated = (newTrip) => {
    setTrips([newTrip, ...trips]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-maroon">My Trips</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          + New Trip
        </button>
      </div>

      {showForm && <TripForm onSuccess={handleTripCreated} onCancel={() => setShowForm(false)} />}

      {trips.length === 0 ? (
        <p className="text-gray-600">No trips yet. Create your first AI itinerary!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map(trip => (
            <Link key={trip._id} href={`/trip/${trip._id}`} className="block p-4 border rounded-lg shadow hover:shadow-md bg-white">
              <h2 className="text-xl font-semibold text-maroon">{trip.destination}</h2>
              <p>{trip.days} days • Budget: {trip.budgetType}</p>
              <p className="text-orange-700">Total estimated: ${trip.budget?.total}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}