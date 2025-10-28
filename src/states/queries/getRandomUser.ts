import {useQuery} from '@tanstack/react-query';
import {RandomUserResponse} from '@/models/RandomUser';

const fetchRandomUser = async (): Promise<RandomUserResponse> => {
  const response = await fetch('https://randomuser.me/api');
  if (!response.ok) {
    throw new Error('Failed to fetch random user');
  }
  return response.json();
};

export const useRandomUser = () => {
  return useQuery({
    queryKey: ['randomUser'],
    queryFn: fetchRandomUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
