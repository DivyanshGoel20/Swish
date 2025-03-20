import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Profile {
    name: string;
    username: string;
    imagePreview?: string;
    address: string;
}

const Discover: React.FC = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const allProfiles: Profile[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('profile-')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key)!);
                    if (data.username && data.name) {
                        allProfiles.push({
                            name: data.name,
                            username: data.username,
                            imagePreview: data.imagePreview,
                            address: key.replace('profile-', ''),
                        });
                    }
                } catch (e) {
                    console.error('Invalid profile data in localStorage');
                }
            }
        }

        setUsers(allProfiles);
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base font-semibold rounded-xl shadow-md transition duration-200"
                    >
                        ← Back to Home
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-white mb-6">Discover Users</h1>

                {users.length === 0 ? (
                    <p className="text-gray-400">No users found.</p>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <motion.div
                                key={user.address}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/${user.username}`)}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-lg p-4 rounded-lg cursor-pointer hover:bg-white/20 transition"
                            >
                                {user.imagePreview ? (
                                    <img
                                        src={user.imagePreview}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-white font-semibold">{user.name}</p>
                                    <p className="text-purple-400 text-sm">@{user.username}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discover;
