// app/api/folder/[fid]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Jwt from "jsonwebtoken";

async function getUserId(req: Request): Promise<number | null> {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const folderId = params.fid;
  console.log(folderId);

  try {
    const [cars] = await db.query(
      "SELECT * FROM carsInFolder WHERE fid = ? AND uid = ? ORDER BY year DESC",
      [folderId, userId]
    );



    if ((cars as any[]).length === 0) {
        return NextResponse.json({ cars: [], stats: null });
    }


    const [rawStats] = await db.query(
      `SELECT 
         COUNT(*) AS folderSize, 
         ROUND(AVG(price)) AS avgPrice,  
         (
           SELECT make FROM carsInFolder
           WHERE fID = ? AND uid = ?
           GROUP BY make
           ORDER BY COUNT(*) DESC
           LIMIT 1
         ) AS commonMake,
         (
           SELECT model FROM carsInFolder
           WHERE fID = ? AND uid = ?
           GROUP BY model
           ORDER BY COUNT(*) DESC
           LIMIT 1
         ) AS commonModel,
         ROUND(AVG(year)) AS avgYear,
         SUM(CASE WHEN isElectric THEN 1 ELSE 0 END) AS electricCount,
         ROUND(AVG(engineSize), 2) AS avgEngineSize,
         ROUND(AVG(horsePower)) AS avgHorsePower,
         ROUND(AVG(torque)) AS avgTorque,
         ROUND(AVG(acceleration), 2) AS avgAcceleration
       FROM carsInFolder
       WHERE fID = ? AND uid = ?`,
      [folderId, userId, folderId, userId, folderId, userId]
    );

    const stats = (rawStats as any[])[0];

    return NextResponse.json({
      cars,
      stats
    });

  } catch (err) {
    console.error("[FOLDER-GET-BY-ID] DB error:", err);
    return NextResponse.json({ error: "Database error 1" }, { status: 500 });
  }
}
