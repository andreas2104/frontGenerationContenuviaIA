import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "@/services/entityService";

export const useEntity = <T>(entityName: string) => {
  const query = useQuery<T[], Error>({
    queryKey: [entityName],
    queryFn: () => fetchEntity<T>(entityName),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};