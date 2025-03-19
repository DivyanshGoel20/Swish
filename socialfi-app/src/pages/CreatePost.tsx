import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useProfileStore } from '../store/useProfileStore';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { usePostStore, Post } from '../store/usePostStore';

const CreatePost = () => {
  const { address } = useAccount();
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPost = usePostStore((state) => state.addPost);

  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState<'normal' | 'membership' | ''>('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handlePostSubmit = () => {
    if (!address || !postText.trim() || !postType) return;

    if (!profile.username) {
      alert("Please complete your profile before posting");
      navigate('/profile');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      type: postType,
      content: postText,
      image: image || undefined,
      timestamp: Date.now(),
      walletAddress: address,
      user: {
        name: profile.name || 'Anonymous',
        username: profile.username,
        imagePreview: profile.imagePreview || '',
      },
    };

    addPost(newPost);

    setPostText('');
    setPostType('');
    setImage(null);

    navigate('/home');
  };

  const isEligibleToPost = profile.nftMinted;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl"
      >
        <button
          onClick={() => navigate('/home')}
          className="mb-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md transition duration-200"
        >
          ← Back to Home
        </button>

        <h2 className="text-2xl font-bold text-white">Create a Post</h2>

        {!isEligibleToPost ? (
          <div className="text-center text-red-400 font-medium">
            You need to mint your profile NFT to post.
          </div>
        ) : (
          <>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="What's on your mind?"
              rows={4}
            />

            {/* Post Type Dropdown */}
            <div>
              <label className="block mb-1 text-white font-medium">Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as 'normal' | 'membership')}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="">Select a type</option>
                <option value="normal">Normal</option>
                <option value="membership">Membership</option>
              </select>
            </div>

            {/* Image upload section */}
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={handleImageClick}
                className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition relative"
              >
                {image ? (
                  <div className="relative h-full w-full">
                    <img
                      src={image}
                      alt="Post preview"
                      className="h-full w-full object-contain rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePostSubmit}
              disabled={!postText.trim() || !postType}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CreatePost;
