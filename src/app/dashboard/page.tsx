"use client";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";

export default function MyDashboard() {
  const [folders, setFolders] = useState([]);
  const [likes, setLikes] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUsername(data.username);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info", err);
      });
  }, []);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative h-full">
        {/* All Cars button */}
        <div className="mb-6">
          Hi{(", " + username + "!")|| "!"}
        </div>
        {error ? (
          <div className="text-xl font-semibold mb-4 text-red-600">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-row w-full gap-4">
              <Link href="/dashboard/all-cars" className="grow">
                <button className="w-full bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-full hover:bg-blue-700 transition">
                  All Cars
                </button>
              </Link>
              <Link href="/fyp" className="grow">
              <button className="mb-7 w-full p-2 w-fit cursor-pointer border-2 border-solid border-amber-400 text-white-500 bg-amber-400 rounded-full hover:bg-amber-500 transition">
                Recommended Cars For You
              </button>
              </Link>
            </div>
            

            {folders.map((folder: any) => (
              <div key={folder.fID} className="border rounded shadow">
                <Link href={`/dashboard/${folder.fID}`}>
                <h2 className="text-xl font-semibold m-4">
                    {folder.folderName}
                </h2>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

