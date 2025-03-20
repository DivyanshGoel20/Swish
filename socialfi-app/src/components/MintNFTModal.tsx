import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface MintNFTModalProps {
  name: string;
  username: string;
  onConfirm: (price: number) => void;
  onClose: () => void;
  isMinting: boolean;
}

const MintNFTModal: React.FC<MintNFTModalProps> = ({ name, username, onConfirm, onClose, isMinting }) => {
const [price, setPrice] = useState("0.01");

  const isValidPrice = () => {
    const value = parseFloat(price);
    return value >= 0.01 && value <= 10;
  };

  const handleConfirm = () => {
    const parsedPrice = parseFloat(price);
    if (!isValidPrice()) {
      toast.error('Enter a valid price between 0.01 and 10 CORE');
      return;
    }
    onConfirm(parsedPrice);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">Mint Your Profile NFT</h2>

        <div className="text-yellow-300 text-sm bg-yellow-500/10 p-3 rounded mb-4">
          ⚠️ Once minted, you won’t be able to edit your profile!
        </div>

        <div className="mb-4">
          <label className="text-gray-300 block text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            disabled
            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded text-white cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-300 block text-sm mb-1">Username</label>
          <input
            type="text"
            value={`${username}`}
            disabled
            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded text-white cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
  <label className="block text-sm font-medium text-white mb-1">
    Set NFT Price (in CORE)
  </label>
  <input
    type="number"
    min={0.01}
    max={10}
    step={0.01}
    value={price}
    onChange={(e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value <= 10) {
          setPrice(e.target.value);  // still a string
        }
      }}
      
    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <p className="text-sm text-gray-400 mt-1">Maximum price allowed: <span className="text-purple-400 font-semibold">10 CORE</span></p>
</div>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isMinting}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {isMinting ? 'Minting...' : 'Confirm Mint'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MintNFTModal;
