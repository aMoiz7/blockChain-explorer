import { Schema, model } from 'mongoose';

interface ITransaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  type: string;
  status: string;
  nonce: number;
  transactionHashDetails?: any; // Additional data from the first API
  transactionReceiptDetails?: any; 
}

const transactionSchema = new Schema<ITransaction>({
  hash: { type: String, required: true },
  blockNumber: { type: Number, required: true,},
  timestamp: { type: Number,required: true, },
  type: { type: String, required: true,},
  status: { type: String,required: true, },
  nonce: { type: Number,required: true, },
  transactionHashDetails: Schema.Types.Mixed, // Store additional data from the first API
  transactionReceiptDetails: Schema.Types.Mixed,
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
