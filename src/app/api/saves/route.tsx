// app/api/saves/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const cID = req.nextUrl.searchParams.get('cID');

  if (!token || !cID) {
    return NextResponse.json({ error: 'Missing token or cID' }, { status: 400 });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decoded.id;

    const [rows] = await db.query(
      `SELECT s.fID FROM Saves s
       JOIN Folders f ON s.fID = f.fID
       WHERE f.uID = ? AND s.cID = ?`,
      [userId, cID]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET SAVES]', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
