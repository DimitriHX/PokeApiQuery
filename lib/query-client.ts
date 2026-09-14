import { QueryClient } from "@tanstack/react-query";

export const oneDay = 24 * 60 * 60 * 1000;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: oneDay,
        gcTime: oneDay * 2,
        retry: 2,
      },
    },
  });
}
