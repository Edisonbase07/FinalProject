"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Button } from "@/components/Button";
import { transactions as mockTransactions } from "@/data/transactions";
import { users as mockUsers } from "@/data/users";
import { User, Transaction } from "@/types";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getStoredTransactions(userId: string): Transaction[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`pocketwallet_transactions_${userId}`);
  if (stored) return JSON.parse(stored).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
  // If not in localStorage, use mock data for first login
  const userTx = mockTransactions.filter(t => t.userId === userId);
  localStorage.setItem(`pocketwallet_transactions_${userId}`, JSON.stringify(userTx));
  return userTx;
}

function saveTransactions(userId: string, txs: Transaction[]) {
  localStorage.setItem(`pocketwallet_transactions_${userId}` , JSON.stringify(txs));
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendError, setSendError] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const router = useRouter();

  function getStoredUsers() {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("pocketwallet_allusers");
    if (stored) return JSON.parse(stored);
    // If not in localStorage, use mock data for first login
    localStorage.setItem("pocketwallet_allusers", JSON.stringify(mockUsers));
    return mockUsers;
  }
  function saveUsers(users: any[]) {
    localStorage.setItem("pocketwallet_allusers", JSON.stringify(users));
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pocketwallet_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setTransactions(getStoredTransactions(u.id));
      } else {
        router.replace("/login");
      }
      setLoading(false);
    }
  }, [router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-700 dark:text-gray-200">Loading...</div>
      </main>
    );
  }

  function handleAddMoney() {
    setError("");
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const newBalance = user!.balance + amount;
    const newTx: Transaction = {
      id: Date.now().toString(),
      userId: user!.id,
      type: "add",
      amount,
      timestamp: new Date(),
    };
    const updatedUser = { ...user!, balance: newBalance };
    const updatedTxs = [newTx, ...transactions];
    setUser(updatedUser);
    setTransactions(updatedTxs);
    localStorage.setItem("pocketwallet_user", JSON.stringify(updatedUser));
    saveTransactions(user!.id, updatedTxs);
    setShowAddModal(false);
    setAddAmount("");
  }

  function handleSendMoney() {
    setSendError("");
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendError("Please enter a valid amount.");
      return;
    }
    if (amount > user!.balance) {
      setSendError("Insufficient funds.");
      return;
    }
    if (!recipientEmail.trim()) {
      setSendError("Please enter a recipient email.");
      return;
    }
    const allUsers = getStoredUsers();
    const recipient = allUsers.find((u: any) => u.email === recipientEmail.trim());
    if (!recipient) {
      setSendError("Recipient not found.");
      return;
    }
    if (recipient.id === user!.id) {
      setSendError("You cannot send money to yourself.");
      return;
    }
    // Update sender
    const newSenderBalance = user!.balance - amount;
    const newSenderTx: Transaction = {
      id: Date.now().toString(),
      userId: user!.id,
      type: "send",
      amount,
      recipientId: recipient.id,
      timestamp: new Date(),
    };
    const updatedSender = { ...user!, balance: newSenderBalance };
    const updatedSenderTxs = [newSenderTx, ...transactions];
    setUser(updatedSender);
    setTransactions(updatedSenderTxs);
    localStorage.setItem("pocketwallet_user", JSON.stringify(updatedSender));
    saveTransactions(user!.id, updatedSenderTxs);
    // Update recipient
    const newRecipientBalance = recipient.balance + amount;
    const newRecipientTx: Transaction = {
      id: Date.now().toString() + "r",
      userId: recipient.id,
      type: "add",
      amount,
      timestamp: new Date(),
    };
    const recipientTxs = getStoredTransactions(recipient.id);
    const updatedRecipient = { ...recipient, balance: newRecipientBalance };
    const updatedRecipientTxs = [newRecipientTx, ...recipientTxs];
    saveTransactions(recipient.id, updatedRecipientTxs);
    // Update all users
    const updatedUsers = allUsers.map((u: any) =>
      u.id === user!.id ? updatedSender : u.id === recipient.id ? updatedRecipient : u
    );
    saveUsers(updatedUsers);
    setShowSendModal(false);
    setSendAmount("");
    setRecipientEmail("");
  }

  function handleWithdrawMoney() {
    setWithdrawError("");
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }
    if (amount > user!.balance) {
      setWithdrawError("Insufficient funds.");
      return;
    }
    const newBalance = user!.balance - amount;
    const newTx: Transaction = {
      id: Date.now().toString(),
      userId: user!.id,
      type: "withdraw",
      amount,
      timestamp: new Date(),
    };
    const updatedUser = { ...user!, balance: newBalance };
    const updatedTxs = [newTx, ...transactions];
    setUser(updatedUser);
    setTransactions(updatedTxs);
    localStorage.setItem("pocketwallet_user", JSON.stringify(updatedUser));
    saveTransactions(user!.id, updatedTxs);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  }

  function handleLogout() {
    localStorage.removeItem("pocketwallet_user");
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {user.name}!
          </h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800 dark:text-white">
                ${user!.balance.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button onClick={() => setShowAddModal(true)}>Add Money</Button>
              <Button variant="destructive" onClick={() => setShowWithdrawModal(true)}>Withdraw Money</Button>
              <Button variant="secondary" onClick={() => setShowSendModal(true)}>Send Money</Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your most recent transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {transaction.type === "add"
                          ? "Added Money"
                          : transaction.type === "withdraw"
                          ? "Withdrew Money"
                          : `Sent to ${transaction.recipientId}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${
                        transaction.type === "add"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "add" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white p-6 shadow-lg w-full max-w-xs dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Add Money</h2>
            <input
              type="number"
              min="1"
              className="mb-2 w-full rounded border px-3 py-2 text-lg text-gray-800 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
            />
            {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => { setShowAddModal(false); setAddAmount(""); setError(""); }}>Cancel</Button>
              <Button onClick={handleAddMoney}>Add</Button>
            </div>
          </div>
        </div>
      )}
      {/* Send Money Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white p-6 shadow-lg w-full max-w-xs dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Send Money</h2>
            <input
              type="email"
              className="mb-2 w-full rounded border px-3 py-2 text-lg text-gray-800 dark:bg-gray-700 dark:text-white"
              placeholder="Recipient's email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
            />
            <input
              type="number"
              min="1"
              className="mb-2 w-full rounded border px-3 py-2 text-lg text-gray-800 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
              value={sendAmount}
              onChange={e => setSendAmount(e.target.value)}
            />
            {sendError && <div className="mb-2 text-red-500 text-sm">{sendError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => { setShowSendModal(false); setSendAmount(""); setRecipientEmail(""); setSendError(""); }}>Cancel</Button>
              <Button onClick={handleSendMoney}>Send</Button>
            </div>
          </div>
        </div>
      )}
      {/* Withdraw Money Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white p-6 shadow-lg w-full max-w-xs dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Withdraw Money</h2>
            <input
              type="number"
              min="1"
              className="mb-2 w-full rounded border px-3 py-2 text-lg text-gray-800 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />
            {withdrawError && <div className="mb-2 text-red-500 text-sm">{withdrawError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); setWithdrawError(""); }}>Cancel</Button>
              <Button variant="destructive" onClick={handleWithdrawMoney}>Withdraw</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 