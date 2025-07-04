"use client";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

function FilterRange({
  name,
  minKey,
  maxKey,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: {
  name: string;
  minKey: string;
  maxKey: string;
  valueMin: string;
  valueMax: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
}) {
  return (
    <div className="text-sm flex flex-col gap-1">
      <label className="font-semibold">{name}</label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={valueMin}
          onChange={(e) => onChangeMin(e.target.value)}
          className="p-1 border rounded w-1/2"
        />
        <input
          type="number"
          placeholder="Max"
          value={valueMax}
          onChange={(e) => onChangeMax(e.target.value)}
          className="p-1 border rounded w-1/2"
        />
      </div>
    </div>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
  priceMin: '', priceMax: '',
  yearMin: '', yearMax: '',
  engineSizeMin: '', engineSizeMax: '',
  horsePowerMin: '', horsePowerMax: '',
  torqueMin: '', torqueMax: '',
  accelerationMin: '', accelerationMax: '',
});

const [filters, setFilters] = useState(localFilters);

  const filtersList = [
    { name: "Price", minKey: "priceMin", maxKey: "priceMax" },
    { name: "Year", minKey: "yearMin", maxKey: "yearMax" },
    { name: "Engine Size", minKey: "engineSizeMin", maxKey: "engineSizeMax" },
    { name: "Horsepower", minKey: "horsePowerMin", maxKey: "horsePowerMax" },
    { name: "Torque", minKey: "torqueMin", maxKey: "torqueMax" },
    { name: "Acceleration", minKey: "accelerationMin", maxKey: "accelerationMax" },
  ];

  const handleLocalFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    handleSearch(localFilters);
    setShowFilters(false);
  };


  const handleSearch = async (appliedFilters = filters) => {
    const queryParams = new URLSearchParams({ action: 'search', q: query });

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== '') {
        queryParams.append(key, value);
      }
    });

    const res = await fetch(`/api/cars?${queryParams.toString()}`);
    const data = await res.json();
    setResults(data);
  };
  const closeFilters = async () => {
    setShowFilters(false);
  };
  
  const toggleFilters = () => {
    setShowFilters(show => !show);
  };
  const saveFilters = () => {
    closeFilters();
    // add logic to handle filtering
    handleSearch();
  }

//   const filters = [
//     "Price",
//     "Year",
//     "Engine Size",
//     "Horsepower",
//     "Torque",
//     "Acceleration",
//   ];
//   const filterComponents = filters.map((filter) => (
//     <Filter key={filter} name={filter} />
//   ));

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        <div className="flex flex-row justify-center content-center gap-4 box-border">
          <input type="text" placeholder="Search by make or model..." 
            value={query} onChange={e => setQuery(e.target.value)}
            className="border p-2 grow-5" />
          <button onClick={() =>handleSearch(filters)} 
            className="grow-3 items-center gap-2 p-2 w-fit cursor-pointer border-2 border-solid border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white">
            Search</button>
          <div className="align-middle m-auto select-none cursor-pointer" onClick={toggleFilters}>Filters</div>
        </div>
        {showFilters && (
    <div
      id="filters-menu"
      className="absolute left-0 top-0 p-4 h-full w-92 bg-amber-600 box-border border-1 border-solid border-amber-500"
    >
    <div>
      <b className="text-2xl">Filters</b>
    </div>
    <div className="mt-4 flex flex-col gap-2">
       {filtersList.map(({ name, minKey, maxKey }) => (
                <FilterRange
                  key={minKey + maxKey}
                  name={name}
                  minKey={minKey}
                  maxKey={maxKey}
                  valueMin={localFilters[minKey as keyof typeof localFilters]}
                  valueMax={localFilters[maxKey as keyof typeof localFilters]}
                  onChangeMin={(val) => handleLocalFilterChange(minKey, val)}
                  onChangeMax={(val) => handleLocalFilterChange(maxKey, val)}
                />
              ))}
            <button
              onClick={applyFilters}
                className="bg-amber-900 text-white p-2 rounded mt-4"
            >
              Apply
            </button>
          </div>
        </div>
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
                <p>Price: ${car.price}</p>
              </Link>
            </li>
          ))}
        </ul>
     
    </div>
  );
}

