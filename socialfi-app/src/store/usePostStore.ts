import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PostType = 'normal' | 'membership';

export interface Post {
  id: string;
  type: PostType;
  content: string;
  image?: string;
  timestamp: number;
  walletAddress: string;
  user: {
    name: string;
    username: string;
    imagePreview: string;
  };
}

interface PostStore {
  posts: Post[];
  addPost: (post: Post) => void;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (post: Post) =>
        set((state) => ({
          posts: [post, ...state.posts], // newest first
        })),
    }),
    {
      name: 'post-storage',
    }
  )
);
