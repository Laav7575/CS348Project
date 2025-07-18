import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtError) {
      console.error("JWT verify error:", jwtError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { make, model, year, price, engineSize, isElectric, horsePower, torque, acceleration } = body;

    // Validate required fields
    if (!make || !model || !year || !price) {
      return NextResponse.json({ error: "Make, Model, Year, and Price are required" }, { status: 400 });
    }

    try {
      await db.query("BEGIN");

      await db.query(
        `INSERT INTO Cars (make, model, year, price, engineSize, isElectric, horsePower, torque, acceleration) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          make,
          model,
          year,
          price,
          engineSize || null,
          isElectric ?? false,
          horsePower || null,
          torque || null,
          acceleration || null,
        ]
      );

      await db.query("COMMIT");

      return NextResponse.json({ message: "Car added successfully" });
    } catch (err) {
      await db.query("ROLLBACK");
      console.error("Transaction failed:", err);
      return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
    }
  } catch (error) {
    console.error("Add car error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
