'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import NavBar from "../../components/NavBar";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded) {
          setIsAuthenticated(true);
          router.replace('/');
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    console.log("sign up attempt")
    e.preventDefault();
    const res = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username, type: 'signup' }),
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
        <form className="flex flex-col items-center gap-4 box-border" onSubmit={handleSignUp}>
          <h2 className="text-2xl mb-4">Welcome!</h2>
          <input className="border p-2 w-full max-w-100" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input className="border p-2 w-full max-w-100" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input className="border p-2 w-full max-w-100" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="mt-4 gap-4 w-full max-w-100 flex flex-col">
              <button type="submit" className="w-full gap-2 p-2 cursor-pointer border-2 border-solid border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white">
                Sign Up
              </button>
              <div>
                Already have an account? <Link href="/signin" className="text-amber-600 underline">Sign In</Link>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};
