import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
