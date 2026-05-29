import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../utils/api';
import ItineraryView from '../../components/ItineraryView';
import BudgetDisplay from '../../components/BudgetDisplay';
import HotelSuggestions from '../../components/HotelSuggestions';

export default function TripDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (updatedTrip) => {
    try {
      const res = await API.put(`/trips/${id}`, { itinerary: updatedTrip.itinerary });
      setTrip(res.data);
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading trip...</p>;
  if (!trip) return <p className="text-center mt-10">Trip not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-maroon mb-2">{trip.destination}</h1>
      <p className="text-gray-600 mb-4">{trip.days} days • {trip.budgetType} budget • Interests: {trip.interests.join(', ')}</p>
      
      <BudgetDisplay budget={trip.budget} />
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-orange-800 mb-3">Your Itinerary</h2>
        <ItineraryView trip={trip} onUpdate={updateTrip} />
      </div>
      
      <HotelSuggestions hotels={trip.hotels} />
    </div>
  );
}