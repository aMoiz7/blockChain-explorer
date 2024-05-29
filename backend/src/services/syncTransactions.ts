import { fetchLatestBlockNumber, fetchBlockTransactions } from '../services/transactionService';

export const startDataPolling = () => {
  setInterval(async () => {
    try {
      const latestBlockNumber = await fetchLatestBlockNumber();
      for (let i = latestBlockNumber - 10; i <= latestBlockNumber; i++) {
        await fetchBlockTransactions(i);
      }
    } catch (err) {
      console.error(err);
    }
  }, 30000); // Poll every 30 seconds
};
