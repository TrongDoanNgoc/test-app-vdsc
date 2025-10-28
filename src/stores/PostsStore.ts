import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {zustandStorage} from '@/storages/zustandStorage';

const generateRandomHash = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Types
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho việc lưu trữ lên server (không bao gồm createdAt và updatedAt)
export interface PostForServer {
  id: string;
  title: string;
  content: string;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export interface PostsActions {
  addPost: (title: string, content: string) => void;
  updatePost: (id: string, title: string, content: string) => void;
  deletePost: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  syncPosts: (posts: Post[]) => void;
  clearPosts: () => void;
}

export type PostsStore = PostsState & PostsActions;

// Helper functions để convert giữa Post và PostForServer
export const convertPostToServerFormat = (post: Post): PostForServer => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
  };
};

export const convertServerToPostFormat = (serverPost: PostForServer): Post => {
  const now = new Date().toISOString();
  return {
    id: serverPost.id,
    title: serverPost.title,
    content: serverPost.content,
    createdAt: now, // Tạo createdAt mới khi load từ server
    updatedAt: now, // Tạo updatedAt mới khi load từ server
  };
};

export const usePostsStore = create<PostsStore>()(
  persist(
    immer(set => ({
      posts: [],
      isLoading: false,
      error: null,
      addPost: (title: string, content: string) => {
        set(state => {
          const newPost: Post = {
            id: generateRandomHash(),
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.posts.push(newPost);
          state.error = null;
        });
      },

      updatePost: (id: string, title: string, content: string) => {
        set(state => {
          const post = state.posts.find((p: Post) => p.id === id);
          if (post) {
            post.title = title;
            post.content = content;
            post.updatedAt = new Date().toISOString();
          }
          state.error = null;
        });
      },

      deletePost: (id: string) => {
        set(state => {
          state.posts = state.posts.filter((post: Post) => post.id !== id);
          state.error = null;
        });
      },

      setLoading: (loading: boolean) => {
        set(state => {
          state.isLoading = loading;
        });
      },

      setError: (error: string | null) => {
        set(state => {
          state.error = error;
        });
      },

      clearError: () => {
        set(state => {
          state.error = null;
        });
      },

      syncPosts: (posts: Post[]) => {
        set(state => {
          state.posts = posts;
          state.error = null;
        });
      },

      clearPosts: () => {
        set(state => {
          state.posts = [];
          state.error = null;
        });
      },
    })),
    {
      name: 'posts-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
