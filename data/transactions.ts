import { Transaction } from "@/types";

export const transactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    type: "add",
    amount: 500,
    timestamp: new Date("2023-10-26T10:00:00Z"),
  },
  {
    id: "2",
    userId: "1",
    type: "send",
    amount: 100,
    recipientId: "2",
    timestamp: new Date("2023-10-26T11:30:00Z"),
  },
  {
    id: "3",
    userId: "2",
    type: "add",
    amount: 1000,
    timestamp: new Date("2023-10-25T14:00:00Z"),
  },
  {
    id: "4",
    userId: "1",
    type: "withdraw",
    amount: 200,
    timestamp: new Date("2023-10-27T09:00:00Z"),
  },
]; 