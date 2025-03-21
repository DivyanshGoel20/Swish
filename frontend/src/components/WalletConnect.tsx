import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useConnect, useAccount, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useNavigate } from 'react-router-dom';
import { CORE_TESTNET_CHAIN_ID, coreTestnet } from '../config/wagmiConfig';

const WalletConnect: React.FC = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkProfile = (walletAddress: string) => {
    const hasProfile = localStorage.getItem(`profile-${walletAddress}`);
    return !!hasProfile;
  };

  const addCoreTestnetToWallet = async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${CORE_TESTNET_CHAIN_ID.toString(16)}`,
            chainName: coreTestnet.name,
            nativeCurrency: coreTestnet.nativeCurrency,
            rpcUrls: [coreTestnet.rpcUrls.default.http[0]],
            blockExplorerUrls: [coreTestnet.blockExplorers?.default.url],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to add Core Testnet:", error);
      return false;
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setErrorMessage(null);

      // First, make sure Core Testnet is added to the wallet
      await addCoreTestnetToWallet();

      // Then connect with the wallet
      await connect({
        connector: injected(),
        chainId: CORE_TESTNET_CHAIN_ID
      });

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setErrorMessage("Failed to connect wallet. Please make sure you have a web3 wallet installed and try again.");
    } finally {
      setConnecting(false);
    }
  };

  // Once address becomes available, navigate!
  useEffect(() => {
    if (isConnected && address) {
      // If on wrong network, don't proceed yet
      if (chainId !== CORE_TESTNET_CHAIN_ID) {
        setErrorMessage("Please switch to Core Testnet to continue.");
        return;
      }

      const hasProfile = checkProfile(address);
      navigate(hasProfile ? '/home' : '/create-profile');
    }
  }, [address, isConnected, navigate, chainId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl w-full"
      >
        <h1 className="text-5xl font-bold mb-8 text-white">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 bg-clip-text text-transparent">
            Swish
          </span>
        </h1>

        <p className="text-xl mb-12 text-gray-300">
          Connect your wallet to enter the future of social networking
        </p>

        {errorMessage && (
          <div className="py-3 px-4 mb-6 bg-red-500/20 text-red-300 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={connecting}
          className="mx-auto flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet size={24} />
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WalletConnect;