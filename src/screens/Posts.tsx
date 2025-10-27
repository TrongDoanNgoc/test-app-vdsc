import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import {Key, MMKVStore} from '@/storages/mmkv';
import {SafeAreaView} from 'react-native-safe-area-context';

const Posts = () => {
  const handleSetDemo = () => {
    MMKVStore.set(Key.demo, 'tes-mmkv');
  };

  const demo = MMKVStore.get(Key.demo);
  console.log(demo);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handleSetDemo}>
        <Text>Set Demo</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
