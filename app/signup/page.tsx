"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function getStoredUsers() {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("pocketwallet_allusers");
    if (stored) return JSON.parse(stored);
    return [];
  }
  function saveUsers(users: any[]) {
    localStorage.setItem("pocketwallet_allusers", JSON.stringify(users));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const users = getStoredUsers();
    if (users.some((u: any) => u.email === email)) {
      setError("Email is already registered.");
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      balance: 0,
    };
    saveUsers([newUser, ...users]);
    startTransition(() => {
      router.push("/login");
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Create Your Pocket Wallet Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="john.doe@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-6">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input type="password" id="confirm-password" placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </main>
  );
} 