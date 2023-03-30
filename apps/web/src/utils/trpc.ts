import { TRPCClientErrorLike, createTRPCProxyClient, httpBatchLink } from "@trpc/client";
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

export type TRPCResponseError = TRPCClientErrorLike<AppRouter>

export const isTRPCResponseError = (error: unknown): error is TRPCResponseError => {
  if (typeof error === "object" && error && "message" in error && "data" in error && typeof error.data === "object" && error.data && "httpStatus" in error.data) {
    return true;
  }
  return false
}
