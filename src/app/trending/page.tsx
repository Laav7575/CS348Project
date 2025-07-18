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
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative">
        <h2 className="text-2xl mb-4">Trending This Week 🔥</h2>
        
        <ul className="flex flex-col gap-4 mt-4">
          {cars.map((car) => (
            <li key={car.cID} className={`border p-4 rounded shadow ${
      car.isMostSaved === 1 ? "border-amber-500 border-2" : ""
    }`}>
                <Link
                href={`/car/${car.cID}`}
                className="block hover:bg-neutral-800/40 p-2 rounded"
              >
               
              <h3 className="text-xl font-bold"> {car.year} {car.make} {car.model} 
                {car.isMostSaved === 1 && (
                <span className="ml-2 text-amber-500 text-sm font-semibold">
                    ⭐ Most Popular
                </span>
                )}
              </h3>
              <p>Price: ${car.price}</p>
              </Link>
            </li>
          ))}  
        </ul>
      </div>
    </div>
  );
};