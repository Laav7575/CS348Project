"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

type Car = {
    cID: number;
    make: string;
    model: string;
    price: number;
    year: number;
    engineSize?: number;
    isElectric?: boolean;
    horsePower?: number;
    torque?: number;
    acceleration?: number;
  };
  
export default function ManageCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Car>>({});
  const [adding, setAdding] = useState(false);
  const [newCarData, setNewCarData] = useState<Partial<Car>>({});
  const [error, setError] = useState("");

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars?action=all");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setCars(data);
      setError("");
    } catch {
      setError("Failed to fetch cars");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({ action: "search", q: search });
      const res = await fetch(`/api/cars?${params}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setCars(data);
      setError("");
    } catch {
      setError("Search failed");
    }
  };

  const handleEdit = (car: Car) => {
    setEditing(car.cID);
    setEditData({ ...car }); // clone to avoid mutations
  };

  const handleChange = (key: keyof Car, value: any) => {
    // For numeric fields, sanitize NaN to undefined
    if (["price", "year", "engineSize"].includes(key)) {
      const num = Number(value);
      setEditData((prev) => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
    } else {
      setEditData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }
    if (!editData.cID) {
      setError("Missing car ID");
      return;
    }
    // Validate required fields before save
    if (!editData.make || !editData.model || !editData.year || !editData.price) {
      setError("Make, Model, Year, and Price are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/cars/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "update", car: editData }),
      });
      const json = await res.json();
      if (res.ok) {
        setEditing(null);
        setEditData({});
        fetchCars();
        setError("");
      } else {
        setError(json.error || "Update failed");
      }
    } catch {
      setError("Update failed");
    }
  };

  const handleDelete = async (cID: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    try {
      const res = await fetch("/api/admin/cars/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cID }),
      });
      const json = await res.json();
      if (res.ok) {
        fetchCars();
        setError("");
      } else {
        setError(json.error || "Delete failed");
      }
    } catch {
      setError("Delete failed");
    }
  };

  const handleAddChange = (key: keyof Car, value: any) => {
    if (["price", "year", "engineSize"].includes(key)) {
      const num = Number(value);
      setNewCarData((prev) => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
    } else {
      setNewCarData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleAddCar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    if (!newCarData.make || !newCarData.model || !newCarData.year || !newCarData.price) {
      setError("Make, Model, Year, and Price are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/cars/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCarData),
      });
      const json = await res.json();
      if (res.ok) {
        setAdding(false);
        setNewCarData({});
        fetchCars();
        setError("");
      } else {
        setError(json.error || "Add failed");
      }
    } catch {
      setError("Add failed");
    }
  };

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Cars</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make/model..."
            className="border rounded px-2 py-1 flex-grow"
          />
          <button onClick={handleSearch} className="px-3 py-1 border rounded">
            Search
          </button>
          <button onClick={() => setAdding(true)} className="px-3 py-1 border rounded">
            + Add Car
          </button>
        </div>

        {adding && (
  <div className="mb-6 border p-4 rounded space-y-2 max-w-md">
    <h2 className="font-semibold">Add New Car</h2>

    <input
      type="text"
      placeholder="Make"
      value={newCarData.make || ""}
      onChange={(e) => handleAddChange("make", e.target.value)}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="text"
      placeholder="Model"
      value={newCarData.model || ""}
      onChange={(e) => handleAddChange("model", e.target.value)}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Year"
      value={newCarData.year || ""}
      onChange={(e) => handleAddChange("year", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Price"
      value={newCarData.price || ""}
      onChange={(e) => handleAddChange("price", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Engine Size"
      value={newCarData.engineSize || ""}
      onChange={(e) => handleAddChange("engineSize", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
    <label className="inline-flex items-center space-x-2">
      <input
        type="checkbox"
        checked={newCarData.isElectric || false}
        onChange={(e) => handleAddChange("isElectric", e.target.checked)}
      />
      <span>Is Electric</span>
    </label>
    <input
      type="number"
      placeholder="Horse Power"
      value={newCarData.horsePower || ""}
      onChange={(e) => handleAddChange("horsePower", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Torque"
      value={newCarData.torque || ""}
      onChange={(e) => handleAddChange("torque", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Acceleration"
      value={newCarData.acceleration || ""}
      onChange={(e) => handleAddChange("acceleration", Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />

    <div className="flex gap-2">
      <button onClick={handleAddCar} className="px-3 py-1 border rounded">
        Save
      </button>
      <button onClick={() => setAdding(false)} className="px-3 py-1 border rounded">
        Cancel
      </button>
    </div>
  </div>
)}


        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="border px-2 py-1">Make</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Year</th>
              <th className="border px-2 py-1">Engine Size</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) =>
              editing === car.cID ? (
                <tr key={car.cID}>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={editData.make || ""}
                      onChange={(e) => handleChange("make", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={editData.model || ""}
                      onChange={(e) => handleChange("model", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={editData.price ?? ""}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={editData.year ?? ""}
                      onChange={(e) => handleChange("year", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={editData.engineSize ?? ""}
                      onChange={(e) => handleChange("engineSize", e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1 space-x-2">
                    <button onClick={handleSave} className="px-3 py-1 border rounded">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setEditData({});
                        setError("");
                      }}
                      className="px-3 py-1 border rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={car.cID}>
                  <td className="border p-1">{car.make}</td>
                  <td className="border p-1">{car.model}</td>
                  <td className="border p-1">${car.price}</td>
                  <td className="border p-1">{car.year}</td>
                  <td className="border p-1">{car.engineSize ?? "-"}</td>
                  <td className="border p-1 space-x-2">
                    <button onClick={() => handleEdit(car)} className="px-3 py-1 border rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.cID)}
                      className="px-3 py-1 border rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
