// app/api/cars/[cid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { cid: string } }
) {
  try {
    const [rows] = await db.query('SELECT * FROM Cars WHERE cID = ?', [params.cid]);
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
