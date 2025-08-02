"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#2b0000] text-white px-4">
      <div className="w-full max-w-2xl rounded-xl border border-red-900 bg-black/70 p-10 shadow-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4 tracking-wide">
          Welcome to Pocket Wallet
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          The fastest way to store, send, and manage your money. Secure. Stylish. Instant.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="bg-red-800 hover:bg-red-700 text-white w-full sm:w-auto"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="border-red-700 text-red-500 hover:text-white hover:bg-red-700 w-full sm:w-auto"
            onClick={() => router.push("/signup")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </main>
  );
}
