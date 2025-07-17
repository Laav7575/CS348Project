import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Jwt from "jsonwebtoken";

async function getUserId(req: Request): Promise<number | null> {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
    const searchParams = new URL(req.url).searchParams;
    const cid = searchParams.get('cid');

    try {
        const [rows] = await db.query(
        "SELECT * FROM Reviews WHERE cID = ?", cid
        );

        return NextResponse.json(rows);
    } catch (err) {
        console.error("[REVIEWS‑GET] DB error:", err);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cID, comment, stars } = await req.json();

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    try {
        const [existing] = await db.query(
            "SELECT * FROM Reviews WHERE uid = ? AND cid = ?",
            [userId, cID]
        );

        if ((existing as any[]).length > 0) {
            await db.query(
                "UPDATE Reviews SET comment = ?, stars = ?, updatedDate = ? WHERE uid = ? AND cid = ?",
                [comment, stars, today, userId, cID]
            );
            return NextResponse.json({ success: true, updated: true });
        } else {
            const [rows] = await db.query(
                "INSERT INTO Reviews (uid, cid, comment, createdDate, updatedDate, stars) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    userId,
                    cID,
                    comment,
                    today,
                    today,
                    stars
                ]
            );
            return NextResponse.json({ success: true, reviewId: (rows as any).insertId });
        }
    } catch (err) {
        console.error("[REVIEWS‑GET] DB error:", err);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
