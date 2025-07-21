// page.tsx
"use client";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

type Car = {
  cID: number;
  make: string;
  model: string;
  year: number;
  price: number;
  recommendation_score: number;
  make_score?: number;
  price_score?: number;
  year_score?: number;
};

export default function FYPPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  };

  useEffect(() => {
    const fetchFYP = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = sortBy === 'default' ? '/api/fyp' : `/api/fyp?sort_by=${sortBy}`;

        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Failed to load recommendations.");
          return;
        }

        setCars(data.cars || []);
        if (data.cars?.length === 0) {
          setError(data.message || "No recommendations found.");
        }

      } catch (err) {
        console.error("Failed to fetch FYP cars:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchFYP();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="p-4 sm:p-10 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-amber-400">
          Recommended Cars For You!
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSortBy('default')}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ease-in-out
              ${sortBy === 'default' ? 'bg-amber-500 text-gray-900 shadow-lg' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Default Sort
          </button>
          <button
            onClick={() => setSortBy('make')}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ease-in-out
              ${sortBy === 'make' ? 'bg-amber-500 text-gray-900 shadow-lg' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Prioritize Make
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ease-in-out
              ${sortBy === 'price' ? 'bg-amber-500 text-gray-900 shadow-lg' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Prioritize Price
          </button>
          <button
            onClick={() => setSortBy('year')}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ease-in-out
              ${sortBy === 'year' ? 'bg-amber-500 text-gray-900 shadow-lg' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          >
            Prioritize Year
          </button>
        </div>

        {loading && (
          <p className="text-lg text-gray-400">Loading recommendations...</p>
        )}

        {error && (
          <div className="text-center">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            {error.includes("log in") && (
              <Link href="/signin" className="bg-amber-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-amber-400 transition-colors">
                Go to Login
              </Link>
            )}
          </div>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="text-center">
            <p className="text-lg text-gray-400 mb-4">No recommendations found for you yet.</p>
            <Link href="/explore" className="bg-amber-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-amber-400 transition-colors">
              Browse Cars to Like
            </Link>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {cars.map((car) => (
              <li key={car.cID} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-shadow duration-300 ease-in-out border border-gray-700">
                <Link href={`/car/${car.cID}`} className="block">
                  <h3 className="text-2xl font-bold text-amber-400 mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-300 text-lg mb-1">Year: {car.year}</p>
                  <p className="text-gray-300 text-lg mb-3">Price: ${car.price.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">
                    Recommendation Score: {car.recommendation_score}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
