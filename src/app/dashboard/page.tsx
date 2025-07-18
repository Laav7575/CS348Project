"use client";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

export default function MyDashboard() {
  const [folders, setFolders] = useState([]);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState("");

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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setFolders(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetch("/api/likes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setLikes(data);
        console.log(likes);
      });
  }, []);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        {/* All Cars button */}
        <div className="mb-6">
          <Link href="/dashboard/all-cars">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              All Cars
            </button>
          </Link>
        </div>

        {error ? (
          <div className="text-xl font-semibold mb-4 text-red-600">{error}</div>
        ) : (
          <div className="space-y-6">
            {folders.map((folder: any) => (
              <div key={folder.fID} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/dashboard/${folder.fID}`}>
                    {folder.folderName}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

