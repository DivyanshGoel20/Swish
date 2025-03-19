import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { LogOut, User } from 'lucide-react';
import { useProfileStore } from '../store/useProfileStore';
import PostComponent from '../components/Post';
import { usePostStore, Post } from '../store/usePostStore';

const Home: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const posts = usePostStore((state) => state.posts);
  const visiblePosts: Post[] = posts.filter((p) => p.type === 'normal');

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('wagmi.connected');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (profile?.username) {
      navigate(`/${profile.username}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white text-center sm:text-left mb-6">Welcome to SocialFi</h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Left Side: Action Buttons */}
            <div className="flex flex-row sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-post')}
                className="px-5 py-3 bg-purple-500 text-white rounded-lg font-semibold flex-1 sm:flex-none"
              >
                Create Post
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/discover')}
                className="px-5 py-3 bg-blue-500 text-white rounded-lg font-semibold flex-1 sm:flex-none"
              >
                🔍 Discover
              </motion.button>
            </div>

            {/* Right Side: Profile & Logout */}
            <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
                className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-lg rounded-full p-2 pr-6"
              >
                {profile.imagePreview ? (
                  <img
                    src={profile.imagePreview}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-purple-500">
                    <User className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div className="text-white">
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-sm text-gray-300">@{profile.username}</p>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl text-white font-semibold mb-6 pb-4 border-b border-white/10">Recent Posts</h2>
          <div className="space-y-6">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <div key={post.id} className="mb-6">
                  <PostComponent post={post} />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">No posts yet.</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to create a post!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;