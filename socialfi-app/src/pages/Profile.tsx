import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Edit2, Check, User } from 'lucide-react';

const Profile: React.FC = () => {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [profile, setProfile] = useState(() => {
    return address ? JSON.parse(localStorage.getItem(`profile-${address}`) || '{}') : {};
  });
  const [editForm, setEditForm] = useState(profile);

  const handleEdit = () => {
    if (profile.nftMinted) {
      alert('Profile cannot be edited after NFT is minted');
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      localStorage.setItem(`profile-${address}`, JSON.stringify({ ...profile, ...editForm }));
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleMintNFT = async () => {
    if (!address) return;
    
    setIsMinting(true);
    try {
      // Mock NFT minting - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedProfile = { ...profile, nftMinted: true };
      localStorage.setItem(`profile-${address}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8"
      >
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          {!isEditing && !profile.nftMinted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              <Edit2 size={20} />
              Edit Profile
            </motion.button>
          )}
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            {profile.imagePreview ? (
              <img
                src={profile.imagePreview}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Username"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <p className="text-gray-400">@{profile.username}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Bio</h3>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                rows={4}
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-gray-300">{profile.bio}</p>
            )}
          </div>

          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold"
            >
              <Check size={20} />
              Save Changes
            </motion.button>
          )}

          {!profile.nftMinted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMintNFT}
              disabled={isMinting}
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? 'Minting NFT...' : 'Mint Profile NFT'}
            </motion.button>
          )}

          {profile.nftMinted && (
            <div className="p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-400 font-semibold">Profile NFT has been minted! 🎉</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;