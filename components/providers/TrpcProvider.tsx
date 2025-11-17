"use client";

import { ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { customTransformer } from "@/server/utils/transformer";
import { api, getBaseUrl } from "@/lib/trpc/react";

export default function TrpcProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(
    () =>
      api.createClient({
        links: [
          loggerLink({ enabled: () => process.env.NODE_ENV === "development" }),
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: customTransformer,
          }),
        ],
      }),
    []
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
