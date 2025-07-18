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
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [folders] = await db.query(
      "SELECT fID, folderName FROM Folders WHERE uID = ? AND isLikes = TRUE",
      [userId]
    );

    const [cars] = await db.query(
      `SELECT f.fID, c.cID, c.make, c.model, c.year
         FROM Folders f
         JOIN Saves s ON f.fID = s.fID
         JOIN Cars c ON c.cID = s.cID
         WHERE f.uID = ? AND f.isLikes = TRUE`,
      [userId]
    );

    const foldersWithCars = (folders as any[]).map((folder) => {
      const folderCars = (cars as any[]).filter((c) => c.fID === folder.fID);
      return { ...folder, cars: folderCars };
    });

    return NextResponse.json(foldersWithCars);
  } catch (err) {
    console.error("[FOLDERS‑GET] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { folderName } = await req.json();
  if (!folderName)
    return NextResponse.json({ error: "folderName required" }, { status: 400 });

  try {
    const [existing] = await db.query(
      "SELECT fID FROM Folders WHERE uID = ? AND folderName = ? AND isLikes = TRUE",
      [userId, folderName]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ fID: (existing as any[])[0].fID });
    }

    const [result] = await db.query(
      "INSERT INTO Folders (uID, folderName, isLikes) VALUES (?, ?, TRUE)",
      [userId, folderName]
    );

    return NextResponse.json({ fID: (result as any).insertId });
  } catch (err) {
    console.error("[FOLDER‑POST] DB error:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
