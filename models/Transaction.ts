// models/Transaction.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: "add" | "withdraw" | "send" | "receive";
  description?: string;
  recipientId?: mongoose.Types.ObjectId;
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["add", "withdraw", "send", "receive"], required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
