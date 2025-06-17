import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action')
  const query = searchParams.get('q') || '';

  if (action === 'all') {
    try {
        const [rows] = await db.query("SELECT * FROM Cars");
        return NextResponse.json(rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  } else if (action === 'search') {
    try {
        const [rows] = await db.query(
            `SELECT * FROM Cars WHERE make LIKE ? OR model LIKE ?`,
            [`%${query}%`, `%${query}%`]
        );
        console.log("here",rows);
        return NextResponse.json(rows);
    } catch (err) {
        console.error('Search error:', err);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'No action specified' }, { status: 500 });
  }
}
