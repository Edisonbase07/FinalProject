export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "add" | "withdraw" | "send";
  amount: number;
  recipientId?: string;
  timestamp: Date;
} 