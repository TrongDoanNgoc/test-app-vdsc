import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {API_CONSTANTS} from '@/constants/api';

/**
 * Hook để trigger Random User API call trên toàn app
 * Đảm bảo API được gọi mỗi 10 giây ngay cả khi không có component nào sử dụng useRandomUser
 */
export const useRandomUserSideEffect = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Trigger initial fetch
    queryClient.prefetchQuery({
      queryKey: ['randomUser'],
      queryFn: async () => {
        const response = await fetch('https://randomuser.me/api');
        if (!response.ok) {
          throw new Error('Failed to fetch random user');
        }
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ['randomUser'],
      });
    }, API_CONSTANTS.RANDOM_USER_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [queryClient]);
};
