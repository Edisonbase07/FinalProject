import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const userId = params.id;
    const { type, amount, recipientId } = await req.json();

    if (!['add', 'withdraw', 'send'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (type === 'add') {
      user.balance += amount;
      user.transactions.push({
        type: 'add',
        amount,
        description: 'Added funds',
        timestamp: new Date()
      });

    } else if (type === 'withdraw') {
      if (user.balance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      user.balance -= amount;
      user.transactions.push({
        type: 'withdraw',
        amount,
        description: 'Withdrew funds',
        timestamp: new Date()
      });

    } else if (type === 'send') {
      if (!recipientId) {
        return NextResponse.json({ error: 'Recipient email required' }, { status: 400 });
      }

      if (user.balance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      const recipient = await User.findOne({ email: recipientId.toLowerCase() });
      if (!recipient) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
      }

      if (recipient._id.equals(user._id)) {
        return NextResponse.json({ error: 'Cannot send to yourself' }, { status: 400 });
      }

      // 💸 Deduct and credit balances
      user.balance -= amount;
      recipient.balance += amount;

      // 🧾 Add transaction to sender
      user.transactions.push({
        type: 'send',
        amount,
        description: `Sent to ${recipient.email}`,
        timestamp: new Date()
      });

      // 🧾 Add transaction to recipient
      recipient.transactions.push({
        type: 'receive',
        amount,
        description: `Received from ${user.email}`,
        timestamp: new Date()
      });

      await recipient.save(); // 💾 Save recipient with updated balance and transaction
    }

    await user.save(); // 💾 Save sender (or user) with updated balance and transaction

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
