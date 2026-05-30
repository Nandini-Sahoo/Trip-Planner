export default function HotelSuggestions({ hotels }) {
  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 border-l-4 border-maroon">
      <h3 className="text-xl font-bold text-maroon">🏨 Recommended Hotels</h3>
      <ul className="mt-2 space-y-2">
        {hotels.map((hotel, i) => (
          <li key={i}>
            <span className="font-semibold">{hotel.name}</span> — {hotel.description}
          </li>
        ))}
      </ul>
    </div>
  );
}