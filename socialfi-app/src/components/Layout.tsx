import { useAccount, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isOnCoreTestnet, getChainErrorMessage } from '../config/wagmiConfig';

const Layout = () => {
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();
  const setProfile = useProfileStore((state) => state.setProfile);
  const resetProfile = useProfileStore((state) => state.resetProfile);
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is on the correct network
    const errorMsg = getChainErrorMessage(chainId);
    setNetworkError(errorMsg);
    
    // Only redirect if disconnected, not if on wrong network
    // (NetworkEnforcer will handle network switching)
    if (status === 'disconnected' || (!isConnected && !address)) {
      resetProfile();
      navigate('/');
      return;
    }
    
    // Only proceed if we're on Core Testnet and have a connected wallet
    if (isOnCoreTestnet(chainId) && isConnected && address) {
      const currentPath = window.location.pathname;
      const savedProfile = localStorage.getItem(`profile-${address}`);
      const hasProfile = !!savedProfile;
  
      if (!hasProfile && currentPath !== '/create-profile') {
        navigate('/create-profile');
      }
  
      if (hasProfile && currentPath === '/create-profile') {
        navigate('/dashboard');
      }
  
      // Always update profile in global store
      setProfile(
        hasProfile
          ? JSON.parse(savedProfile)
          : {
              name: '',
              username: '',
              bio: '',
              imagePreview: '',
              nftMinted: false,
            }
      );
    }
  }, [status, isConnected, address, chainId, navigate, setProfile, resetProfile]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {networkError && (
          <div className="py-3 px-4 mt-4 bg-red-500/20 text-red-300 rounded-lg text-center">
            {networkError}
          </div>
        )}
        <Outlet />
      </div>
    </motion.div>
  );
};

export default Layout;