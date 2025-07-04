import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const [rows] = await db.query("SELECT fID, folderName FROM Folders WHERE uID = ?", [decoded.id]);
        return NextResponse.json(rows);
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
}
