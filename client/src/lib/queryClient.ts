import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  urlOrMethod: string,
  urlOrOptions?: string | {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  },
  data?: any
): Promise<Response> {
  // Handle both usage patterns:
  // 1. apiRequest(url, options)
  // 2. apiRequest(method, url, data)
  
  let url: string;
  let options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {};
  
  if (typeof urlOrOptions === 'string') {
    // It's the apiRequest(method, url, data) pattern
    const method = urlOrMethod;
    url = urlOrOptions;
    options = {
      method,
      ...(data && { body: JSON.stringify(data) })
    };
  } else {
    // It's the apiRequest(url, options) pattern
    url = urlOrMethod;
    options = urlOrOptions || {};
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
