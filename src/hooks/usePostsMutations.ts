import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useShallow} from 'zustand/react/shallow';
import {
  savePosts,
  savePost,
  deletePost as deletePostFromAPI,
  loadPosts,
} from '@/services/KeyValService';
import {usePostsStore} from '@/stores/PostsStore';

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  id: string;
  title: string;
  content: string;
}

export interface DeletePostData {
  id: string;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const {addPost, setLoading, setError, posts} = usePostsStore(
    useShallow(state => ({
      addPost: state.addPost,
      setLoading: state.setLoading,
      setError: state.setError,
      posts: state.posts,
    })),
  );

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      setLoading(true);
      setError(null);

      try {
        addPost(data.title, data.content);

        const response = await savePosts(posts);

        if (response.status !== 'SUCCESS') {
          throw new Error('Failed to save posts to KeyVal');
        }

        return response;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts']});
    },
    onError: error => {
      console.error('Create post error:', error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const {updatePost, setLoading, setError, posts} = usePostsStore(
    useShallow(state => ({
      updatePost: state.updatePost,
      setLoading: state.setLoading,
      setError: state.setError,
      posts: state.posts,
    })),
  );

  return useMutation({
    mutationFn: async (data: UpdatePostData) => {
      setLoading(true);
      setError(null);

      try {
        updatePost(data.id, data.title, data.content);

        const updatedPost = posts.find(post => post.id === data.id);

        if (!updatedPost) {
          throw new Error('Post not found');
        }

        const response = await savePost(updatedPost);

        if (response.status !== 'SUCCESS') {
          throw new Error('Failed to update post in KeyVal');
        }

        return response;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts']});
    },
    onError: error => {
      console.error('Update post error:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const {deletePost, setLoading, setError} = usePostsStore(
    useShallow(state => ({
      deletePost: state.deletePost,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
  );

  return useMutation({
    mutationFn: async (data: DeletePostData) => {
      setLoading(true);
      setError(null);

      try {
        deletePost(data.id);

        const success = await deletePostFromAPI(data.id);

        if (!success) {
          throw new Error('Failed to delete post from KeyVal');
        }

        return {success: true};
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts']});
    },
    onError: error => {
      console.error('Delete post error:', error);
    },
  });
};

export const useSyncPosts = () => {
  const queryClient = useQueryClient();
  const {syncPosts, setLoading, setError} = usePostsStore(
    useShallow(state => ({
      syncPosts: state.syncPosts,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
  );

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);

      try {
        const posts = await loadPosts();

        syncPosts(posts);

        return posts;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: posts => {
      queryClient.setQueryData(['posts'], posts);
    },
    onError: error => {
      console.error('Sync posts error:', error);
    },
  });
};

export const useSavePosts = () => {
  const queryClient = useQueryClient();
  const {posts, setLoading, setError} = usePostsStore(
    useShallow(state => ({
      posts: state.posts,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
  );

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await savePosts(posts);

        if (response.status !== 'SUCCESS') {
          throw new Error('Failed to save posts to KeyVal');
        }

        return response;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts']});
    },
    onError: error => {
      console.error('Save posts error:', error);
    },
  });
};
