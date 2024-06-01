import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';
import { useDarkMode } from '../context/darkMode';
import { fetchEthPrice, fetchTransactionDetails } from './../service/api';
import { Buffer } from 'buffer';

interface TransactionDetailsProps {
  hash: string;
  blockNumber: number;
  timestamp: number;
  status: string;
  type: string;
  nonce: number;
  sender_address: string;
  max_fee: string;
  actual_fee: string;
  calldata: string[];
  signature: string[];
  execution_resources: {
    steps: number;
    pedersen_builtin: number;
    range_check_builtin: number;
    bitwise_builtin: number;
    ec_op_builtin: number;
  };
  events: { id: string, data: string[] }[];
}

const TransactionDetails: React.FC = () => {
  const { id } = useParams(); 
  const hash = id;
  const [transaction, setTransaction] = useState<TransactionDetailsProps | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const { darkMode } = useDarkMode();
  const [dataFormat, setDataFormat] = useState<'hex' | 'dec' | 'text'>('hex');
  const [overview , setOverview] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const txDetails = await fetchTransactionDetails(hash!);
        setTransaction(txDetails.data);
        const price = await fetchEthPrice();
        setEthPrice(price);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    };
    fetchDetails();
  }, [hash]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  const formatEth = (wei: string) => {
    return (parseInt(wei, 16) / 1e18).toFixed(18);
  };
  
  const formattedDatetamp = new Date(transaction.timestamp * 1000).toLocaleDateString();
  const formattedTimestamp = new Date(transaction.timestamp * 1000).toLocaleTimeString();

  const formatCalldata = (data: string[]) => {
    switch (dataFormat) {
      case 'hex':
        return data;
      case 'dec':
        return data.map((item) => parseInt(item, 16).toString());
      case 'text':
        return data.map((item) => Buffer.from(item, 'hex').toString('utf-8'));
      default:
        return data;
    }
  };

  const overviewHandler = () => setOverview(true);
  const eventsHandler = () => setOverview(false);

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto p-6 bg text-white rounded-lg shadow-lg">
        <h1 className="text-2xl mb-6">Transaction</h1>
        <div className="flex items-center mt-5">
          <span className="font-bold text-gray-400">HASH:</span>
          <span className="ml-2">{transaction.hash || ''}</span>
          <CopyToClipboard text={transaction.hash || ''}>
            <FiCopy className="ml-2 cursor-pointer text-gray-400 hover:text-white" />
          </CopyToClipboard>
        </div>

        <div className='grid grid-cols-4 gap-2 mt-5'>
          <span className="font-bold w-20 text-gray-400">TYPE <span className='rounded-md bg-green-400 text-green-500 bg-opacity-10 p-1 pl-2 pr-2 mt-1'>{transaction.type || ''}</span></span>
          <span className="font-bold w-24"> TIMESTAMP <span className='w-fir text-lg gap-2'> {formattedDatetamp},{formattedTimestamp}</span></span>
        </div>
        <div className='grid grid-row-2 gap-2 mt-4'>
          <span className="font-bold text-gray-400">STATUS</span> <span className='bg-green-600 rounded-xl p-1 pl-2 pr-2 w-fit'>{transaction.status || ''}</span>
        </div>
        <div className='mt-3'>
          <button className='text-2xl underline' onClick={overviewHandler}>Overview</button> <button className='text-2xl underline ml-5' onClick={eventsHandler}>Events</button>
        </div>

        {overview ? (
          <>
            <h1 className="text-2xl mt-4 mb-6">Transaction Details</h1>

            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">BLOCK NUMBER:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 text-sky-600 font-extrabold">{transaction.blockNumber || ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">TIMESTAMP:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 text-sky-600 font-extrabold">{formattedTimestamp || ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">ACTUAL FEE:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.transactionReceiptDetails?.actual_fee ? `${formatEth(transaction.transactionReceiptDetails.actual_fee.amount)} ETH ($${(formatEth(transaction.transactionReceiptDetails.actual_fee.amount) * (ethPrice || 0)).toFixed(2)})` : ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">MAX FEE:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.transactionHashDetails?.max_fee ? `${formatEth(transaction.transactionHashDetails.max_fee)} ETH ($${(formatEth(transaction.transactionHashDetails.max_fee) * (ethPrice || 0)).toFixed(2)})` : ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">GAS CONSUMED:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.transactionReceiptDetails?.actual_fee ? Math.ceil(formatEth(transaction.transactionReceiptDetails.actual_fee.amount) / 15.84) : ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">SENDER ADDRESS:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 text-sky-600 font-extrabold">{transaction.transactionHashDetails?.sender_address || ''}</span>
            </div>

            <div className='text-2xl mt-7 mb-4'>
              <h1>Developer Info</h1>
            </div>

            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">UNIX TIMESTAMP:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.timestamp || ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">NONCE:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.nonce || ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">VERSION:</span>
              <span className="flex-grow col-span-3 underline -p-0.5 -pt-0.5 font-extrabold">{transaction.transactionHashDetails?.version || ''}</span>
            </div>
            <div className='grid grid-cols-4 mt-3 mb-2'>
              <span className="font-bold w-fit">EXECUTION RESOURCES:</span>
              <div className='flex flex-wrap col-span-1 m-1'>
                <div className='m-1 border w-fit pr-4 pl-4 pt-1 pb-1 font-semibold underline -p-0.5 -pt-0.5 bg-orange-700 bg-opacity-50 rounded-lg'>
                  bitwise_builtin {transaction.transactionReceiptDetails?.execution_resources.bitwise_builtin_applications || ''}
                </div>
                <div className='m-1 border w-fit pr-4 pl-4 pt-1 pb-1 font-semibold underline -p-0.5 -pt-0.5 bg-orange-700 bg-opacity-50 rounded-lg'>
                  ec_op_builtin {transaction.transactionReceiptDetails?.execution_resources.ec_op_builtin_applications || ''}
                </div>
                <div className='m-1 border w-fit pr-4 pl-4 pt-1 pb-1 font-semibold underline -p-0.5 -pt-0.5 bg-orange-700 bg-opacity-50 rounded-lg'>
                  pedersen_builtin {transaction.transactionReceiptDetails?.execution_resources.pedersen_builtin_applications || ''}
                </div>
                <div className='m-1 border w-fit pr-4 pl-4 pt-1 pb-1 font-semibold underline -p-0.5 -pt-0.5 bg-orange-700 bg-opacity-50 rounded-lg'>
                  range_check_builtin {transaction.transactionReceiptDetails?.execution_resources.range_check_builtin_applications || ''}
                </div>
                <div className='m-1 border w-fit pr-4 pl-4 pt-1 pb-1 font-semibold underline -p-0.5 -pt-0.5 bg-green-600 bg-opacity-50 rounded-lg'>
                  steps {transaction.transactionReceiptDetails?.execution_resources.steps || ''}
                </div>
              </div>
            </div>

            {/* CALLED DATA Section */}
            <div className="grid grid-cols-4 mt-2">
              <span className="font-bold w-fit">CALLED DATA:</span>
              <div className="container mx-auto p-6 text-white rounded-lg shadow-lg bg-black col-span-3">
                <div className="col-span-3 bg-neutral-800 p-4 rounded">
                  <div className="flex justify-start mb-2">
                    <CopyToClipboard text={JSON.stringify(formatCalldata(transaction.transactionHashDetails?.calldata || []), null, 2)}>
                      <FiCopy className="ml-2 cursor-pointer text-gray-400 hover:text-white" />
                    </CopyToClipboard>
                  </div>
                  <div className="flex justify-around mb-4 w-28">
                    <button
                      className={`px-4 py-2 rounded ${dataFormat === 'hex' ? 'bg-gray-500 text-white' : 'bg-neutral-800 text-gray-400'}`}
                      onClick={() => setDataFormat('hex')}
                    >
                      Hex
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${dataFormat === 'dec' ? 'bg-gray-500 text-white' : 'bg-neutral-800 text-gray-400'}`}
                      onClick={() => setDataFormat('dec')}
                    >
                      Dec
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${dataFormat === 'text' ? 'bg-gray-500 text-white' : 'bg-neutral-800 text-gray-400'}`}
                      onClick={() => setDataFormat('text')}
                    >
                      Text
                    </button>
                  </div>
                  <div className="bg-black p-2 rounded">
                    {formatCalldata(transaction.transactionHashDetails?.calldata || []).map((data, index) => (
                      <div key={index}>
                        <div className="flex items-center py-2 border-b border-gray-600 text-green-400">
                          <span className="flex-grow">{data}</span>
                          <CopyToClipboard text={data}>
                            <FiCopy className="ml-2 cursor-pointer text-gray-400 hover:text-white" />
                          </CopyToClipboard>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-4 mt-2'>
              <span className="font-bold w-fit">SIGNATURE:</span>
              <div className="col-span-3 grid grid-cols-1 gap-2">
                {(transaction.transactionHashDetails?.signature || []).map((signature, index) => (
                  <div className="flex items-center" key={index}>
                    <span className="underline flex-grow text-yellow-600">{signature}</span>
                    <CopyToClipboard text={signature}>
                      <FiCopy className="ml-2 cursor-pointer text-gray-400 hover:text-white" />
                    </CopyToClipboard>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 mt-2">
              <span className="font-bold w-fit">EVENT DATA:</span>
              <div className="container mx-auto p-6 text-white rounded-lg shadow-lg bg-neutral-800 col-span-3">
                <div className="flex justify-start mb-2">
                  <CopyToClipboard text={JSON.stringify(formatCalldata(transaction.transactionReceiptDetails?.events || []), null, 2)}>
                    <button className="flex items-center px-2 py-1 bg-neutral-800 rounded text-gray-400 hover:text-white">
                      <FiCopy className="mr-1" />
                      Copy 
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-600">
                  <span className="font-bold">Key</span>
                  <span className="font-bold">Value</span>
                </div>
                <div className="bg-black p-2 rounded">
                  {(transaction.transactionReceiptDetails?.events || []).map((event, index) => (
                    <div key={index}>
                      {Object.entries(event).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 items-center py-2 border-b border-gray-800">
                          <span className="truncate" title={key}>
                            {key}
                          </span>
                          <span className="truncate" title={JSON.stringify(value)}>
                            {JSON.stringify(value).length > 50
                              ? `${JSON.stringify(value).slice(0, 50)}...`
                              : JSON.stringify(value)}
                          </span>
                          <CopyToClipboard text={JSON.stringify(value)}>
                            <FiCopy className="ml-2 cursor-pointer text-gray-400 hover:text-white" />
                          </CopyToClipboard>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
