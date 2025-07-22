"use client";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

type Car = {
  cID: number;
  make: string;
  model: string;
  saveCount: number;
  price: number;
  isMostSaved: number;
  year: number;
};

export default function TrendingPage() {
    
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
        const res = await fetch('/api/trendingcars');
        const data = await res.json();
        setCars(data);
        };
        fetchTrending();
    }, []);

    return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="p-4 sm:p-10 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-9 text-center text-amber-400">
          Trending Cars This Week
        </h2>

        {cars.length === 0 ? (
          <p className="text-lg text-gray-400">loading..</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {cars.map((car) => (
              <li
                key={car.cID}
                className={`transition-transform duration-300 hover:scale-105 hover:shadow-amber-500/50 relative p-6 rounded-xl shadow-lg transition-shadow duration-300 ease-in-out border 
                ${car.isMostSaved === 1 ? "border-amber-500 shadow-amber-500/30" : "border-gray-700 bg-gray-800"}`}
              >
                {car.isMostSaved === 1 && (
                  <div className="absolute -top-4 -right-3 text-3xl animate-bounce z-10 ">
                    🔥
                  </div>
                )}
                <Link href={`/car/${car.cID}`} className="block hover:bg-neutral-800/40 p-2 rounded">
                  <h3 className="text-2xl font-bold text-amber-400 mb-2">
                    {car.make} {car.model}
                    {car.isMostSaved === 1 && (
                      <span className="ml-2 text-amber-500 text-sm font-semibold">
                        ⭐ Most Popular
                      </span>
                    )}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p className="text-gray-300 text-lg mb-1">
                    Price: ${typeof car.price === 'number' ? car.price.toLocaleString() : 'N/A'}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

};