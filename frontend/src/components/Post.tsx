import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { useAccount } from 'wagmi';
import { usePostStore } from '../store/usePostStore';
import { v4 as uuidv4 } from 'uuid';

interface PostProps {
  post: import('../store/usePostStore').Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { address } = useAccount();
  const { toggleLike, addComment, toggleCommentLike } = usePostStore();
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    if (address) toggleLike(post.id, address);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !address) return;

    const commenterProfile = localStorage.getItem(`profile-${address}`);
    const commenterData = commenterProfile ? JSON.parse(commenterProfile) : null;

    const newComment = {
      id: uuidv4(),
      content: commentText,
      likes: [],
      user: {
        name: commenterData?.name || 'Anonymous',
        username: commenterData?.username || '',
        imagePreview: commenterData?.imagePreview || ''
      }
    };

    addComment(post.id, newComment);
    setCommentText('');
  };

  const handleCommentLike = (commentId: string) => {
    if (address) toggleCommentLike(post.id, commentId, address);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
      <div className="flex items-center gap-4 mb-4">
        {post.user.imagePreview ? (
          <img
            src={post.user.imagePreview}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-300 text-xl">👤</span>
          </div>
        )}
        <div>
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-gray-400">@{post.user.username}</p>
        </div>
      </div>

      <p className="text-white mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full max-h-[400px] object-contain rounded-xl border border-white/10"
        />
      )}

      {(post as any).video && (
        <video
          src={(post as any).video}
          controls
          className="w-full max-h-[500px] object-contain rounded-xl border border-white/10 mt-4"
        />
      )}


      <div className="flex items-center gap-4 mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center gap-2 ${post.likes.includes(address || '') ? 'text-red-400' : 'text-gray-400'}`}
        >
          <Heart size={20} />
          {post.likes.length}
        </motion.button>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-2">Comments</h4>
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-1">
                {comment.user.imagePreview ? (
                  <img
                    src={comment.user.imagePreview}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-300 text-lg">👤</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{comment.user.name}</p>
                  <p className="text-xs text-gray-400">@{comment.user.username}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCommentLike(comment.id)}
                className={`text-sm flex items-center gap-1 ${comment.likes.includes(address || '') ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <Heart size={16} /> {comment.likes.length}
              </motion.button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Post;
