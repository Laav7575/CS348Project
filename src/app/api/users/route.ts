//app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, username, type } = body;

  if (!email || !password || !username) {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (type === "signup") {
    try {
      await db.query(
        "INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES (?, ?, ?, FALSE, FALSE)",
        [username, email, hashedPassword]
      );
      // return NextResponse.json({ message: 'User registered' });

      const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      const user = Array.isArray(rows) ? (rows as any[])[0] : null;

      if (!user)
        return NextResponse.json(
          { error: "Error retrieving user after signup" },
          { status: 500 }
        );

      const token = Jwt.sign(
        { id: user.uID, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      return NextResponse.json({ token, user: { email: user.email } });
    } catch (e: any) {
      if (e.code === "ER_DUP_ENTRY") {
        if (e.sqlMessage.includes("username")) {
          return NextResponse.json(
            { error: "Username already exists" },
            { status: 409 }
          );
        }
        if (e.sqlMessage.includes("email")) {
          return NextResponse.json(
            { error: "Email already exists" },
            { status: 409 }
          );
        }
      }
      return NextResponse.json(
        { error: "Could not sign up" },
        { status: 409 }
      );
    }
  }

  if (type === "login") {
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ? OR username = ?", [
      email,username
    ]);
    if ((rows as any[]).length > 1) return NextResponse.json({ error: "Multiple results found" }, { status: 400 }); 
    const user = Array.isArray(rows) ? (rows as any[])[0] : null;

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.log(password, user.userPassword);
    const valid = await bcrypt.compare(password, user.userPassword);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = Jwt.sign(
      { id: user.uID, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return NextResponse.json({ token, user: { email: user.email } });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    return NextResponse.json({ id: decoded.id });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
