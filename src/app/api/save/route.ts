import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Jwt from 'jsonwebtoken';

async function getUserId(req: Request): Promise<number | null> {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
  }

  const { cID, fID } = await req.json();
  if (!cID || !fID) {
    return NextResponse.json({ error: 'cID and fID required' }, { status: 400 });
  }

  try {
    const [folders] = await db.query(
      'SELECT fID FROM Folders WHERE fID = ? AND uID = ?',
      [fID, userId]
    );

    if ((folders as any[]).length === 0) {
      return NextResponse.json({ error: 'Folder not found or not owned by user' }, { status: 403 });
    }

    await db.query('INSERT IGNORE INTO Saves (fID, cID, date) VALUES (?, ?, CURDATE())', [fID, cID]);

    return NextResponse.json({ success: true, message: 'Car saved to folder!' });
  } catch (err) {
    console.error('[SAVE‑POST] DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
    }
  
    const { cID, fID } = await req.json();
  
    if (!cID) {
      return NextResponse.json({ error: 'Missing cID' }, { status: 400 });
    }
  
    try {
      if (fID) {
        // Delete from one folder
        await db.query(
          `DELETE FROM Saves 
           WHERE fID = ? AND cID = ? 
           AND fID IN (SELECT fID FROM Folders WHERE uID = ?)`,
          [fID, cID, userId]
        );
      } else {
        // Delete from all folders owned by user
        await db.query(
          `DELETE s FROM Saves s
           JOIN Folders f ON s.fID = f.fID
           WHERE f.uID = ? AND s.cID = ?`,
          [userId, cID]
        );
      }
  
      return NextResponse.json({ success: true, message: 'Car unsaved successfully' });
    } catch (err) {
      console.error('[SAVE‑DELETE] DB error:', err);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }
