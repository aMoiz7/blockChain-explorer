// services/transactionService.ts

import axios from 'axios';
import Transaction from './../models/transaction';

const STARKNET_API = process.env.STARKNET_API || '';


export const fetchLatestBlockNumber = async (): Promise<number> => {
  try {
    const response = await axios.post(STARKNET_API, {
      jsonrpc: '2.0',
      method: 'starknet_blockNumber',
      params: [],
      id: 1
    });

    return response.data.result;
  } catch (error:any) {
    console.error('Error fetching latest block number:', error.message);
    throw new Error('Error fetching latest block number');
  }
};



export const fetchBlockTransactions = async (blockNumber: number) => {
  try {
    const response = await axios.post(STARKNET_API, {
      jsonrpc: '2.0',
      method: 'starknet_getBlockWithTxs',
      params: [{ block_number: blockNumber }],
      id: 1
    });

    const transactions = response.data.result.transactions;
    const timestamp = response.data.result.timestamp;

    for (const tx of transactions) {
      try {
        const transactionHash = tx.transaction_hash;
  
        // Fetch transaction details from starknet_getTransactionByHash
        const transactionHashDetails = await fetchTransactionByHash(transactionHash);
  
        // Fetch transaction receipt details from starknet_getTransactionReceipt
        const transactionReceiptDetails = await fetchTransactionReceipt(transactionHash);
  
        // Create new transaction object
        const newTransaction = new Transaction({
          hash: transactionHash,
          blockNumber: blockNumber,
          timestamp: timestamp,
          type: tx.type,
          status: 'ACCEPTED_ON_L2',
          nonce: tx.nonce,
          transactionHashDetails: transactionHashDetails,
          transactionReceiptDetails: transactionReceiptDetails
        });
  
        // Save transaction to database
        await newTransaction.save();
      } catch (error:any) {
        if (error.code === 11000) {
          console.error('Duplicate key error:', error.message);
          continue; // Skip this transaction and continue with the next one
      } else {
          // Handle other errors
          console.error('Error saving transaction:', error.message);
          throw new Error('Error saving transaction');
      }
      }
    }
  } catch (error:any) {
    console.error('Error fetching block transactions:', error.message);
    throw new Error('Error fetching block transactions');
  }
};

export const fetchTransactionByHash = async (transactionHash: string) => {
  try {
    const response = await axios.post(STARKNET_API, {
      jsonrpc: '2.0',
      id: 0,
      method: 'starknet_getTransactionByHash',
      params: [transactionHash]
    });

    return response.data.result;
  } catch (error:any) {
    console.error('Error fetching transaction by hash:', error.message);
    throw new Error('Error fetching transaction by hash');
  }
};

export const fetchTransactionReceipt = async (transactionHash: string) => {
  try {
    const response = await axios.post(STARKNET_API, {
      jsonrpc: '2.0',
      id: 0,
      method: 'starknet_getTransactionReceipt',
      params: [transactionHash]
    });

    return response.data.result;
  } catch (error:any) {
    console.error('Error fetching transaction receipt:', error.message);
    throw new Error('Error fetching transaction receipt');
  }
};
