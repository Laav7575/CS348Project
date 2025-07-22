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

    jwt.verify(token, process.env.JWT_SECRET!);

    const { cIDs } = await req.json();

    if (!Array.isArray(cIDs) || cIDs.length === 0) {
      return NextResponse.json({ error: "Missing or invalid car IDs" }, { status: 400 });
    }

    try {
        await db.query("BEGIN");

        const placeholders = cIDs.map(() => '?').join(',');
        const sql = `DELETE FROM Cars WHERE cID IN (${placeholders})`;

        await db.query(sql, cIDs);

        await db.query("COMMIT");

        return NextResponse.json({ message: "Cars successfully deleted" });
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("Transaction failed:", err);
        return NextResponse.json({ error: "Failed to bulk delete cars" }, { status: 500 });
    }
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
