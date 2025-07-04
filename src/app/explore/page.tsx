"use client";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    closeFilters();
    const res = await fetch(`/api/cars?action=search&q=${encodeURIComponent(query)}`);
    
    const data = await res.json();
    setResults(data);
  };
  const closeFilters = async () => {
    setShowFilters(false);
  };

  
  const toggleFilters = () => {
    console.log("here");
    setShowFilters(!showFilters);
  };
  const saveFilters = () => {
    closeFilters();
    // add logic to handle filtering
    handleSearch();
  }

  const filters = [
    "Price",
    "Year",
    "Engine Size",
    "Horsepower",
    "Torque",
    "Acceleration",
  ];
  const filterComponents = filters.map((filter) => (
    <Filter key={filter} name={filter} />
  ));

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        <div className="flex flex-row justify-center content-center gap-4 box-border">
          <input
            type="text"
            placeholder="Search by make or model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 grow-5"
          />
          <button
            onClick={handleSearch}
            className="grow-3 items-center gap-2 p-2 w-fit cursor-pointer border-2 border-solid border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white"
          >
            Search
          </button>
          <div
            className="align-middle m-auto select-none cursor-pointer"
            onClick={toggleFilters}
          >
            Filters
          </div>
        </div>
        {showFilters ? (
          <div
            id="filters-menu"
            className="absolute left-0 top-0 p-4 h-full w-92 bg-amber-600 box-border border-1 border-solid border-amber-500"
          >
            <div>
              <b className="text-2xl">Filters</b>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {filterComponents}
              <div></div>

              <button onClick={saveFilters} className='p-2 cursor-pointer border-2 border-solid border-amber-400 text-black bg-amber-300 hover:bg-amber-400 hover:text-white'>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <ul className="flex flex-col gap-4 mt-4">
          {results.map((car: any) => (
            <li key={car.cID} className="border p-4 rounded shadow">
              <Link
                href={`/car/${car.cID}`}
                className="block hover:bg-neutral-800/40 p-2 rounded"
              >
                <h2 className="text-xl font-semibold">
                  {car.make} {car.model}
                </h2>
                <p>Year: {car.year}</p>
                <p>Engine: {car.engineSize} L</p>
                <p>Horsepower: {car.horsePower} HP</p>
                <p>Torque: {car.torque} lb⋅ft</p>
                <p>Acceleration (0‑60 MPH): {car.acceleration} s</p>
                <p>Price: ${car.price.toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Filter({ name }: { name: string }) {
  return (
    <div className="text-l flex place-content-between p-2">
      <div>{name}</div>
      <div>+</div>
    </div>
  );
}
