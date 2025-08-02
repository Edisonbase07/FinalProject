import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
// ✅ Only needed if you're separately saving Transaction documents
import Transaction from '@/models/Transaction';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const userId = params.id;
    const { type, amount, recipientId } = await req.json();

    console.log("🔁 Incoming transaction:", { userId, type, amount, recipientId });

    if (!['add', 'withdraw', 'send'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (type === 'add') {
      user.balance += amount;
      user.transactions.push({
        type: 'add',
        amount,
        description: 'Added funds',
        timestamp: new Date(),
      });

      await user.save();
    }

    if (type === 'withdraw') {
      if (user.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      user.balance -= amount;
      user.transactions.push({
        type: 'withdraw',
        amount,
        description: 'Withdrew funds',
        timestamp: new Date(),
      });

      await user.save();
    }

    if (type === 'send') {
      if (!recipientId) {
        return NextResponse.json(
          { error: 'Recipient email required' },
          { status: 400 }
        );
      }

      const recipient = await User.findOne({
        email: recipientId.toLowerCase(),
      });
      if (!recipient) {
        return NextResponse.json(
          { error: 'Recipient not found' },
          { status: 404 }
        );
      }

      if (recipient._id.equals(user._id)) {
        return NextResponse.json(
          { error: 'Cannot send to yourself' },
          { status: 400 }
        );
      }

      if (user.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      user.balance -= amount;
      recipient.balance += amount;

      user.transactions.push({
        type: 'send',
        amount,
        description: `Sent to ${recipient.email}`,
        timestamp: new Date(),
      });

      recipient.transactions.push({
        type: 'receive',
        amount,
        description: `Received from ${user.email}`,
        timestamp: new Date(),
      });

      await user.save();
      await recipient.save();
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error('❌ Transaction error:', err.message);
    console.error(err.stack);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
