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
      className="min-h-screen py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 sm:mb-0">Welcome to SocialFi</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-post')}
              className="mt-2 sm:mt-4 px-5 py-2 bg-purple-500 text-white rounded-lg font-semibold"
            >
              Create Post
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-lg rounded-full p-2 pr-4"
            >
              {profile.imagePreview ? (
                <img
                  src={profile.imagePreview}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
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
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-xl text-white font-semibold mb-4">Recent Posts</h2>
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => <PostComponent key={post.id} post={post} />)
          ) : (
            <p className="text-gray-300">No posts yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;