import React from 'react';
import {Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Text>Hello World</Text>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
