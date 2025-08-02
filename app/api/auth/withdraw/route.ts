import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  await connectDB();
  const { userId, amount } = await request.json();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.balance < amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  user.balance -= amount;
  user.transactions.push({
    type: "withdraw",
    amount,
    timestamp: new Date(),
    description: "Withdraw money"
  });
  await user.save();

  return NextResponse.json({ success: true, user });
}