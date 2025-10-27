import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

import {type RootStackParamList} from '@/navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export interface INavigationProps {
  readonly key: keyof RootStackParamList;
  readonly params?: RootStackParamList[keyof RootStackParamList];
}

export interface INavigationGoBackProps extends INavigationProps {
  readonly backScreenPosition: number;
}

export function navigateWithoutType(params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(params.key, params.params);
  }
}

export const goBackScreen = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};
export const navigatePop = (numOfScreen: number = 1) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(numOfScreen));
  }
};

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: // this first condition allows us to iterate over a union type
  // This is to avoid getting a union of all the params from `ParamList[RouteName]`,
  // which will get our types all mixed up if a union RouteName is passed in.
  RouteName extends unknown
    ? // This condition checks if the params are optional,
      // which means it's either undefined or a union with undefined
      undefined extends RootStackParamList[RouteName]
      ?
          | [screen: RouteName] // if the params are optional, we don't have to provide it
          | [screen: RouteName, params: RootStackParamList[RouteName]]
      : [screen: RouteName, params: RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}

export function navigatePush<RouteName extends keyof RootStackParamList>(
  ...args: // this first condition allows us to iterate over a union type
  // This is to avoid getting a union of all the params from `ParamList[RouteName]`,
  // which will get our types all mixed up if a union RouteName is passed in.
  RouteName extends unknown
    ? // This condition checks if the params are optional,
      // which means it's either undefined or a union with undefined
      undefined extends RootStackParamList[RouteName]
      ?
          | [screen: RouteName] // if the params are optional, we don't have to provide it
          | [screen: RouteName, params: RootStackParamList[RouteName]]
      : [screen: RouteName, params: RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(args[0], args[1]));
  }
}

export function navigateBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function navigateReplace(
  screenName: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(screenName, params));
  }
}

export function canGoBack() {
  return navigationRef.isReady() && navigationRef.canGoBack();
}

export function navigateClean(
  goToParams: INavigationProps,
  goBackParams?: INavigationProps | INavigationGoBackProps[], // Truyền backScreenPosition theo thứ tự back về
) {
  if (navigationRef.isReady()) {
    const routes = [
      {
        name: goToParams.key,
        params: goToParams.params,
      },
    ];
    if (goBackParams != null) {
      const isArr = Array.isArray(goBackParams);
      let routesTemp;

      if (isArr) {
        goBackParams.sort((a, b) => {
          return b.backScreenPosition - a.backScreenPosition;
        });
        routesTemp = goBackParams.map(el => ({
          name: el.key,
          params: el.params,
        }));
      } else {
        routesTemp = [
          {
            name: goBackParams.key,
            params: goBackParams.params,
          },
        ];
      }
      routes.unshift(...routesTemp);
    }
    navigationRef.dispatch(
      CommonActions.reset({
        index: routes.length - 1,
        routes,
      }),
    );
  }
}

export function clearHistoryAndNavigate(params: INavigationProps) {
  if (navigationRef.isReady()) {
    const routeLength = navigationRef.current?.getState()?.routes?.length ?? 0;
    if (navigationRef.canGoBack() && routeLength > 1) {
      navigationRef.dispatch(StackActions.popToTop());
    }
    navigateClean(params);
  }
}

export function getCurrentScreen() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return undefined;
}

export function getAllParentScreen(position?: number) {
  if (navigationRef.isReady()) {
    return position
      ? navigationRef.getParent()?.getState().routes[position]
      : navigationRef.getParent()?.getState();
  }
  return undefined;
}
