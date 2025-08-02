import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const user = await User.findById(params.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    id: user._id,
    email: user.email,
    balance: user.balance,
    transactions: user.transactions
  })
}
