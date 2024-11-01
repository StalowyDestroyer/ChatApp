import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { useAuthContext } from "../authContext/useAuth";
import { useEffect, useState } from "react";

export const useAuthenticatedQuery = <TData = unknown, TError = unknown>(
  key: string,
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>
): UseQueryResult<TData, TError> => {
  const { isAuth, isAuthLoading } = useAuthContext();

  const [hasFetched, setHasFetched] = useState(false);

  const query = useQuery<TData, TError>(key, queryFn, {
    ...options,
    enabled: false,
  });

  useEffect(() => {
    if (!isAuthLoading && isAuth && !hasFetched) {
      query.refetch();
      setHasFetched(true);
    }
  }, [isAuth, isAuthLoading, hasFetched, query]);

  return query;
};
