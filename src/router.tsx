import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { APP_CONFIG } from "./config/app.config";
import { routeTree } from "./routeTree.gen";

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: APP_CONFIG.query.defaultStaleTimeMilliseconds,
        gcTime: APP_CONFIG.query.defaultGcTimeMilliseconds,
        retry: APP_CONFIG.query.retryAttempts,
        refetchOnWindowFocus: APP_CONFIG.query.refetchOnWindowFocus,
      },
    },
  });
}

export const getRouter = () => {
  const queryClient = createAppQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
