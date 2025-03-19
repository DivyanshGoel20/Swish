import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Check, Edit2, Image as ImageIcon, Trash2, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfileStore } from '../store/useProfileStore';
import TipButton from '../components/TipButton';

const PublicProfile = () => {

    type EditFormData = {
        name: string;
        username: string;
        bio: string;
        imagePreview: string;
    };

    const { username } = useParams();
    const navigate = useNavigate();
    const { address: connectedAddress } = useAccount();
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    // Use the profile store
    const storeProfile = useProfileStore((state) => state.profile);
    const setStoreProfile = useProfileStore((state) => state.setProfile);

    const [editForm, setEditForm] = useState<EditFormData>({
        name: '',
        username: '',
        bio: '',
        imagePreview: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isOwner = profile?.address?.toLowerCase() === connectedAddress?.toLowerCase();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        // If this is the current user's profile, use store data
        if (storeProfile.username === username) {
            setProfile(storeProfile);
            return;
        }

        // Otherwise, search in localStorage for this username
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('profile-')) {
                const profileData = JSON.parse(localStorage.getItem(key) || '{}');
                if (profileData.username === username) {
                    const fullProfile = {
                        ...profileData,
                        address: key.replace('profile-', '') // Extract address from key
                    };

                    setProfile(fullProfile);

                    // ✅ Now check if current user is following this loaded profile
                    if (connectedAddress && fullProfile.followers?.includes(connectedAddress)) {
                        setIsFollowing(true);
                    } else {
                        setIsFollowing(false);
                    }

                    break;
                }
            }
        }
    }, [username, storeProfile, connectedAddress]);


    const handleFollowToggle = () => {
        if (!connectedAddress || !profile?.address) return;

        // Get current user profile
        const currentUserData = localStorage.getItem(`profile-${connectedAddress}`);
        const targetUserData = localStorage.getItem(`profile-${profile.address}`);

        if (!currentUserData || !targetUserData) return;

        const currentUser = JSON.parse(currentUserData);
        const targetUser = JSON.parse(targetUserData);

        if (isFollowing) {
            // Unfollow: Remove addresses
            currentUser.following = currentUser.following.filter((addr: string) => addr !== profile.address);
            targetUser.followers = targetUser.followers.filter((addr: string) => addr !== connectedAddress);
        } else {
            // Follow: Add addresses if not already there
            if (!currentUser.following.includes(profile.address)) {
                currentUser.following.push(profile.address);
            }
            if (!targetUser.followers.includes(connectedAddress)) {
                targetUser.followers.push(connectedAddress);
            }
        }

        // Save updated profiles
        localStorage.setItem(`profile-${connectedAddress}`, JSON.stringify(currentUser));
        localStorage.setItem(`profile-${profile.address}`, JSON.stringify(targetUser));

        // Update state
        setIsFollowing(!isFollowing);

        // Re-set profile to reflect updated followers count
        setProfile(targetUser);
    };


    // Initialize edit form when profile loads
    useEffect(() => {
        if (profile) {
            setEditForm({
                name: profile.name || '',
                username: profile.username || '',
                bio: profile.bio || '',
                imagePreview: profile.imagePreview || '',
            });
        }
    }, [profile]);

    const handleEdit = () => {
        if (!isOwner) {
            return; // Extra protection
        }

        if (profile.nftMinted) {
            alert('Profile cannot be edited after NFT is minted');
            return;
        }

        setIsEditing(true);
        setProfileSaved(false);
    };

    const handleSave = () => {
        if (!isOwner || !connectedAddress) return;

        const updatedProfile = {
            ...profile,
            ...editForm,
            address: connectedAddress // Ensure address is properly stored
        };

        localStorage.setItem(`profile-${connectedAddress}`, JSON.stringify(updatedProfile));
        setProfile(updatedProfile);

        // Also update the store if this is current user's profile
        if (storeProfile.username === username) {
            setStoreProfile(updatedProfile);
        }

        setIsEditing(false);
        setProfileSaved(true);
    };

    const handleMintNFT = async () => {
        if (!isOwner || !connectedAddress) return;

        setIsMinting(true);
        try {
            // Mock NFT minting - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const updatedProfile = { ...profile, nftMinted: true };
            localStorage.setItem(`profile-${connectedAddress}`, JSON.stringify(updatedProfile));
            setProfile(updatedProfile);

            // Update store if this is current user
            if (storeProfile.username === username) {
                setStoreProfile(updatedProfile);
            }
        } catch (error) {
            console.error('Error minting NFT:', error);
        } finally {
            setIsMinting(false);
        }
    };

    const handleImageClick = () => {
        if (isEditing && isOwner) {
            fileInputRef.current?.click();
        }
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

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent click handler
        setEditForm((prev) => ({
            ...prev,
            imagePreview: '',
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!profile) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/home')}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
                        >
                            ← Back to Home
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-80 text-center">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">
                                This page doesn't exist
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Try searching for something else or check the username.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
                    >
                        ← Back to Home
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${isOwner ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'
                                    }`}
                            >
                                {isOwner ? 'Your Profile' : `Viewing ${profile.name}'s Profile`}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isOwner && profile.address && (
                                <TipButton recipient={profile.address} />
                            )}


                            {isOwner && !isEditing && !profile.nftMinted && (
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

                            {!isOwner && profile?.address && connectedAddress && (
                                <button
                                    onClick={() => handleFollowToggle()}
                                    className={`px-6 py-2 rounded-lg font-semibold transition ${isFollowing
                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        }`}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
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
                                whileHover={{ scale: isEditing && isOwner ? 1.05 : 1 }}
                                whileTap={{ scale: isEditing && isOwner ? 0.95 : 1 }}
                                onClick={handleImageClick}
                                className={`relative w-24 h-24 rounded-full ${isEditing && isOwner ? 'cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all' : ''} overflow-hidden bg-gray-700 flex items-center justify-center`}
                            >
                                {(isEditing ? editForm.imagePreview : profile.imagePreview) ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={isEditing ? editForm.imagePreview : profile.imagePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                )}
                            </motion.div>

                            <div>
                                {isOwner && isEditing ? (
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
                                        <div className="flex flex-col items-start space-y-1 mt-2">
                                            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                                            <p className="text-gray-400">@{profile.username}</p>
                                            {profile.address && (
                                                <p className="text-sm text-blue-400 break-all">{profile.address}</p>
                                            )}
                                            <div className="flex gap-6 text-sm font-medium text-purple-400 mt-1">
                                                <span
                                                    onClick={() => navigate(`/${profile.username}/following`)}
                                                    className="cursor-pointer hover:text-purple-300 transition"
                                                >
                                                    {profile.following?.length || 0} Following
                                                </span>
                                                <span
                                                    onClick={() => navigate(`/${profile.username}/followers`)}
                                                    className="cursor-pointer hover:text-purple-300 transition"
                                                >
                                                    {profile.followers?.length || 0} Followers
                                                </span>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Bio</h3>
                            {isOwner && isEditing ? (
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                    rows={4}
                                    placeholder="Tell us about yourself"
                                />
                            ) : (
                                <p className="text-gray-300">{profile.bio || "No bio yet"}</p>
                            )}
                        </div>

                        {isOwner && isEditing && (
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

                        {isOwner && !isEditing && !profile.nftMinted && (
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

export default PublicProfile;