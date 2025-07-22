import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
    //query for top 10 cars
    const [topRows] = await db.query(
        `SELECT s.cID, c.make, c.model, c.price, c.year, COUNT(*) AS saveCount
       FROM Saves s
       JOIN Cars c ON s.cID = c.cID
       WHERE s.date >= CURDATE() - INTERVAL 7 DAY
       GROUP BY s.cID
       ORDER BY saveCount DESC
       LIMIT 10`
    );

    //query for most saved car
    const [mostSavedRowResult] = await db.query(
        `SELECT s.cID
        FROM Saves s
        WHERE s.date >= CURDATE() - INTERVAL 7 DAY
        GROUP BY s.cID
        ORDER BY COUNT(*) DESC
        LIMIT 1`
    );


    const mostSavedRow = mostSavedRowResult as any[];
    const mostSavedCID = mostSavedRow.length > 0 ? mostSavedRow[0].cID : null;
    const rowsWithFlag = (topRows as any[]).map((row) => ({
      ...row,
      isMostSaved: row.cID === mostSavedCID ? 1 : 0,
    }));

    return NextResponse.json(rowsWithFlag);
    } catch (err) {
        console.error('[GET TRENDING CARS]', err);
    return NextResponse.json({ error: 'Failed to fetch trending cars' }, { status: 500 });
    }
}
