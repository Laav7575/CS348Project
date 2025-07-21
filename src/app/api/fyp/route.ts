import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

async function getUserId(req: Request): Promise<number | null> {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [userRows]: any[] = await db.query(
      'SELECT uID FROM Users WHERE uID = ? AND isDeleted = false',
      [userId]
    );

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ error: 'User not found or deactivated' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sort_by');

    const sortOptions: Record<string, string> = {
      make: 'make_score DESC, price_score DESC, year_score DESC',
      price: 'price_score DESC, make_score DESC, year_score DESC',
      year: 'year_score DESC, make_score DESC, price_score DESC',
      default: 'recommendation_score DESC, price ASC'
    };

    const orderByClause = sortOptions[sortBy || 'default'] || sortOptions['default'];

    const sqlQuery = `
        SELECT cID, make, model, year, price, recommendation_score, make_score, price_score, year_score
        FROM final_recommendations_view
        WHERE uID = ?
        ORDER BY ${orderByClause}
        LIMIT 25;
        `;
        const [rows]: any[] = await db.query(sqlQuery, [userId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        message: 'No recommendations available. Start by liking some cars to get personalized recommendations!',
        cars: []
      });
    }

    return NextResponse.json({ cars: rows });
  } catch (err) {
    console.error('[GET /api/fyp]', err);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}