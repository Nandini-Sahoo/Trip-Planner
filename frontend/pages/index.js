import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-maroon mb-4">Plan Your Dream Trip with AI</h1>
      <p className="text-xl c mb-8">Personalized itineraries, budget estimates, and hotel suggestions — all in one place.</p>
      <Link href="/register" className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-700">Get Started</Link>
    </div>
  );
}