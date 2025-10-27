import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, FileText, User as UserIcon} from 'lucide-react-native';
import React from 'react';
import {useColorScheme} from 'react-native';
import HomeScreen from '@/screens/Home';
import PostsScreen from '@/screens/Posts';
import UserScreen from '@/screens/User';
import {RootStackParamList} from './types';

const BottomTab = createBottomTabNavigator<RootStackParamList>();

const HomeTabIcon = (props: {color: string; size: number}) => (
  <Home size={props.size} color={props.color} />
);

const PostsTabIcon = (props: {color: string; size: number}) => (
  <FileText size={props.size} color={props.color} />
);

const UserTabIcon = (props: {color: string; size: number}) => (
  <UserIcon size={props.size} color={props.color} />
);

export const Routes = () => {
  const isDark = useColorScheme() === 'dark';

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderTopColor: isDark ? '#38383A' : '#E5E5EA',
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <BottomTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarLabel: 'Posts',
          tabBarIcon: PostsTabIcon,
        }}
      />
      <BottomTab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: UserTabIcon,
        }}
      />
    </BottomTab.Navigator>
  );
};
