import {RootStackParamList} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const Routes = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={Home} />
    </RootStack.Navigator>
  );
};
