import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const [rows] = await db.query(
            `SELECT top.cID, c.make, c.model, c.price, top.saveCount,
            (top.cID = mostSaved.cID) AS isMostSaved
            FROM (
                SELECT s.cID, COUNT(*) AS saveCount
                FROM Saves s
                WHERE s.date >= CURDATE() - INTERVAL 7 DAY
                GROUP BY s.cID
                ORDER BY saveCount DESC
                LIMIT 10
            ) AS top
            JOIN Cars c ON c.cID = top.cID
            LEFT JOIN (
                SELECT s.cID
                FROM Saves s
                WHERE s.date >= CURDATE() - INTERVAL 7 DAY
                GROUP BY s.cID
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) AS mostSaved ON mostSaved.cID = top.cID;
            `
        )
        console.log("Fetched rows:", rows);
        return NextResponse.json(rows);

    } catch (err) {
        console.error('[GET FYP CARS]', err);
    return NextResponse.json({ error: 'Failed to fetch FYP cars' }, { status: 500 });
    }
}
