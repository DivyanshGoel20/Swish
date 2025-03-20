import React, { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface TipButtonProps {
  recipient: `0x${string}`;
}

const TipButton: React.FC<TipButtonProps> = ({ recipient }) => {
  const { address: sender } = useAccount();
  const [amount, setAmount] = useState('0.01');
  const [isTipping, setIsTipping] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const { sendTransactionAsync } = useSendTransaction();

  const handleTip = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setIsTipping(true);
    try {
      await sendTransactionAsync({
        to: recipient,
        value: parseEther(amount),
      });

      toast.success('Transaction successful!');
      setAmount('0.01');
      setShowTipModal(false);
    } catch (error) {
      toast.error('Transaction failed!');
    } finally {
      setIsTipping(false);
    }
  };

  if (!sender || sender.toLowerCase() === recipient.toLowerCase()) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTipModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
      >
        <Gift size={18} />
        Send Tip
      </motion.button>
      
      {showTipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Send Tip</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Amount (CORE)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.001"
                  step="0.001"
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white"
                />
                <div className="absolute right-3 top-3 text-gray-400">CORE</div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              Sending tip to: {recipient.substring(0, 6)}...{recipient.substring(recipient.length - 4)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTip}
                disabled={isTipping}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white font-semibold disabled:opacity-50"
              >
                {isTipping ? 'Sending...' : 'Send Tip'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTipModal(false)}
                className="flex-1 px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-white font-semibold transition"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TipButton;