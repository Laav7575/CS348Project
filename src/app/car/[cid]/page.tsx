// app/car/[cid]/page.tsx
import { notFound } from "next/navigation";
import SaveToFolder from "@/components/SaveToFolder";
import LikeButton from "@/components/LikeButton";
import NavBar from "@/components/NavBar";

interface Car {
  cID: string;
  make: string;
  model: string;
  year: number;
  isElectric: boolean;
  engineSize: number;
  horsePower: number;
  torque: number;
  acceleration: number;
  price: number;
}

async function getCar(cid: string): Promise<Car | null> {
  const res = await fetch(
    `http://localhost:3000/api/cars?action=details&cid=${cid}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data[0];
}

export default async function CarDetails({
  params,
}: {
  params: { cid: string };
}) {
  const car = await getCar(params.cid);
  if (!car) return notFound();

  return (
    <div className="h-screen">
      <NavBar />
      <div className="p-10 text-white">
        <h1 className="text-4xl font-bold">
          {car.make} {car.model}
        </h1>
        <ul className="mt-4 leading-8">
          <li>Year: {car.year}</li>
          <li>Electric: {car.isElectric ? "Yes" : "No"}</li>
          <li>Engine: {car.engineSize} L</li>
          <li>Horsepower: {car.horsePower} HP</li>
          <li>Torque: {car.torque} lb⋅ft</li>
          <li>Acceleration: {car.acceleration} s</li>
          <li>Price: ${car.price.toLocaleString()}</li>
        </ul>

        <LikeButton cID={car.cID} />
        <SaveToFolder cID={car.cID} />
      </div>
    </div>
  );
}
