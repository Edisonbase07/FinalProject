import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  type: "add" | "withdraw" | "send";
  amount: number;
  recipientId?: string;
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, enum: ["add", "withdraw", "send"], required: true },
  amount: { type: Number, required: true },
  recipientId: { type: String }, // only for send
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
