'use client';
import { useState } from 'react';
import NavBar from "../../components/NavBar";

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSignIn = async () => {
    console.log("sign in attempt")
    //const res = await fetch(`/api/cars?action=search&q=${encodeURIComponent(query)}`);
    //const data = await res.json();
    //setResults(data);
  };

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 flex flex-col relative">
        <div className="flex flex-col items-center gap-4 box-border">
          <input type="text" placeholder="Username or email" 
            className="border p-2 w-full max-w-100" />
          <input type="text" placeholder="Password" 
            className="border p-2 grow-5 w-full max-w-100" />
        <div className="mt-4 gap-2">
            <div></div>
            <button onClick={handleSignIn}> Sign In </button>
        </div>
        </div>
      </div>
    </div>
  );
};
