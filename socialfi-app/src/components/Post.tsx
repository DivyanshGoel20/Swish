import React from 'react';
import { Post } from '../store/usePostStore';
import { useProfileStore } from '../store/useProfileStore';
import { User } from 'lucide-react';
import { useAccount } from 'wagmi';

interface PostProps {
  post: Post;
}

const PostComponent: React.FC<PostProps> = ({ post }) => {
  // Get current wallet address
  const { address } = useAccount();

  // Get the current profile
  const currentProfile = useProfileStore((state) => state.profile);

  // More reliable way to check if this is the current user's post
  // Check both username and connected wallet address
  const isCurrentUserPost =
    (currentProfile && currentProfile.username === post.user.username) &&
    (address === post.walletAddress);

  // Use current profile data if it's the user's own post
  const displayUser = isCurrentUserPost ? {
    name: currentProfile.name || post.user.name,
    username: currentProfile.username || post.user.username,
    imagePreview: currentProfile.imagePreview || post.user.imagePreview
  } : post.user;

  return (
    <div className="p-4 rounded-xl border border-gray-800 mb-4">
      <div className="flex items-center gap-2 mb-2">
        {displayUser.imagePreview ? (
          <img
            src={displayUser.imagePreview}
            alt={displayUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{displayUser.name}</p>
          <p className="text-xs text-gray-400">@{displayUser.username}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(post.timestamp).toLocaleString()}
        </span>
      </div>
      <p className="text-sm mb-2 text-white">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post image"
          className="rounded-xl max-h-64 w-full object-cover"
        />
      )}
      <p className="text-xs text-gray-400 mt-1">
        Post Type: <span className="italic">{post.type}</span>
      </p>
    </div>
  );
};

export default PostComponent;