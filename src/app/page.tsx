import Image from "next/image";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className="bg-gray-900 h-screen w-screen">
      <NavBar />
      <div className="flex justify-center items-left px-32 h-8/10">
        <div className="flex flex-col justify-center items-left">
          <div className="text-5xl/16 text-slate-100 w-100">
            <span className="text-amber-300 pr-3">Discover</span>your dream car.
          </div>
          <div>
            <a className="inline-flex items-center gap-2 bg-white px-10 py-3 mt-6 w-fit rounded-md hover:bg-amber-300" href="/search">Explore →</a>
          </div>
        </div>
        <div className="flex justify-center items-left">
          <img src="https://static.tcimg.net/vehicles/primary/bb13c0ef7e284939/2023-McLaren-Artura-silver-full_color-driver_side_front_quarter.png"
          className="w-132 h-auto object-contain"></img>
        </div>
      </div>
    </div>
  );
}
