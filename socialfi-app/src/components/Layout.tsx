import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  const { isConnected, address, status } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'disconnected' || (!isConnected && !address)) {
      navigate('/');
    }
  }, [status, isConnected, address, navigate]);
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