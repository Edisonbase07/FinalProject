import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  await connectDB();
  const { fromUserId, toEmail, amount } = await request.json();

  const sender = await User.findById(fromUserId);
  const receiver = await User.findOne({ email: toEmail.toLowerCase() });

  if (!sender || !receiver) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (sender.balance < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  sender.balance -= amount;
  sender.transactions.push({
    type: "send",
    amount,
    timestamp: new Date(),
    description: `Sent to ${toEmail}`
  });

  receiver.balance += amount;
  receiver.transactions.push({
    type: "receive",
    amount,
    timestamp: new Date(),
    description: `Received from ${sender.email}`
  });

  await sender.save();
  await receiver.save();

  return NextResponse.json({ success: true, sender, receiver });
}