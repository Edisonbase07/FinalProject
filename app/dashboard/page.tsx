"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Button } from "@/components/Button";
import { getCurrentUser, logoutUser } from "@/lib/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  _id: string;
  amount: number;
  type: "add" | "withdraw" | "send" | "receive";
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);
    setTransactions([]);
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const handleAddMoney = async () => {
    setError("");
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const res = await fetch(`/api/user/${user!._id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "add", amount }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    setUser(data.user);
    setTransactions(data.user.transactions);
    setAddAmount("");
    setShowAddModal(false);
  };

  const handleWithdrawMoney = async () => {
    setWithdrawError("");
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }
    const res = await fetch(`/api/user/${user!._id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "withdraw", amount }),
    });
    const data = await res.json();
    if (!res.ok) {
      setWithdrawError(data.error || "Something went wrong");
      return;
    }
    setUser(data.user);
    setTransactions(data.user.transactions);
    setWithdrawAmount("");
    setShowWithdrawModal(false);
  };

  const handleSendMoney = async () => {
    setSendError("");
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendError("Please enter a valid amount.");
      return;
    }
    const res = await fetch(`/api/user/${user!._id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "send",
        amount,
        recipientId: recipientEmail,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSendError(data.error || "Something went wrong");
      return;
    }
    setUser(data.user);
    setTransactions(data.user.transactions);
    setSendAmount("");
    setRecipientEmail("");
    setShowSendModal(false);
  };

  if (loading || !user)
    return <div className="p-10 text-white">Loading...</div>;

  return (
    <main className="p-6 min-h-screen bg-gradient-to-tr from-black via-zinc-900 to-gray-900 text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-800 border border-red-600 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-500 tracking-wide uppercase">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono font-bold text-white">
              ₱{user.balance.toFixed(2)}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => setShowAddModal(true)}>Add</Button>
            <Button
              variant="destructive"
              onClick={() => setShowWithdrawModal(true)}
            >
              Withdraw
            </Button>
            <Button variant="secondary" onClick={() => setShowSendModal(true)}>
              Send
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 bg-zinc-800 border border-red-600 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-500 tracking-wide uppercase">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {transactions.length === 0 && (
                <li className="text-gray-400">No transactions found</li>
              )}
              {transactions.map((tx) => (
                <li
                  key={tx.timestamp.toString()}
                  className="flex justify-between border-b border-zinc-700 pb-1"
                >
                  <span>{tx.type}</span>
                  <span className="text-red-400">₱{tx.amount}</span>
                  <span className="text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
