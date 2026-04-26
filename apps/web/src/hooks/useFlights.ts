import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '../lib/api';

export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: flightsApi.getAll,
  });
}
