import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  const { address, isConnected, status } = useAccount();
  const navigate = useNavigate();
  const setProfile = useProfileStore((state) => state.setProfile);
  const resetProfile = useProfileStore((state) => state.resetProfile);

  useEffect(() => {
    const currentPath = window.location.pathname;
  
    // If user is disconnected, redirect to landing
    if (status === 'disconnected' || (!isConnected && !address)) {
      resetProfile();
      navigate('/');
      return;
    }
  
    // ✅ If user is connected, check if they have a profile
    if (address) {
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
  }, [status, isConnected, address, navigate, setProfile, resetProfile]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </motion.div>
  );
};

export default Layout;