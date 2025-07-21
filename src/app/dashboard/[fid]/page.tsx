"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";

export default function FolderPage() {
  const { fid } = useParams();
  const [cars, setCars] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    console.log(fid);

    if (!fid) return;

    console.log("token: ", token);

    fetch(`http://localhost:3000/api/folders/${fid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setCars(data.cars || []);
          setStats(data.stats || null);
        }
      })
      .catch(() => setError("Failed to fetch folder data"));
  }, [fid]);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col space-y-6">
        {error ? (
          <div className="text-xl font-semibold text-red-600">{error}</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Folder Details</h1>

            {stats && (
              <div className="p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2"></h2>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>Folder Size:</strong> {stats.folderSize}</li>
                  <li><strong>Average Price:</strong> ${stats.avgPrice}</li>
                  <li><strong>Most Common Make:</strong> {stats.commonMake}</li>
                  <li><strong>Most Common Model:</strong> {stats.commonModel}</li>
                  <li><strong>Average Year:</strong> {stats.avgYear}</li>
                  <li><strong>Electric Cars:</strong> {stats.electricCount}</li>
                  <li><strong>Average Engine Size:</strong> {stats.avgEngineSize}L</li>
                  <li><strong>Average Horsepower:</strong> {stats.avgHorsePower} HP</li>
                  <li><strong>Average Torque:</strong> {stats.avgTorque} Nm</li>
                  <li><strong>Average Acceleration:</strong> {stats.avgAcceleration} sec (0-100 km/h)</li>
                </ul>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Cars</h2>
              {cars.length > 0 ? (
                <ul className="list-disc ml-6 space-y-1">
                  {cars.map((car) => (
                    <li key={car.cID}>
                      {car.year} {car.make} {car.model}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No cars in this folder.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
