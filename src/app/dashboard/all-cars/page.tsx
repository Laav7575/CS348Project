"use client";

import { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";

export default function AllCarsPage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    // Fetch folders and all cars (joined)
    fetch("/api/folders/all-cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setCars(data.cars || []);
          setStats(data.stats || null);
        }
      })
      .catch(() => setError("Failed to fetch data"));
  }, []);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">All Cars</h1>

        {error && (
          <div className="text-red-600 font-semibold">{error}</div>
        )}

        {cars.length > 0 ? (
          <ul className="list-disc ml-6 space-y-1">
            {cars.map((car) => (
              <li key={car.cID}>
                {car.year} {car.make} {car.model}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">loading..</p>
        )}
      </div>
    </div>
  );
}
