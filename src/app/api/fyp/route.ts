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
    // 1. Get liked cars
    const [likedRows]: any[] = await db.query(`
      SELECT c.*
      FROM Folders f
      JOIN Saves s ON f.fID = s.fID
      JOIN Cars c ON s.cID = c.cID
      WHERE f.isLikes = TRUE AND f.uID = ?
    `, [userId]);

    if (!likedRows || likedRows.length === 0) {
      return NextResponse.json({
        message: 'No recommendations available. Start by liking some cars to get personalized recommendations!',
        cars: []
      });
    }

    // 2. Build preferences
    const likedMakes = Array.from(new Set(likedRows.map((car: any) => car.make)));
    const avgPrice = likedRows.reduce((sum: number, car: any) => sum + car.price, 0) / likedRows.length;
    const avgYear = likedRows.reduce((sum: number, car: any) => sum + car.year, 0) / likedRows.length;

    const minPrice = Math.min(...likedRows.map((car: any) => car.price)) * 0.7;
    const maxPrice = Math.max(...likedRows.map((car: any) => car.price)) * 1.3;

    const minYear = Math.min(...likedRows.map((car: any) => car.year)) - 5;
    const maxYear = Math.max(...likedRows.map((car: any) => car.year)) + 5;

    // 3. Get all other cars (excluding liked)
    const [candidateRows]: any[] = await db.query(`
      SELECT * FROM Cars
      WHERE cID NOT IN (
        SELECT s.cID
        FROM Folders f
        JOIN Saves s ON f.fID = s.fID
        WHERE f.isLikes = TRUE AND f.uID = ?
      )
    `, [userId]);

    // 4. Score cars in JS
    const scoredCars = candidateRows.map((car: any) => {
      const makeScore = likedMakes.includes(car.make) ? 100 : 0;
      const priceScore = (car.price >= minPrice && car.price <= maxPrice)
        ? 50 * (1 - Math.abs(car.price - avgPrice) / Math.max(avgPrice, 1))
        : 0;
      const yearScore = (car.year >= minYear && car.year <= maxYear)
        ? 30 * (1 - Math.abs(car.year - avgYear) / Math.max(avgYear - 1900, 1))
        : 0;

      const recommendation_score = Math.round(makeScore + priceScore + yearScore);

      return {
        ...car,
        make_score: makeScore,
        price_score: Math.round(priceScore * 100) / 100,
        year_score: Math.round(yearScore * 100) / 100,
        recommendation_score
      };
    });

    // 5. Sort by query param
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sort_by') || 'default';

    interface Car {
        cID: number;
        make: string;
        price: number;
        year: number;
        [key: string]: any;
    }

    interface ScoredCar extends Car {
        make_score: number;
        price_score: number;
        year_score: number;
        recommendation_score: number;
    }

    const sortedCars: ScoredCar[] = scoredCars
        .filter((car: ScoredCar) => car.recommendation_score > 0)
        .sort((a: ScoredCar, b: ScoredCar) => {
            switch (sortBy) {
                case 'make':
                    return b.make_score - a.make_score || b.price_score - a.price_score || b.year_score - a.year_score;
                case 'price':
                    return b.price_score - a.price_score || b.make_score - a.make_score || b.year_score - a.year_score;
                case 'year':
                    return b.year_score - a.year_score || b.make_score - a.make_score || b.price_score - a.price_score;
                default:
                    return b.recommendation_score - a.recommendation_score || a.price - b.price;
            }
        });

    return NextResponse.json(sortedCars.slice(0, 25));
  } catch (err) {
    console.error('[GET /api/fyp]', err);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
