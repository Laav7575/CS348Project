'use client';
import { useState } from 'react';

export default function LikeButton({ carId }: { carId: string }) {
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [folders, setFolders] = useState(['Dream Cars', 'Compare Later', 'For Dad']);
  const [newFolder, setNewFolder] = useState('');

  const toggleLike = () => {
    setLiked(!liked);
    setShowDropdown(!liked); // open dropdown only when liking
  };

  const addToFolder = (folder: string) => {
    console.log(`✅ Car ${carId} added to folder: ${folder}`);
    setShowDropdown(false);
  };

  const handleCreateFolder = () => {
    const name = newFolder.trim();
    if (name && !folders.includes(name)) {
      setFolders([...folders, name]);
      console.log(`🗂️ Created new folder: ${name}`);
      addToFolder(name);
    }
    setNewFolder('');
  };

  return (
    <div className="relative inline-block mt-4">
      <button
        onClick={toggleLike}
        className={`px-4 py-2 rounded ${
          liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {liked ? 'Liked ♥' : 'Like ♡'}
      </button>

      {showDropdown && (
        <div className="absolute mt-2 w-60 bg-white border border-gray-300 rounded shadow z-10 p-2">
          <div className="mb-2">
            <div className="font-semibold mb-1">Add to folder:</div>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => addToFolder(folder)}
                className="block w-full px-3 py-1 text-left hover:bg-gray-100 rounded"
              >
                {folder}
              </button>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <input
              type="text"
              placeholder="New folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="w-full border px-2 py-1 rounded mb-1"
            />
            <button
              onClick={handleCreateFolder}
              className="w-full bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
            >
              + Create & Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
