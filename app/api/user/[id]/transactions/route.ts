import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const user = await User.findById(params.id).select('transactions');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ transactions: user.transactions }, { status: 200 });
}
