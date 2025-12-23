// =============================================================================
// USE API HOOK - DOTT. BERNARDO GIAMMETTA
// Hook React per chiamate API con retry, caching e gestione errori
// =============================================================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// TIPI
// =============================================================================

export interface ApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseApiOptions {
  // Retry
  maxRetries?: number;
  retryDelay?: number;
  
  // Cache
  cacheKey?: string;
  cacheTTL?: number; // in ms
  
  // Callbacks
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  
  // Auto-fetch
  immediate?: boolean;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

// =============================================================================
// CACHE IN-MEMORY
// =============================================================================

const apiCache = new Map<string, CacheEntry>();

function getCached<T>(key: string): T | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttl: number): void {
  apiCache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

export function clearApiCache(keyPattern?: string): void {
  if (keyPattern) {
    const keys = Array.from(apiCache.keys());
    keys.forEach((key) => {
      if (key.includes(keyPattern)) {
        apiCache.delete(key);
      }
    });
  } else {
    apiCache.clear();
  }
}

// =============================================================================
// HOOK PRINCIPALE
// =============================================================================

export function useApi<T = unknown>(
  url: string,
  options: UseApiOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minuti default
    onSuccess,
    onError,
    immediate = false,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Cleanup al unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Funzione fetch con retry
  const fetchWithRetry = useCallback(
    async (
      fetchUrl: string,
      fetchOptions: RequestInit = {},
      attempt = 0
    ): Promise<T> => {
      try {
        const response = await fetch(fetchUrl, {
          ...fetchOptions,
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.data ?? data;
      } catch (error) {
        // Non riprovare se aborted
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        // Retry se non abbiamo esaurito i tentativi
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
          return fetchWithRetry(fetchUrl, fetchOptions, attempt + 1);
        }

        throw error;
      }
    },
    [maxRetries, retryDelay]
  );

  // GET request
  const get = useCallback(
    async (queryParams?: Record<string, string>): Promise<T | null> => {
      // Cancella richiesta precedente
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Costruisci URL con query params
      let fullUrl = url;
      if (queryParams) {
        const params = new URLSearchParams(queryParams);
        fullUrl = `${url}?${params.toString()}`;
      }

      // Controlla cache
      const effectiveCacheKey = cacheKey || fullUrl;
      const cached = getCached<T>(effectiveCacheKey);
      if (cached) {
        setState({
          data: cached,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        return cached;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await fetchWithRetry(fullUrl);

        if (!mountedRef.current) return null;

        // Salva in cache
        setCache(effectiveCacheKey, data, cacheTTL);

        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        onSuccess?.(data);
        return data;
      } catch (error) {
        if (!mountedRef.current) return null;

        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        onError?.(errorMessage);
        return null;
      }
    },
    [url, cacheKey, cacheTTL, fetchWithRetry, onSuccess, onError]
  );

  // POST request
  const post = useCallback(
    async (body: unknown): Promise<T | null> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await fetchWithRetry(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!mountedRef.current) return null;

        // Invalida cache correlata
        if (cacheKey) {
          clearApiCache(cacheKey);
        }

        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        onSuccess?.(data);
        return data;
      } catch (error) {
        if (!mountedRef.current) return null;

        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        onError?.(errorMessage);
        return null;
      }
    },
    [url, cacheKey, fetchWithRetry, onSuccess, onError]
  );

  // PUT request
  const put = useCallback(
    async (body: unknown): Promise<T | null> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await fetchWithRetry(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!mountedRef.current) return null;

        if (cacheKey) {
          clearApiCache(cacheKey);
        }

        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        onSuccess?.(data);
        return data;
      } catch (error) {
        if (!mountedRef.current) return null;

        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        onError?.(errorMessage);
        return null;
      }
    },
    [url, cacheKey, fetchWithRetry, onSuccess, onError]
  );

  // DELETE request
  const del = useCallback(async (): Promise<T | null> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchWithRetry(url, { method: 'DELETE' });

      if (!mountedRef.current) return null;

      if (cacheKey) {
        clearApiCache(cacheKey);
      }

      setState({
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      onSuccess?.(data);
      return data;
    } catch (error) {
      if (!mountedRef.current) return null;

      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      onError?.(errorMessage);
      return null;
    }
  }, [url, cacheKey, fetchWithRetry, onSuccess, onError]);

  // Reset state
  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  // Auto-fetch se immediate
  useEffect(() => {
    if (immediate) {
      get();
    }
  }, [immediate, get]);

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    reset,
    refetch: get,
  };
}

// =============================================================================
// HOOK SEMPLIFICATO PER MUTATION
// =============================================================================

export function useMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
    invalidateCache?: string[];
  } = {}
) {
  const [state, setState] = useState<{
    data: TData | null;
    error: string | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const data = await mutationFn(variables);

        setState({ data, error: null, isLoading: false });

        // Invalida cache
        options.invalidateCache?.forEach((key) => clearApiCache(key));

        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        setState({ data: null, error: errorMessage, isLoading: false });
        options.onError?.(errorMessage);
        return null;
      }
    },
    [mutationFn, options]
  );

  return {
    ...state,
    mutate,
    isSuccess: state.data !== null,
    isError: state.error !== null,
  };
}

export default useApi;
