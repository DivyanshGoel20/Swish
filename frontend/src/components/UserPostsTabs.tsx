import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePostStore } from '../store/usePostStore';
import PostComponent from './Post';
import { Lock } from 'lucide-react';

interface UserPostsTabsProps {
    username: string;
}

const UserPostsTabs: React.FC<UserPostsTabsProps> = ({ username }) => {
    const { address } = useAccount();
    const posts = usePostStore((state) => state.posts);
    const [activeTab, setActiveTab] = useState<'normal' | 'membership'>('normal');

    // Filter posts based on type and user
    const filteredPosts = posts.filter(
        (post) => post.user.username === username && post.type === activeTab
    );

    // Mock access check — replace with real NFT check logic
    const hasAccess = true; // <-- Plug actual access check here later

    return (
        <div className="mt-10">
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${activeTab === 'normal'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                    onClick={() => setActiveTab('normal')}
                >
                    Normal Posts
                </button>
                <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${activeTab === 'membership'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                    onClick={() => setActiveTab('membership')}
                >
                    Members Posts
                </button>
            </div>


            {activeTab === 'membership' && !hasAccess ? (
                <div className="bg-white/5 p-6 rounded-xl text-center text-gray-300">
                    <Lock className="w-10 h-10 mx-auto mb-4 text-purple-400" />
                    <p>This content is only available for members.</p>
                    <p className="mt-2">Please purchase the creator's NFT to unlock access.</p>
                    {/* You can add a Buy NFT button here later */}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredPosts.length === 0 ? (
                        <p className="text-gray-400 text-center">No {activeTab} posts yet.</p>
                    ) : (
                        filteredPosts.map((post) => (
                            <PostComponent key={post.id} post={post} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserPostsTabs;
