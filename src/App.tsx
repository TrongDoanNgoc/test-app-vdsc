import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {navigationRef} from '@/services/navigationRef';
import {Routes} from './navigation/Routes';
import {QueryProvider} from '@/lib/react-query';
import {globalStyles} from '@/styles/globalStyles';

const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={globalStyles.flex}>
        <QueryProvider>
          <NavigationContainer ref={navigationRef}>
            <Routes />
          </NavigationContainer>
        </QueryProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
