import {Drawer} from 'react-native-drawer-layout';
import {
  Alert,
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {User} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RandomUser from '@/components/RandomUser';
import {Key, MMKVStore} from '@/storages/mmkv';
import {usePostsStore} from '@/stores/PostsStore';

const {width: winDim} = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const Home = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const openUserDrawer = () => {
    setLeftDrawerOpen(true);
  };

  const handleClearPosts = () => {
    usePostsStore.getState().clearPosts();
    setLeftDrawerOpen(false);
  };

  const renderLeftDrawer = () => (
    <View style={[styles.drawerContainer, {paddingTop: insets.top}]}>
      <Text style={styles.drawerTitle}>User Menu</Text>
      <View style={styles.drawerContent}>
        <Button title="Profile" onPress={() => {}} />
        <Button title="Settings" onPress={() => {}} />
        <Button title="Logout" onPress={() => {}} />
        <Button title="Clear Posts" onPress={handleClearPosts} />
      </View>
    </View>
  );

  return (
    <Drawer
      renderDrawerContent={renderLeftDrawer}
      drawerStyle={styles.drawerStyle}
      open={leftDrawerOpen}
      onOpen={() => setLeftDrawerOpen(true)}
      onClose={() => setLeftDrawerOpen(false)}
      drawerPosition="left"
      swipeEdgeWidth={winDim}
      swipeMinVelocity={100}
      swipeMinDistance={10}
      drawerType={isIOS ? 'slide' : 'front'}
      overlayStyle={styles.overlayStyle}>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openUserDrawer} style={styles.iconButton}>
            <User size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Home</Text>
          </View>

          <View style={styles.iconButton} />
        </View>

        <View style={styles.content}>
          <RandomUser />
        </View>
      </View>
    </Drawer>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  drawerStyle: {
    width: Math.min(400, winDim * 0.8),
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  drawerContent: {
    marginTop: 20,
  },
  drawerText: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
