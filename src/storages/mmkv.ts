import {createMMKV} from 'react-native-mmkv';

export const mmkv = createMMKV();

export enum Key {
  demo = 'demo-1',
  keyPosts = 'dnt_posts_key',
}

export const MMKVStore = {
  set: (key: string, value: any) => {
    mmkv.set(key, JSON.stringify(value));
  },
  get: (key: string) => {
    const value = mmkv.getString(key);
    return value ? JSON.parse(value) : null;
  },
  remove: (key: string) => {
    mmkv.remove(key);
  },
};
