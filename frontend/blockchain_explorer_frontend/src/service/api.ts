import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

interface Transaction {
  hash: string;
  type: string;
  blockNumber: number;
  timestamp: number;
  status: string;
}

interface ApiResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export const fetchTransactions = async (page: number, type?: string): Promise<ApiResponse> => {
  const response = await axios.get(`${API_URL}/transactions`, {
    params: { page, type }
  });
  console.log(response.data.data,"data")
  return response.data.data;
};


export const fetchTransactionDetails = async (hash: string) => {
    
    console.log(hash)
    try {
      const response = await axios.get(`${API_URL}/transactions/${hash}`);
      console.log(response,"deatails")
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  };
  
  export const fetchEthPrice = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPriceUSD = data.ethereum.usd;
        return ethPriceUSD;
    } catch (error) {
        console.error('Error fetching ETH price:', error);
        throw new Error('Error fetching ETH price');
    }
  };