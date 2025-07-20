import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
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

    const { cID } = await req.json();
    if (!cID)
      return NextResponse.json({ error: "Missing car ID" }, { status: 400 });

    await db.query("DELETE FROM Cars WHERE cID = ?", [cID]);

    return NextResponse.json({ message: "Car deleted" });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
