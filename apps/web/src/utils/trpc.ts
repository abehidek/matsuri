import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// config this when you start using tRPC
import { type AppRouter } from "../../../server/src/router/root"; // import AppRoter type from server
import { env } from "env";

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${env.PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
