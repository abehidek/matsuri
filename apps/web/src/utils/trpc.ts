import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// config this when you start using tRPC
import type { AppRouter } from "../../../server/src/router/root"; // import AppRoter type from server

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${"http://localhost:4000"}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
