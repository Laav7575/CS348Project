import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const [rows] = await db.query("SELECT uID, email, isAdmin FROM Users WHERE uID = ?", [
      decoded.id,
    ]);

    const user = Array.isArray(rows) ? (rows as any[])[0] : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.uID,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
}
