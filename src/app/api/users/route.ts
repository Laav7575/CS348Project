import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, type } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (type === 'signup') {
    try {
      await db.query('INSERT INTO Users (email, userPassword, isAdmin, isDeleted) VALUES (?, ?, FALSE, FALSE)', [email, hashedPassword]);
      // return NextResponse.json({ message: 'User registered' });

      const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
      const user = Array.isArray(rows) ? (rows as any[])[0] : null;

      if (!user) return NextResponse.json({ error: 'Error retrieving user after signup' }, { status: 500 });

      const token = Jwt.sign({ id: user.uID, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return NextResponse.json({ token, user: { email: user.email } });
    } catch (e: any) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
  }

  if (type === 'login') {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    const user = Array.isArray(rows) ? (rows as any[])[0] : null;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    console.log(password, user.userPassword);
    const valid = await bcrypt.compare(password, user.userPassword);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = Jwt.sign({ id: user.uID, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return NextResponse.json({ token, user: { email: user.email } });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

export async function GET(request: Request) {
  try {
      const [rows] = await db.query("SELECT * FROM Users");
      return NextResponse.json(rows);
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}