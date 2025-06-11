import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-8 bg-linear-180 from-gray-950 to-gray-900">
      <Link href="/search" className="font-sans text-slate-100 hover:text-slate-300">Search</Link>
      <Link href="/" className="font-semibold text-xl text-slate-100 hover:text-slate-300">LuxGarage</Link>
      <Link href="/signin" className="font-sans text-slate-100 hover:text-slate-300">Sign In</Link>
    </nav>
  );
}