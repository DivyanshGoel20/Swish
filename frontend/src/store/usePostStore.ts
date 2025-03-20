import { create } from 'zustand';

export interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    imagePreview?: string;
  };
  content: string;
  likes: string[];
}

export interface Post {
  id: string;
  type: 'normal' | 'membership';
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  likes: string[];
  walletAddress: `0x${string}`;
  user: {
    name: string;
    username: string;
    imagePreview: string;
  };
  comments: Comment[];
}

interface PostState {
  posts: Post[];
  addPost: (post: Post) => void;
  toggleLike: (postId: string, walletAddress: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  toggleCommentLike: (postId: string, commentId: string, walletAddress: string) => void;
}


export const usePostStore = create<PostState>((set) => {
  const storedPosts = JSON.parse(localStorage.getItem('post-storage') || '[]');

  return {
    posts: storedPosts,
    addPost: (post) => {
      set((state) => {
        const updatedPosts = [...state.posts, post];
        localStorage.setItem('post-storage', JSON.stringify(updatedPosts));
        return { posts: updatedPosts };
      });
    },
    toggleCommentLike: (postId: string, commentId: string, walletAddress: string) => {
      set((state) => {
        const updatedPosts = state.posts.map((post) => {
          if (post.id !== postId) return post;
    
          const updatedComments = post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
    
            const hasLiked = comment.likes.includes(walletAddress);
            const updatedLikes = hasLiked
              ? comment.likes.filter((addr) => addr !== walletAddress)
              : [...comment.likes, walletAddress];
    
            return { ...comment, likes: updatedLikes };
          });
    
          return { ...post, comments: updatedComments };
        });
    
        localStorage.setItem('post-storage', JSON.stringify(updatedPosts));
        return { posts: updatedPosts };
      });
    },    
    toggleLike: (postId, walletAddress) => {
      set((state) => {
        const updatedPosts = state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes.includes(walletAddress)
                  ? post.likes.filter((addr) => addr !== walletAddress)
                  : [...post.likes, walletAddress],
              }
            : post
        );
        localStorage.setItem('post-storage', JSON.stringify(updatedPosts));
        return { posts: updatedPosts };
      });
    },
    addComment: (postId, comment) => {
      set((state) => {
        const updatedPosts = state.posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        );
        localStorage.setItem('post-storage', JSON.stringify(updatedPosts));
        return { posts: updatedPosts };
      });
    },
  };
});
