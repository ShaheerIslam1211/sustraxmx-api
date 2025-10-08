/**
 * useAsync Hook
 * Handle async operations with loading, error, and data states
 */

import { useState, useEffect, useCallback, useRef } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  resetOnExecute?: boolean;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, resetOnExecute = true } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      if (!isMountedRef.current) return;

      if (resetOnExecute) {
        setState({
          data: null,
          loading: true,
          error: null,
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
        }));
      }

      try {
        const result = await asyncFunction(...args);

        if (isMountedRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }

        return result;
      } catch (error) {
        if (isMountedRef.current) {
          setState({
            data: null,
            loading: false,
            error: error as Error,
          });
        }
        throw error;
      }
    },
    [asyncFunction, resetOnExecute]
  );

  const reset = useCallback(() => {
    if (!isMountedRef.current) return;

    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
