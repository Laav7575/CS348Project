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
};

export default function FYPPage() {
    
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        const fetchFYP = async () => {
            const res = await fetch('/api/fyp');
            const data = await res.json();
            setCars(data);
        };
        fetchFYP();
    }, []);

    return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative">
        <h2 className="text-2xl mb-4">Recommended Cars For You!</h2>
        <ul className="flex flex-col gap-4 mt-4">
          {cars.map((car) => (
            <li key={car.cID} className={`border p-4 rounded shadow ${
      car.isMostSaved === 1 ? "border-amber-500 border-2" : ""
    }`}>
                <Link
                href={`/car/${car.cID}`}
                className="block hover:bg-neutral-800/40 p-2 rounded"
              >
               
              <h3 className="text-xl font-bold">{car.make} {car.model}
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