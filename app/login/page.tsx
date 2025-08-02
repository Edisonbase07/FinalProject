"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Login failed");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
        router.push("/dashboard");
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#2b0000]">
      <div className="w-full max-w-md rounded-lg border border-red-900 bg-black/70 p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Pocket Wallet Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 text-white border border-red-800"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 text-white border border-red-800"
            />
          </div>
          {error && (
            <div className="mb-4 text-center text-sm text-red-500">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 flex justify-between">
          <Button
            variant="ghost"
            className="text-white hover:underline"
            onClick={() => router.push("/signup")}
          >
            Create Account
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:underline"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
