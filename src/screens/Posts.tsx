import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {usePostsStore} from '@/stores/PostsStore';
import {
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSyncPosts,
  useSavePosts,
} from '@/hooks/usePostsMutations';
import {Post} from '@/stores/PostsStore';

const Posts = () => {
  const {posts, isLoading, error, clearError} = usePostsStore();

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const syncPostsMutation = useSyncPosts();
  const savePostsMutation = useSavePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const handleCreatePost = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    createPostMutation.mutate(
      {title: title.trim(), content: content.trim()},
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          Alert.alert('Thành công', 'Đã tạo bài viết mới');
        },
        onError: err => {
          Alert.alert('Lỗi', `Không thể tạo bài viết: ${err.message}`);
        },
      },
    );
  };

  const handleUpdatePost = () => {
    if (!editingPost || !title.trim() || !content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    updatePostMutation.mutate(
      {id: editingPost.id, title: title.trim(), content: content.trim()},
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setEditingPost(null);
          Alert.alert('Thành công', 'Đã cập nhật bài viết');
        },
        onError: err => {
          Alert.alert('Lỗi', `Không thể cập nhật bài viết: ${err.message}`);
        },
      },
    );
  };

  const handleDeletePost = (post: Post) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa bài viết "${post.title}"?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            deletePostMutation.mutate(
              {id: post.id},
              {
                onSuccess: () => {
                  Alert.alert('Thành công', 'Đã xóa bài viết');
                },
                onError: err => {
                  Alert.alert('Lỗi', `Không thể xóa bài viết: ${err.message}`);
                },
              },
            );
          },
        },
      ],
    );
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
  };

  const handleSyncPosts = () => {
    syncPostsMutation.mutate(undefined, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Đã đồng bộ bài viết từ KeyVal');
      },
      onError: err => {
        Alert.alert('Lỗi', `Không thể đồng bộ: ${err.message}`);
      },
    });
  };

  const handleSavePosts = () => {
    savePostsMutation.mutate(undefined, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Đã lưu bài viết lên KeyVal');
      },
      onError: err => {
        Alert.alert('Lỗi', `Không thể lưu: ${err.message}`);
      },
    });
  };

  const renderPost = ({item}: {item: Post}) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postDate}>
        Tạo: {new Date(item.createdAt).toLocaleString('vi-VN')}
      </Text>
      {item.updatedAt !== item.createdAt && (
        <Text style={styles.postDate}>
          Sửa: {new Date(item.updatedAt).toLocaleString('vi-VN')}
        </Text>
      )}
      <View style={styles.postActions}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditPost(item)}>
          <Text style={styles.actionButtonText}>Sửa</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletePost(item)}>
          <Text style={styles.actionButtonText}>Xóa</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Posts Management</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={clearError} style={styles.clearErrorButton}>
            <Text style={styles.clearErrorText}>✕</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tiêu đề bài viết"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nội dung bài viết"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
        <View style={styles.formActions}>
          {editingPost ? (
            <>
              <Pressable
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdatePost}
                disabled={isLoading}>
                <Text style={styles.buttonText}>
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}>
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={[styles.button, styles.createButton]}
              onPress={handleCreatePost}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Đang tạo...' : 'Tạo bài viết'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.syncActions}>
        <Pressable
          style={[styles.button, styles.syncButton]}
          onPress={handleSyncPosts}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Đồng bộ từ KeyVal</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.saveButton]}
          onPress={handleSavePosts}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Lưu lên KeyVal</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Bài viết ({posts.length})</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        style={styles.postsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    padding: 4,
  },
  clearErrorText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  syncActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  syncButton: {
    backgroundColor: '#FF9800',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  postsList: {
    flex: 1,
  },
  postItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
