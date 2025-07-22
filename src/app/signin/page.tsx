'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import NavBar from "../../components/NavBar";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info", err);
        setIsAuthenticated(false);
      });
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    console.log("sign in attempt")
    e.preventDefault();
    const res = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: identifier, password, username: identifier, type: 'login' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  };

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative">
        <form className="flex flex-col items-center gap-4 box-border" onSubmit={handleSignIn}>
          <h2 className="text-2xl mb-4">Welcome back!</h2>
          <input className="border p-2 w-full max-w-100" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Email or Username" />
          <input className="border p-2 w-full max-w-100" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="mt-4 gap-4 w-full max-w-100 flex flex-col">
              <button type="submit" className="w-full gap-2 p-2 cursor-pointer border-2 border-solid border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white">
                Sign In
              </button>
              <div>
                Don't have an account? <Link href="/signup" className="text-amber-600 underline">Sign Up</Link>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};
