import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { token, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <nav className="bg-maroon text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-300">
            ✈️ Trip Planner
          </Link>
          <div className="space-x-4">
            <span className="opacity-50">Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-maroon-400 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-900">
          ✈️ Trip Planner
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link href="/dashboard" className="font-bold hover:text-yellow-300">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-orange-600 font-bold px-3 py-1 rounded hover:bg-orange-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-bold hover:text-yellow-300">
                Login
              </Link>
              <Link href="/register" className="font-bold hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}