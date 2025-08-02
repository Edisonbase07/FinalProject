"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Signup failed");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
        router.push("/dashboard");
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#2b0000]">
      <div className="w-full max-w-md rounded-lg border border-red-900 bg-black/70 p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-800 text-white border border-red-800"
            />
          </div>
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
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Button
            variant="ghost"
            className="text-white hover:underline"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </main>
  );
}
