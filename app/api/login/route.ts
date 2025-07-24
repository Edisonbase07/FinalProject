import { NextRequest, NextResponse } from "next/server";
import { users as mockUsers } from "@/data/users";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Try to get users from localStorage (if running in browser)
  let users = mockUsers;
  if (typeof globalThis.localStorage !== "undefined") {
    const stored = globalThis.localStorage.getItem("pocketwallet_allusers");
    if (stored) {
      users = JSON.parse(stored);
    }
  }

  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, balance: user.balance },
  });
} 