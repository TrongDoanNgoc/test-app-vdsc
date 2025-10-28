import {
  Post,
  PostForServer,
  convertPostToServerFormat,
  convertServerToPostFormat,
} from '@/stores/PostsStore';
import {Key, MMKVStore} from '@/storages/mmkv';

export interface KeyValResponse {
  status: string;
  key: string;
  val: string;
}

export interface KeyValError {
  status: string;
  key: string;
  val: string;
}

const BASE_URL = 'https://api.keyval.org';

const createHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const generateRandomHash = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const getShortKey = (key: string): string => {
  if (key.length <= 20) {
    return key;
  }
  return createHash(key);
};

export const setKey = async (
  key: string,
  value: string,
): Promise<KeyValResponse> => {
  try {
    const shortKey = getShortKey(key);
    const encodedKey = encodeURIComponent(shortKey);
    const encodedValue = encodeURIComponent(value);
    const url = `${BASE_URL}/set/${encodedKey}/${encodedValue}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KeyValResponse = await response.json();

    if (data.status === '-KEY-OR-VALUE-TOO-LONG-') {
      throw new Error('Key or value too long for KeyVal API');
    }

    return data;
  } catch (error) {
    console.error('KeyVal setKey error:', error);
    throw new Error(
      `Failed to set key: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const getKey = async (key: string): Promise<KeyValResponse> => {
  try {
    const shortKey = getShortKey(key);
    const encodedKey = encodeURIComponent(shortKey);
    const url = `${BASE_URL}/get/${encodedKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KeyValResponse = await response.json();
    return data;
  } catch (error) {
    console.error('KeyVal getKey error:', error);
    throw new Error(
      `Failed to get key: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const savePosts = async (posts: Post[]): Promise<KeyValResponse> => {
  const postsForServer: PostForServer[] = posts.map(convertPostToServerFormat);
  const postsJson = JSON.stringify(postsForServer);
  const randomNumber = Math.floor(Math.random() * 999999) + 1;
  const key = `dnt${randomNumber.toString().padStart(4, '0')}`;

  const result = await setKey(key, postsJson);
  MMKVStore.set(Key.keyPosts, key);
  return result;
};

export const loadPosts = async (key?: string): Promise<Post[]> => {
  try {
    let keyToUse = key;

    if (!keyToUse) {
      keyToUse = MMKVStore.get(Key.keyPosts);
    }

    if (!keyToUse) {
      return [];
    }

    const response = await getKey(keyToUse);

    if (response.status === 'SUCCESS' && response.val) {
      const postsForServer = JSON.parse(response.val) as PostForServer[];
      const posts = postsForServer.map(convertServerToPostFormat);
      return posts;
    }

    return [];
  } catch (error) {
    console.error('KeyVal loadPosts error:', error);
    return [];
  }
};

export const savePost = async (post: Post): Promise<KeyValResponse> => {
  const postForServer = convertPostToServerFormat(post);
  const postJson = JSON.stringify(postForServer);
  const postHash = generateRandomHash();
  const key = `dnt03012001_${postHash}`;

  const result = await setKey(key, postJson);
  return result;
};

export const loadPost = async (postHash: string): Promise<Post | null> => {
  try {
    if (!postHash) {
      return null;
    }

    const response = await getKey(postHash);

    if (response.status === 'SUCCESS' && response.val) {
      const postForServer = JSON.parse(response.val) as PostForServer;
      const post = convertServerToPostFormat(postForServer);
      return post;
    }

    return null;
  } catch (error) {
    console.error('KeyVal loadPost error:', error);
    return null;
  }
};

export const deletePost = async (postHash: string): Promise<boolean> => {
  try {
    await setKey(`dnt03012001_${postHash}`, '');
    return true;
  } catch (error) {
    console.error('KeyVal deletePost error:', error);
    return false;
  }
};
