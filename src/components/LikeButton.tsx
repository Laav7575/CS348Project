"use client";

import { useEffect, useState } from "react";

export default function LikeButton({ cID }: { cID: string }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [original, setOriginal] = useState<Set<number>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setUserId(data.id);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userId == null) return;

    fetch("/api/folders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setFolders(data);

        fetch(`/api/saves?cID=${cID}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((savedFolders) => {
            const savedSet = new Set<number>(
              savedFolders.map((entry: any) => entry.fID)
            );
            setOriginal(savedSet);
            setSelected(new Set(savedSet));
          });
      });
  }, [userId]);

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCheck = (fID: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(fID) ? newSet.delete(fID) : newSet.add(fID);
      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token || userId == null) return;

    const toAdd = [...selected].filter((fID) => !original.has(fID));
    const toRemove = [...original].filter((fID) => !selected.has(fID));

    for (let fID of toAdd) {
      await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cID, fID }),
      });
    }

    for (let fID of toRemove) {
      await fetch("/api/save", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cID, fID }),
      });
    }

    setOriginal(new Set(selected));
    setShowDropdown(false);
  };

  const handleCreateFolder = async () => {
    const name = newFolder.trim();
    if (!name || folders.find((f) => f.folderName === name)) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderName: name }),
    });

    const data = await res.json();
    if (data?.fID) {
      const newEntry = { fID: data.fID, folderName: name };
      setFolders((prev) => [...prev, newEntry]);
      setSelected((prev) => new Set(prev).add(data.fID));
      setNewFolder("");
    }
  };

  if (userId == null) return null;

  return (
    <div className="relative inline-block mt-4">
      <button
        onClick={handleToggle}
        className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
      >
        ❤️ Manage Likes
      </button>

      {showDropdown && (
        <div className="absolute mt-2 w-72 border border-gray-300 rounded shadow z-10 p-4">
          <div className="mb-2 font-semibold">Select Folders:</div>
          <div className="max-h-40 overflow-y-auto mb-3">
            {folders.map((folder) => (
              <label key={folder.fID} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected.has(folder.fID)}
                  onChange={() => handleCheck(folder.fID)}
                />
                {folder.folderName}
              </label>
            ))}
          </div>

          <div className="border-t pt-2 mt-2">
            <input
              type="text"
              placeholder="New folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="w-full border px-2 py-1 rounded mb-2"
            />
            <button
              onClick={handleCreateFolder}
              className="w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Create Folder
            </button>
          </div>

          <button
            onClick={handleSaveChanges}
            className="w-full mt-3 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            ✅ Save
          </button>
        </div>
      )}
    </div>
  );
}
