'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

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
          setIsAuthenticated(true);
          setIsAdmin(data.isAdmin);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.replace('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-8 bg-linear-180 from-gray-950 to-gray-900">
      <Link href="/explore" className="flex-1 font-sans text-slate-100 hover:text-slate-300">Explore</Link>
      <Link href="/" className="flex-2 font-semibold text-center text-xl text-slate-100 hover:text-slate-300">LuxGarage</Link>

      {/* {isAdmin ? (
        <Link href="/manage-cars" className="flex flex-1 gap-4 justify-end font-sans  text-slate-100 hover:text-slate-300">
          Manage Cars
        </Link>
      ) : false} */}

      { isAuthenticated ? (
        <div className="flex flex-1 gap-4 justify-end">
          
          {isAdmin ? <Link href="/manage-cars" className="flex flex-1 gap-4 justify-end font-sans  text-slate-100 hover:text-slate-300">
          Manage Cars
        </Link> : false}
          <Link href="/dashboard" className="font-sans text-slate-100 hover:text-slate-300">Dashboard</Link>
          <button onClick={handleLogout} className="font-sans text-slate-100 hover:text-slate-300">Log Out</button>
        </div>
      ) : (
        <div className="flex flex-1 gap-4 justify-end">
          <Link href="/signin" className="font-sans text-slate-100 hover:text-slate-300">Sign In</Link>
        </div>
      )}
    </nav>
  );
}