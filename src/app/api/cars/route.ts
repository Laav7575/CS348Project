import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action')
  const query = searchParams.get('q') || '';

  if (action === 'all') {
    try {
        const [rows] = await db.query("SELECT * FROM fullCars");
        return NextResponse.json(rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  } else if (action === 'search') {
    // try {
    //     const [rows] = await db.query(
    //         `SELECT * FROM Cars WHERE make LIKE ? OR model LIKE ?`,
    //         [`%${query}%`, `%${query}%`]
    //     );
    //     console.log("here",rows);
    //     return NextResponse.json(rows);
    // } catch (err) {
    //     console.error('Search error:', err);
    //     return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    // }
    try {
    let sql = `SELECT * FROM Cars WHERE (make LIKE ? OR model LIKE ?)`;
    let values: any[] = [`%${query}%`, `%${query}%`];

    const numericFilters = [
      'price', 'year', 'engineSize', 'horsePower', 'torque', 'acceleration'
    ];

    for (const key of numericFilters) {
      const min = searchParams.get(`${key}Min`);
      const max = searchParams.get(`${key}Max`);
      if (min !== null && min !== '') {
        sql += ` AND ${key} >= ?`;
        values.push(Number(min));
      }
      if (max !== null && max !== '') {
        sql += ` AND ${key} <= ?`;
        values.push(Number(max));
      }
    }

    const [rows] = await db.query(sql, values);
    return NextResponse.json(rows);
    } catch (err) {
      console.error('Search error:', err);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

  } else if (action === 'details') {
    const cid = searchParams.get('cid');
    const [rows] = await db.query('SELECT * FROM Cars WHERE cID = ?', [cid]);
    return NextResponse.json(rows);
  } else {
    return NextResponse.json({ error: 'No action specified' }, { status: 500 });
  }
}
