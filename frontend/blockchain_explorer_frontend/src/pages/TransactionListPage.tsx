import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchTransactions } from '../service/api';
import { useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';
import { useDarkMode } from '../context/darkMode';
import 'tailwindcss/tailwind.css';
import { FaSun } from 'react-icons/fa';

interface Transaction {
  hash: string;
  type: string;
  blockNumber: number;
  timestamp: number;
  status: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>('');
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    loadTransactions();
  }, [type]);

  const loadTransactions = async () => {
    try {
      const response = await fetchTransactions(page, type);
      const newTransactions = response.transactions;
      setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
      setHasMore(newTransactions.length > 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchMoreTransactions = () => {
    setPage((prevPage) => prevPage + 1);
    loadTransactions();
  };

  const handleFilterChange = (newType: string) => {
    setType(newType);
    setTransactions([]);
    setPage(1);
  };

  const handleHashClick = (hash: string) => {
    navigate(`/transaction/${hash}`);
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className={`${darkMode ? 'bg-neutral-800  text-white' : 'bg-white text-black'} min-h-screen flex items-center justify-center`}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
        
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2  text-white rounded-3xl text-3xl w"
          >
            <FaSun className=' w-16 h-15 text-blue-700'/>
          </button>
        </div>
        <h5 className="text-xl font-bold">A list of transactions on Starknet</h5>
        <div className="flex mb-4 space-x- mt-6 ">
          <button onClick={() => handleFilterChange('')} className={`px-4 py-2 rounded ${type === '' ? 'bg-neutral-900 text-gray-400 '  : 'bg-neutral-900 text-gray-400 '  } `}>All</button>
          <button onClick={() => handleFilterChange('DECLARE')} className={`px-4 py-2 rounded ${type === 'declare' ? 'bg-neutral-900'  : 'bg-neutral-900' } text-gray-400`}>Declare</button>
          <button onClick={() => handleFilterChange('DEPLOY')} className={`px-4 py-2 rounded ${type === 'deploy' ? 'bg-neutral-900'  : 'bg-neutral-900' } text-gray-400`}>Deploy</button>
          <button onClick={() => handleFilterChange('DEPLOY_ACCOUNT')} className={`px-4 py-2 rounded ${type === 'deploy_account' ? 'bg-neutral-900'  : 'bg-neutral-900' } text-gray-400`}>Deploy Account</button>
          <button onClick={() => handleFilterChange('INVOKE')} className={`px-4 py-2 rounded ${type === 'invoke' ? 'bg-neutral-900'  : 'bg-neutral-900' } text-gray-400`}>Invoke</button>
          <button onClick={() => handleFilterChange('L1_HANDLER')} className={`px-4 py-2 rounded ${type === 'l1_handler' ? 'bg-neutral-900'  : 'bg-neutral-900' } text-gray-400`}>L1 Handler</button>
        </div>
        <div className=" p-6 rounded-lg shadow-lg w-full max-w-6xl ">
          <InfiniteScroll
            dataLength={transactions.length}
            next={fetchMoreTransactions}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more transactions</p>}
            height={500}
          >
            <div className="grid grid-cols-1 gap-4  ">
              <div className="grid grid-cols-5 gap-4  p-4 rounded border-b border-gray-800">
              <div><strong>Status</strong></div>
                <div><strong>Hash</strong></div>
                <div className=''><strong>Type</strong></div>
                <div><strong>Block Number</strong></div>
                <div><strong>Timestamp</strong></div>
               
              </div>
              {transactions.map((tx) => (
 <div key={tx.hash} className="grid grid-cols-5 gap-4   p-2 rounded items-center  border-b border-gray-300">

                 

                  <div className=''>{tx.status}</div>
                  <div className="flex items-center space-x-2 ">
                    <span className="cursor-pointer text-blue-400 hover:underline" onClick={() => handleHashClick(tx.hash)}>
                      {shortenHash(tx.hash)}
                    </span>
                    <CopyToClipboard text={tx.hash}>
                      <FiCopy className="cursor-pointer text-gray-400 hover:text-white" />
                    </CopyToClipboard>
                  </div>

                  

                  <div className='rounded-md bg-green-400 text-green-500 bg-opacity-10 w-fit   '>{tx.type}</div>
                  <div className=''>{tx.blockNumber}</div>
                  <div className=''>{new Date(tx.timestamp * 1000).toLocaleString()}</div>
                 
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
