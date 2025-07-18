"use client";

import { useEffect, useState } from "react";

export default function LikeButton({ cID }: { cID: string }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    fetch("/api/likes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((folders) => {
        if (!Array.isArray(folders)) return;
        const likesFolder = folders[0];
        if (!likesFolder?.cars) return;
        const isLiked = likesFolder.cars.some((car: any) => car.cID === Number(cID));
        setLiked(isLiked);
        setLoading(false);
      });
  }, [cID, token]);

  const toggleLike = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderName: "Likes" }),
      });

      const data = await res.json();
      const fID = data?.fID;
      if (!fID) throw new Error("Failed to get Likes folder ID");

      const method = liked ? "DELETE" : "POST";

      await fetch("/api/save", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cID, fID }),
      });
      setLiked(!liked);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token || loading) return null;

  return (
    <button
      onClick={toggleLike}
      className={`px-4 py-2 rounded text-white ${
        liked ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      {liked ? "❤️ Liked" : "♡ Like"}
    </button>
  );
}
