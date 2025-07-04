'use client';
import { useState, useEffect } from 'react';
import NavBar from "../../components/NavBar";

export default function MyDashboard() {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetch("/api/folders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setFolders(data);
      });
  }, []);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        { error ? (
          <div className="text-xl font-semibold mb-4">{error}</div>
        ) : (
          <ul className="list-disc ml-6">
          {folders.map((folder: any) => (
            <li key={folder.fID}>{folder.folderName}</li>
          ))}
        </ul>
      )}
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

