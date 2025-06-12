'use client';
import { useState } from 'react';
import NavBar from "../../components/NavBar";

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
      const res = await fetch(`/api/cars?action=search&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
  };

  return (
    <div className="bg-gray-100">
      <NavBar />
      <input type="text" placeholder="Search by make or model..." 
        value={query} onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded m-2" />
      <button onClick={handleSearch} className="inline-flex items-center gap-2 px-6 py-2 mt-6 m-2 w-fit rounded-md border-2 border-solid border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white">
        Search</button>
      <ul className="flex flex-col gap-4 p-10">
        {results.map((car: any) => (
          <li key={car.cID} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
            <p>Year: {car.year}</p>
            <p>Engine: {car.engineSize}L</p>
            <p>Horsepower: {car.horsePower} HP</p>
            <p>Price: ${car.price.toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

