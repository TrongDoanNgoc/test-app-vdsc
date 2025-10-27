import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import {AppState, type AppStateStatus} from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 2 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
focusManager.setEventListener(handleFocus => {
  const subscription = AppState.addEventListener(
    'change',
    (status: AppStateStatus) => {
      handleFocus(status === 'active');
    },
  );
  return () => subscription?.remove();
});
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

export function QueryProvider({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
