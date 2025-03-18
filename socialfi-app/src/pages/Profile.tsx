import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Edit2, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';

const Profile: React.FC = () => {

  type EditFormData = {
    name: string;
    username: string;
    bio: string;
    imagePreview: string;
  };

  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    if (!address) return {
      name: '',
      username: '',
      bio: '',
      imagePreview: '',
      nftMinted: false,
    };

    const saved = localStorage.getItem(`profile-${address}`);
    return saved
      ? JSON.parse(saved)
      : {
        name: '',
        username: '',
        bio: '',
        imagePreview: '',
        nftMinted: false,
      };
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    username: '',
    bio: '',
    imagePreview: '',
  });


  const handleEdit = () => {
    if (profile.nftMinted) {
      alert('Profile cannot be edited after NFT is minted');
      return;
    }
    // ⬇️ Prefill edit form
    setEditForm({
      name: profile.name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      imagePreview: profile.imagePreview || '',
    });
    setIsEditing(true);
    setProfileSaved(false);
  };


  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      ...editForm,
    };

    localStorage.setItem(`profile-${address}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
    setProfileSaved(true);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white">Profile</h1>
            </div>

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
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <motion.div
                whileHover={{ scale: isEditing ? 1.05 : 1 }}
                whileTap={{ scale: isEditing ? 0.95 : 1 }}
                onClick={isEditing ? handleImageClick : undefined}
                className={`relative w-24 h-24 rounded-full ${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all' : ''} overflow-hidden bg-gray-700 flex items-center justify-center`}
              >
                {(isEditing ? editForm.imagePreview : profile.imagePreview) ? (
                  <img
                    src={isEditing ? editForm.imagePreview : profile.imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}

              </motion.div>
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                    <h3 className="text-xl font-semibold text-white">Name</h3>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                    <h3 className="text-xl font-semibold text-white">Username</h3>
                    <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <p className="text-gray-400">@{profile.username}</p>
                    {address && (
                      <p className="text-sm text-blue-400 mt-1 break-all">
                        {address}
                      </p>
                    )}
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

            {!isEditing && !profile.nftMinted && (
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
    </div>
  );
};

export default Profile;