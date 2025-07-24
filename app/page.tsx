import { Button } from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Pocket Wallet
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          Your secure and easy-to-use E-Wallet Simulator.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 