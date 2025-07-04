'use client';
import { useState } from 'react';
import NavBar from "../../components/NavBar";

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    const res = await fetch(`/api/cars?action=search&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        {/* <ul className="flex flex-col gap-4 mt-4">
          {results.map((car: any) => (
            <li key={car.cID} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

