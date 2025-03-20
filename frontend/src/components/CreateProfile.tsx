import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const CreateProfile: React.FC = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!address) return;

    const profileKey = `profile-${address}`;
    const storedProfile = localStorage.getItem(profileKey);

    if (storedProfile) {
      navigate('/home');
    }
  }, [address, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    profileImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    setImagePreview(null);
    setFormData({ ...formData, profileImage: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkUsername = async (username: string) => {
    const profiles = Object.values(localStorage)
      .map(item => {
        try {
          return JSON.parse(item as string);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const isUsed = profiles.some((profile: any) => profile.username === username);
    setUsernameAvailable(!isUsed && username.length > 3 && !username.includes(' '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const reservedUsernames = ["home", "create-profile", "profile", "admin", "login", "create-post", "discover"];
    const enteredUsername = formData.username.toLowerCase();
  
    if (reservedUsernames.includes(enteredUsername)) {
      alert("This username is not allowed. Please choose a different one.");
      return;
    }
  
    if (!address || !usernameAvailable) return;
  
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      localStorage.setItem(`profile-${address}`, JSON.stringify({
        ...formData,
        imagePreview,
        address,
        nftMinted: false,
        createdAt: new Date().toISOString(),
        followers: [],
        following: [],
      }));
  
      navigate('/home');
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Your gateway to the social network
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImageClick}
                  className="relative w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-600 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </motion.div>
              </div>
            </div>

            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  checkUsername(e.target.value);
                }}
              />
              {usernameAvailable !== null && (
                <div className="absolute right-3 top-2.5">
                  {usernameAvailable ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>

            <div>
              <textarea
                id="bio"
                name="bio"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell us about yourself"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !usernameAvailable}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProfile;